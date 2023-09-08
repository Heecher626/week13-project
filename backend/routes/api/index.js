const express = require('express');
const router = express.Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const venuesRouter = require('./venues.js')
const eventsRouter = require('./events.js')

const { restoreUser, requireAuth } = require('../../utils/auth.js')
const { User, Group, GroupImage, EventImage, Membership } = require('../../db/models')
// const { requireAuth } = require('../../utils/auth.js')

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter)
router.use('/groups', groupsRouter)
router.use('/venues', venuesRouter)
router.use('/events', eventsRouter)

router.delete('/group-images/:imageId', requireAuth, async (req, res) => {
  let targetImage = await GroupImage.findByPk(req.params.imageId)

  if(!targetImage){
    res.status = 404
    res.json({"message": "Group Image couldn't be found"})
  }

  let targetGroup = await targetImage.getGroup()

  let membership = await Membership.findOne({
    where: {
      groupId: targetGroup.id,
      userId: req.user.id
    }
  })

  

  if(targetGroup.organizerId != req.user.id && membership.status != 'co-host'){
    res.status = 403
    res.json({"message": "Forbidden"})
  }

  await targetImage.destroy()

  res.json({"message": "Successfully deleted"})

})

router.delete('/event-images/:imageId', requireAuth, async (req, res) => {
  let targetImage = await EventImage.findByPk(req.params.imageId)

  if(!targetImage){
    res.status = 404
    res.json({"message": "Event Image couldn't be found"})
  }

  let targetEvent = await targetImage.getEvent()

  let targetGroup = await targetEvent.getGroup()

  let membership = await Membership.findOne({
    where: {
      groupId: targetGroup.id,
      userId: req.user.id
    }
  })

  if(targetGroup.organizerId != req.user.id && membership.status != 'co-host'){
    res.status = 403
    res.json({"message": "Forbidden"})
  }

  await targetImage.destroy()

  res.json({"message": "Successfully deleted"})

})

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
