const express = require('express');
const router = express.Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')

const { restoreUser } = require('../../utils/auth.js')
// const { User } = require('../../db/models')
// const { requireAuth } = require('../../utils/auth.js')

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter)
router.use('/groups', groupsRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
