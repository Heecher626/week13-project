const express = require('express')

const router = express.Router()
const {Event, Group, Venue, User, sequelize, EventImage} = require('../../db/models')
const group = require('../../db/models/group')

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

module.exports = router
