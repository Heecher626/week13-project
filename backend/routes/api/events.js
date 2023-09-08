const express = require('express')

const router = express.Router()
const {Event, Group, Membership, Attendance, Venue, User, sequelize, EventImage} = require('../../db/models')
const group = require('../../db/models/group')
const { requireAuth } = require('../../utils/auth')
const event = require('../../db/models/event')
const { handleValidationErrors } = require('../../utils/validation')
const { check } = require('express-validator');


router.get('/', async (req, res) => {
  let errors = {}
  let where = {}
  let pagination = {}
  let tempPage

  const {page, size, name, type, startDate} = req.query

  if(page){
    if(page < 1){
      errors.page = "Page must be greater than or equal to 1"
    }
    else if (page > 10){
      tempPage = 10
    }
    else {
      tempPage = page
    }
  }
  else {
    tempPage = 1
  }

  if(size){
    if(size < 1){
      errors.size = "Size must be greater than or equal to 1"
    }
    else if (size > 20){
      pagination.limit = 20
    }
    else {
      pagination.limit = size
    }
  }
  else {
    pagination.limit = 20
  }

  if(name) {
    if(typeof name != 'string'){
      errors.name = "Name must be a string"
    }
    else {
      where.name = name
    }
  }

  if(type){
    if(type != 'In person' && type != 'Online'){
      errors.type = "Type must be 'Online' or 'In person'"
    }
    else {
      where.type = type
    }
  }

  if(startDate){
    let testDate = new Date(startDate)
    if(isNaN(testDate)) {
      errors.startDate = 'Start date must be a valid datetime'
    }
    else {
      where.startDate = startDate;
    }
  }

  if (
    errors.page ||
    errors.size ||
    errors.name ||
    errors.type ||
    errors.startDate
  ) {
    res.status(400)
    return res.json({
      message: 'BadRequest',
      errors
    })
  }

  pagination.offset = (tempPage - 1) * pagination.limit


  const eventsList = await Event.findAll({

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
        model: Attendance,
      },
      {
        model: EventImage
      }
    ],
    where,
    ...pagination
  })

  let events = []

  eventsList.forEach(event => {
    events.push(event.toJSON())
  })

  events.forEach(event => {
    let attendanceCount = 0
    if(!event.Attendances.length) {
      event.numAttending = 0;
      event.Attendances
    }

    event.Attendances.forEach(attendance => {
      if (attendance.status === "attending"){
        attendanceCount++
      }
    })
    event.numAttending = attendanceCount
    event.Attendances = undefined


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
        model: Attendance,
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      }
    ],
  })

  let jsonEvent = event.toJSON()

  let attendanceCount = 0
    if(!jsonEvent.Attendances.length) {
      jsonEvent.numAttending = 0;
      jsonEvent.Attendances
    }

    jsonEvent.Attendances.forEach(attendance => {
      if (attendance.status === "attending"){
        attendanceCount++
      }
    })
    jsonEvent.numAttending = attendanceCount
    jsonEvent.Attendances = undefined


  res.json(jsonEvent)
})

router.post('/:eventId/images', requireAuth, async (req, res) => {
  const targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    res.json({message: "Event couldn't be found"})
  }

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

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
  let targetEvent = await Event.findByPk(req.params.eventId)

  if(!targetEvent){
    res.status = 404
    res.json({"message": "Event couldn't be found"})
  }

  let user = await User.findByPk(req.body.userId)

  let targetGroup = await targetEvent.getGroup()

  let attendance = await Attendance.findOne({
    where: {
      userId: req.body.userId,
      eventId: req.params.eventId
    }
  })

  let membership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: targetGroup.id
    }
  })

  if(!attendance){
    res.status = 404
    res.json({"message": "Attendance does not exist for this User"})
  }


  if(membership.status != 'host' && attendance.userId != req.user.id){
    res.status = 403
    res.json({message: "Only the User or organizer may delete an Attendance"})
  }

  await attendance.destroy()

  res.json({"message": "Successfully deleted attendance from event"})
})

const validateEvent = [
  check("venueId").custom(async (venueId) => {
    const venue = await Venue.findByPk(venueId)
    if(!venue){
      throw new Error("Venue does not exist")
    }
  }),
  check('name')
    .exists({checkFalsy: true})
    .withMessage("Name must be at least 5 characters"),
  check('type').custom( async (type) => {
    if(type != 'Online' && type != "In person"){
      throw new Error("Type must be 'Online' or 'In person")
    }
  }),
  check('capacity')
    .exists({checkFalsy: true})
    .isNumeric({min: 0})
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({checkFalsy: true})
    .isNumeric({min: 0})
    .withMessage('Price is invalid'),
  check('description')
    .exists({checkFalsy: true})
    .withMessage('Description is required'),
  check('startDate')
    .exists({checkFalsy: true})
    .isAfter(Date(Date.now()))
    .withMessage("Start date must be in the future"),
  check('endDate').custom(async (endDate, {req}) => {
    let startDate = req.body.startDate
    if(endDate < startDate){
      throw new Error("End date is less than start date")
    }
  }),
  handleValidationErrors
]

router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
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

  const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body

  await targetEvent.set({venueId, name, type, capacity, price, description, startDate, endDate})

  const safeEvent = {
    id: targetEvent.id,
    groupId: targetEvent.groupId,
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  }

  res.json(safeEvent)
} )
module.exports = router
