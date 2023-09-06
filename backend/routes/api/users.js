const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation.js')
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  if(User.findOne({
    where: {
      email
    }
  })){
    const err = new Error('User already exists')
    res.status = 500
    err.message = 'User with that email already exists'
    return res.next(err)
  }
  const user = await User.create({email, username, hashedPassword, firstName, lastName});

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  }

  setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  })
});

module.exports = router
