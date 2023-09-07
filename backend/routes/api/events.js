const express = require('express')

const router = express.Router()
const {Event, Group, Venue, User, sequelize, EventImage} = require('../../db/models')

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

  let Events = []

  eventsList.forEach(event => {

  })

  res.json({eventsList})
})

module.exports = router
