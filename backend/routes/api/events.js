const express = require('express')

const router = express.Router()
const {Event, Group, Membership, Attendance, Venue, User, sequelize, EventImage} = require('../../db/models')
const group = require('../../db/models/group')
const { requireAuth } = require('../../utils/auth')
const event = require('../../db/models/event')

router.get('/', async (req, res) => {
  const eventsList = await Event.findAll({
    attributes: {
      include: [
        'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate',
        [
          sequelize.fn('COUNT', sequelize.col('Users.id')), 'numAttending'
        ]
      ]
    },

    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'city', 'state']
      },
      {
        model: Venue,
        attributes: ['id', 'city', 'state']
      },
      {
        model: User,
        attributes: []
      },
      {
        model: EventImage
      }
    ],
    group: 'Users.id',
  })

  let events = []

  eventsList.forEach(event => {
    events.push(event.toJSON())
  })

  events.forEach(event => {
    event.EventImages.forEach(image => {
      if(image.preview == true){
        event.previewImage = image.url
      }
    })
    event.EventImages = undefined
    if(!event.previewImage) event.previewImage = "No preview image"
    if(!event.venueId){
      event.venueId = null
      event.Venue = null
    }
  })

  res.json({Events: events})
})

router.get('/:eventId', async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      include: [
        [
          sequelize.fn('COUNT', sequelize.col('Users.id')), 'numAttending'
        ]
      ],
      exclude: ['createdAt', 'updatedAt']
    },

    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'private', 'city', 'state']
      },
      {
        model: Venue,
        attributes: {
          exclude: ['groupId', 'createdAt', 'updatedAt']
        }
      },
      {
        model: User,
        attributes: []
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      }
    ],
    group: 'Users.id',
  })

  res.json(event)
})

router.post('/:eventId/images', requireAuth, async (req, res) => {
  const targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    res.json({message: "Event couldn't be found"})
  }

  //let group = await targetEvent.getGroup()

  let attendance = await Attendance.findOne({
    where: {
      userId: req.user.id,
      eventId: req.params.eventId
    }
  })

  console.log(attendance)

  let authorizedRoles = ['attendee', 'host', 'co-host']
  if(authorizedRoles.indexOf(attendance.status) !== -1){
    res.status(403)
    return res.json({message: "Forbidden"})
  }


  const {url, preview} = req.body

  let newImage = await targetEvent.createEventImage({url, preview})

  let safeImage = {
    id: newImage.id,
    url,
    preview
  }

  res.json(safeImage)
})

router.delete('/:eventId', requireAuth, async (req, res) => {
  let targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    return res.json({message: "Event couldn't be found"})
  }

  let targetGroup = await targetEvent.getGroup()

  let membership = await Membership.findOne({
    where: {
      groupId: targetGroup.id,
      userId: req.user.id
    }
  })

  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  await targetEvent.destroy()

  res.json({message: "Successfully deleted"})
})

router.get('/:eventId/attendees', async (req, res) => {
  let targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    return res.json({message: "Event couldn't be found"})
  }

  let targetGroup = await targetEvent.getGroup()

  //here

  let membership = await Membership.findOne({
    where: {
      groupId: targetGroup.id,
      userId: req.user.id
    }
  })

  let attendances = await targetEvent.getUsers({
    attributes: {
      exclude: ['username']
    },
    joinTableAttributes: ['status'],

  })

  if(targetGroup.organizerId == req.user.id || membership.status == "co-host"){
    let jsonAttendances = []

    attendances.forEach(attendance => {
      jsonAttendances.push(attendance.toJSON())
    })

    jsonAttendances.filter(attendee => {
      attendee.Attendance.status != 'pending'
    })

    res.json({Attendees: jsonAttendances})
  }

  res.json({Attendees: attendances})
})

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
  let targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    res.json({message: "Event couldn't be found"})
  }

  let checkAttendance = await Attendance.findOne({
    where: {
      eventId: req.params.eventId,
      userId: req.user.id
    }
  })

  if(checkAttendance){
    res.status = 400
    if(checkAttendance.status == 'pending'){
      res.json({
        "message": "Attendance has already been requested"
      })
    }
    else{
      res.json({
        "message": "User is already an attendee of the Event"
      })
    }
  }

  await Attendance.create({userId: req.user.id, eventId: req.params.eventId, status: 'pending'})

  let safeAttendee = {
    userId: req.user.id,
    status: "pending"
  }

  res.json(safeAttendee)
})

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
  let targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    res.json({"message": "Event couldn't be found"})
  }

  let user = await User.findByPk(req.body.userId)

  if(!user){
    res.status = 400
    res.json({
      "message": "Validation Error",
      "errors": {
        "memberId": "User couldn't be found"
      }
    })
  }

  let attendance = await Attendance.findOne({
    where: {
      userId: req.body.userId,
      eventId: req.params.eventId
    }
  })

  if(!attendance){
    res.status = 404
    res.json({"message": "Attendance between the user and the event does not exist"})
  }

  if(req.body.status === "pending"){
    res.status = 400
    res.json({"message" : "Cannot change a membership status to pending"})
  }

  let targetGroup = await targetEvent.getGroup()

  let requesterMembership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: targetGroup.id
    }
  })


  if(targetGroup.organizerId != req.user.id && requesterMembership.status != "co-host"){
    res.status = 403
    res.json({message: 'Forbidden'})
  }

  attendance.status = req.body.status

  await attendance.save()

  let safeAttendance = {
    id: attendance.id,
    eventId: attendance.eventId,
    userId: attendance.userId,
    status: attendance.status
  }

  res.json(safeAttendance)
})

module.exports = router
