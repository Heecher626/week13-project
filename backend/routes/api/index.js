const express = require('express');
const router = express.Router();

const { restoreUser } = require('../../utils/auth.js')
// const { User } = require('../../db/models')
// const { requireAuth } = require('../../utils/auth.js')

router.use(restoreUser)

module.exports = router;
