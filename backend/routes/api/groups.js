const express = require('express')

const router = express.Router()
// const {setTokenCookie, restoreUser } = require('../../utils/auth.js');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')
const {Group, User, Membership, sequelize, GroupImage} = require('../../db/models')

router.get('/', async (req, res)=> {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        attributes: [],
        where: {
          id: 1
        }
      },
      {
        model: GroupImage
      }
    ],

    attributes: {
      include: [
        [
         sequelize.fn('COUNT', sequelize.col('User.id')), 'numMembers'
        ]
      ]
    },
    group: 'User.id'
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

  res.json(groupList)
})

router.get('/current', async (req, res)=> {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: GroupImage
      }
    ],

    attributes: {
      include: [
        [
         sequelize.fn('COUNT', sequelize.col('User.id')), 'numMembers'
        ]
      ]
    },
    group: 'User.id'
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

  res.json(groupList)
})

module.exports = router
