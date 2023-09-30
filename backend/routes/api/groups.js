const express = require('express')

const router = express.Router()
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const {Group, Event, User, Membership, Attendance, sequelize, GroupImage, EventImage, Venue} = require('../../db/models');
const { json } = require('sequelize');
const group = require('../../db/models/group.js');

const formattedDate = (date) => {
  d = new Date(date);
  cd = (num) => num.toString().padStart(2, 0);
  return (
    d.getFullYear() +
    "-" +
    cd(d.getMonth() + 1) +
    "-" +
    cd(d.getDate()) +
    " " +
    cd(d.getHours()) +
    ":" +
    cd(d.getMinutes()) +
    ":" +
    cd(d.getSeconds())
  );
};


router.get('/', async (req, res)=> {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        as: "members",
        attributes: ['id'],
      },
      {
        model: GroupImage
      },
      {
        model: Event,
        attributes: ['id']
      }
    ],
  })

  let groupList = []


  groups.forEach(group => {
    groupList.push(group.toJSON())

  });

  groupList.forEach(group => {
    group.createdAt = formattedDate(group.createdAt)
    group.updatedAt = formattedDate(group.updatedAt)


    let memberCount = 0;
    if(!group.members.length){
      group.numMembers = 0
      group.members = undefined
    }
    else {
      group.members.forEach(user => {
        if(user.Membership.status != 'pending'){
          memberCount++
        }
      })
      group.numMembers = memberCount
      group.members = undefined
    }

    let numEvents = 0;

    group.Events.forEach(() => {
      numEvents++
    })

    group.numEvents = numEvents
    delete group.Events

    group.GroupImages.forEach(image => {
      if(image.preview == true){
        group.previewImage = image.url
      }
    })
    group.GroupImages = undefined
    if(!group.previewImage) group.previewImage = "No preview image"
  })

  //console.log(`groupList[0].countEvents(): `, await groupList[0].countEvents())
  await res.json({Groups: groupList})
})

router.get('/current', requireAuth, async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        as: "members",
        attributes: ['id'],
        where: {
          id: req.user.id
        }
      },
      {
        model: GroupImage
      }
    ],
  })

  let groupList = []

  groups.forEach(group => {
    groupList.push(group.toJSON())
  });

  groupList.forEach(group => {
    group.createdAt = formattedDate(group.createdAt)
    group.updatedAt = formattedDate(group.updatedAt)

    let memberCount = 0;
    if(!group.members.length){
      group.numMembers = 0
      group.members = undefined
    }
    else {
      group.members.forEach(user => {
        if(user.Membership.status != 'pending'){
          memberCount++
        }
      })
      group.numMembers = memberCount
      group.members = undefined
    }

    group.GroupImages.forEach(image => {
      if(image.preview == true){
        group.previewImage = image.url
      }
    })
    group.GroupImages = undefined
    if(!group.previewImage) group.previewImage = "No preview image"
  })


  res.json({Groups: groupList})
})

router.get('/:groupId', async (req, res) => {
  let group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: "members",
        attributes: ['id']
      },
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Venue
      },
      {
        model: Event
      }
    ],
  })

  if(!group){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  group = group.toJSON()

  group.createdAt = formattedDate(group.createdAt)
  group.updatedAt = formattedDate(group.updatedAt)

  let numEvents = 0

  group.Events.forEach(() => numEvents++)

  group.numEvents = numEvents

  delete group.Events

  let memberCount = 0;
    if(!group.members.length){
      group.numMembers = 0
      group.members = undefined
    }
    else {
      group.members.forEach(user => {
        if(user.Membership.status != 'pending'){
          memberCount++
        }
      })
      group.numMembers = memberCount
      group.members = undefined
    }

  res.json(group)
})

