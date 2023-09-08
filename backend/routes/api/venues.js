const express = require('express')

const router = express.Router()
const { requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')

const { Venue, Group, Membership } = require('../../db/models')

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

router.put('/:venueId', requireAuth, checkVenue, async (req, res) => {

  let targetVenue = await Venue.findByPk(req.params.venueId)

  if(!targetVenue){
    res.status = 404
    return res.json({message: "Venue couldn't be found"})
  }

  let group = await targetVenue.getGroup()

  let membership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: req.user.id
    }
  })

  if(group.organizerId != req.user.id && membership.status != "co-host"){
    res.status(403)
    return res.json({message: "Forbidden"})
  }

  const {address, city, state, lat, lng} = req.body

  targetVenue.address = address
  targetVenue.city = city
  targetVenue.state = state
  targetVenue.lat = lat
  targetVenue.lng = lng

  await targetVenue.save()

  const safeVenue = {
    id: targetVenue.id,
    groupId: targetVenue.groupId,
    address: targetVenue.address,
    city: targetVenue.city,
    state: targetVenue.state,
    lat: targetVenue.lat,
    lng: targetVenue.lng
  }

  res.json(safeVenue)
})


module.exports = router
