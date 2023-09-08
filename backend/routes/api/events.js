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

module.exports = router