router.get('/:groupId/events', async (req, res) => {
  const targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  const eventsList = await Event.findAll({

    attributes: ['id', 'venueId', 'groupId', 'name', 'description', 'type','startDate','endDate'],

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
    where: {
      groupId: targetGroup.id
    },

  })

  let events = []

  eventsList.forEach(event => {
    events.push(event.toJSON())
  })

  events.forEach(event => {
    event.startDate = formattedDate(event.startDate)
    event.endDate = formattedDate(event.endDate)

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



const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check('type').custom( async (type) => {
    if(type != 'Online' && type != "In person"){
      throw new Error("Type must be 'Online' or 'In person")
    }
  }),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50, max: 1000 })
    .withMessage("About must be 50 characters or more"),
  check('private')
    .isBoolean()
    .withMessage("Private must be a boolean"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  handleValidationErrors
]


router.post('/', requireAuth, validateGroup, async (req, res) => {

  const {name, about, type, private, city, state} = req.body

  const group = await Group.create({name, organizerId: req.user.id, about, type, private, city, state})

  const membership = await Membership.create({userId: req.user.id, groupId: group.id, status: 'host'})

  let jsonGroup = group.toJSON()

  jsonGroup.createdAt = formattedDate(jsonGroup.createdAt)
  jsonGroup.updatedAt = formattedDate(jsonGroup.updatedAt)

  res.json(jsonGroup)

})

router.post('/:groupId/images', requireAuth, async (req, res) => {


  const targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  if(targetGroup.organizerId != req.user.id){
    res.status(403)
    res.json({message : "Forbidden"})
  }

  const {url, preview} = req.body

  const newImage = await targetGroup.createGroupImage({url, preview})

  let safeImage = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  }

  res.json(safeImage)
})

router.put('/:groupId', requireAuth, validateGroup, async (req, res) => {

  const targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  if(targetGroup.organizerId != req.user.id){
    res.status(403)
    res.json({message : "Forbidden"})
  }

  const {name, about, type, private, city, state} = req.body

  targetGroup.name = name
  targetGroup.about = about
  targetGroup.type = type
  targetGroup.private = private
  targetGroup.city = city
  targetGroup.state = state

  await targetGroup.save()

  let jsonResult = targetGroup.toJSON()

  jsonResult.createdAt = formattedDate(jsonResult.createdAt)
  jsonResult.updatedAt = formattedDate(jsonResult.updatedAt)

  res.json(jsonResult)
})

router.delete('/:groupId', requireAuth, async (req, res) => {
  const targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    return res.json({message: "Group couldn't be found"})
  }

  if(targetGroup.organizerId != req.user.id){
    res.status(403)
    return res.json({message : "Forbidden"})
  }

  await Group.destroy({
    where: {
      id: req.params.groupId
    }
  })

  res.json({message: "Successfully deleted"})

})

router.get('/:groupId/venues', requireAuth, async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    return res.json({message: "Group couldn't be found"})
  }

  let membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })

  if(!membership){
    res.status(403)
    res.json({message: "Forbidden"})
  }


  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  let venues = await targetGroup.getVenues()

  res.json({Venues: venues})
})

const checkVenue = [
  check('address')
    .exists({checkFalsy: true})
    .withMessage("Street address is required"),
  check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .withMessage("State is required"),
  check("lat")
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage("Longitude is not valid"),
  handleValidationErrors
]

router.post('/:groupId/venues', requireAuth, checkVenue, async (req, res) => {

  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    return res.json({message: "Group couldn't be found"})
  }

  let membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })

  if(!membership){
    res.status(403)
    res.json({message: "Forbidden"})
  }

  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  const {address, city, state, lat, lng} = req.body

  const venue = await targetGroup.createVenue({address, city, state, lat, lng})

  const safeVenue = {
    id: venue.id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng
  }

  res.json(safeVenue)
})

const validateEvent = [
  // check("venueId").custom(async (venueId) => {
  //   const venue = await Venue.findByPk(venueId)
  //   if(!venue){
  //     throw new Error("Venue does not exist")
  //   }
  // }),
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

router.post('/:groupId/events', requireAuth, validateEvent, async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    return res.json({message: "Group couldn't be found"})
  }

  let membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })

  if(!membership){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
  console.log('\n\nbefore 552\n', req.body, '\n\n')
  const newEvent = await targetGroup.createEvent({venueId, name, type, capacity, price, description, startDate, endDate})
  console.log('\n\nafter 552\n\n')
  const attendance = Attendance.create({userId: req.user.id, eventId: newEvent.id, status: 'host'})

  const safeEvent = {
    id: newEvent.id,
    groupId: targetGroup.id,
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate: formattedDate(newEvent.startDate),
    endDate: formattedDate(newEvent.endDate)
  }

  res.json(safeEvent)
})

