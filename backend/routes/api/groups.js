const express = require('express')

const router = express.Router()
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')
const {Group, User, Membership, sequelize, GroupImage, Venue} = require('../../db/models')
const user = require('../../db/models/user')


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

module.exports = router
