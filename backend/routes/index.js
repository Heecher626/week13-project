const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

const { setTokenCookie } = require('../utils/auth.js')
const { User } = require('../db/models')

router.use('/api', apiRouter);

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});



module.exports = router;
