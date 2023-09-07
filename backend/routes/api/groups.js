const express = require('express')

const router = express.Router()
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const {Group, User, Membership, sequelize, GroupImage, Venue} = require('../../db/models');
const { json } = require('sequelize');


router.get('/', async (req, res)=> {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        as: "members",
        attributes: [],
      },
      {
        model: GroupImage
      }
    ],

    attributes: {
      include: [
        [
         sequelize.fn('COUNT', sequelize.col('members.id')), 'numMembers'
        ]
      ]
    },
    group: 'members.id'
  })

  let groupList = []

  groups.forEach(group => {
    groupList.push(group.toJSON())
  });

  groupList.forEach(group => {
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

router.get('/current', requireAuth, async (req, res) => {


  const groups = await Group.findAll({
    include: [
      {
        model: User,
        as: "members",
        attributes: [],
        where: {
          id: req.user.id
        }
      },
      {
        model: GroupImage
      }
    ],

    attributes: {
      include: [
        [
         sequelize.fn('COUNT', sequelize.col('members.id')), 'numMembers'
        ]
      ]
    },
    group: 'members.id'
  })

  let groupList = []

  groups.forEach(group => {
    groupList.push(group.toJSON())
  });

  groupList.forEach(group => {
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
        model: GroupImage
      },
      {
        model: User,
        as: "members",
        attributes: []
      },
      {
        model: User,
        as: 'Organizer'
      },
      {
        model: Venue
      },
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('members.id')), 'numMembers']
      ]
    },
    group: 'members.id'
  })

  if(!group){
    res.status = 404
    res.json({message: "Group couldn't be found"})
  }

  res.json(group)
})

const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
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

  res.json(group)
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

  res.json(targetGroup)
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


  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  const {address, city, state, lat, lng} = req.body

  const venue = await targetGroup.createVenue({address, city, state, lat, lng})

  const safeVenue = {
    id: venue.Id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng
  }

  res.json(safeVenue)
})

//check if venue doesn't exist?
const validateEvent = [
  check('name')
    .exists({checkFalsy: true})
    .withMessage("Name must be at least 5 characters"),
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

  if(targetGroup.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body

  const newEvent = await targetGroup.createEvent({venueId, name, type, capacity, price, description, startDate, endDate})

  const safeEvent = {
    id: newEvent.id,
    groupId: targetGroup.id,
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
module.exports = router