router.get('/:groupId/members', async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    return res.json({message: "Group couldn't be found"})
  }

  let membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })



  let members = await targetGroup.getMembers({

    attributes: ['id', 'firstName', 'lastName'],

    joinTableAttributes: ['status'],

  })

  if(targetGroup.organizerId == req.user.id || membership.status == "co-host"){
    let jsonMembers = []

    members.forEach(member => {
      jsonMembers.push(member.toJSON())
    })

    jsonMembers.filter(member => {
      member.Membership.status != 'pending'
    })

    res.json({Members: jsonMembers})
  }



  res.json({Members: members})
})

router.post('/:groupId/membership', requireAuth, async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  let checkMembership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })

  if(checkMembership){
    res.status = 400
    if(checkMembership.status == 'pending'){
      res.json({
        "message": "Membership has already been requested"
      })
    }
    else{
      res.json({
        "message": "User is already a member of the group"
      })
    }
  }

  await Membership.create({userId: req.user.id, groupId: req.params.groupId, status: 'pending'})

  let safeMember = {
    memberId: req.user.id,
    status: "pending"
  }

  res.json(safeMember)
})

router.put('/:groupId/membership', requireAuth, async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({"message": "Group couldn't be found"})
  }

  let user = await User.findByPk(req.body.memberId)

  if(!user){
    res.status = 400
    res.json({
      "message": "Validation Error",
      "errors": {
        "memberId": "User couldn't be found"
      }
    })
  }

  let membership = await Membership.findOne({
    where: {
      userId: req.body.memberId,
      groupId: req.params.groupId
    }
  })

  if(!membership){
    res.status = 404
    res.json({"message": "Membership between the user and the group does not exist"})
  }

  if(req.body.status === "pending"){
    res.status = 400
    res.json({
      "message": "Validations Error",
      "errors": {
        "status" : "Cannot change a membership status to pending"
      }
    })
  }

  let requesterMembership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: req.params.groupId
    }
  })

  if(req.body.status === "member"){
    if(targetGroup.organizerId != req.user.id && requesterMembership.status != "co-host"){
      res.status = 403
      res.json({message: 'Forbidden'})
    }
    membership.status = req.body.status
    await membership.save()
  }

  if(req.body.status === "co-host"){
    if(targetGroup.organizerId != req.user.id){
      res.status = 403
      res.json({message: 'Forbidden'})
    }
    membership.status = req.body.status

    await membership.save()
  }

  let safeMembership = {
    id: membership.id,
    groupId: membership.groupId,
    memberId: membership.userId,
    status: membership.status
  }

  res.json(safeMembership)
})

router.delete('/:groupId/membership', requireAuth, async (req, res) => {
  let targetGroup = await Group.findByPk(req.params.groupId)

  if(!targetGroup){
    res.status = 404
    res.json({"message": "Group couldn't be found"})
  }

  let user = await User.findByPk(req.body.memberId)

  if(!user){
    res.status = 400
    res.json({
      "message": "Validation Error",
      "errors": {
        "memberId": "User couldn't be found"
      }
    })
  }

  let membership = await Membership.findOne({
    where: {
      userId: req.body.memberId,
      groupId: req.params.groupId
    }
  })

  if(!membership){
    res.status = 404
    res.json({"message": "Membership between the user and the group does not exist"})
  }


  if(targetGroup.organizerId != req.user.id && membership.userId != req.user.id){
    res.status = 403
    res.json({message: "Forbidden"})
  }

  await membership.destroy()

  res.json({"message": "Successfully deleted membership from group"})
})

module.exports = router
