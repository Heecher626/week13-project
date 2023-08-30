const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {ValidationError} = require('sequelize')

const routes = require('./routes');

//variable of if environment is production
const { environment } = require ('./config');
const isProduction = environment === 'production';

const app = express();

//middleware for logging information about requests and responses
app.use(morgan('dev'));

//middleware for parsing cookies and json
app.use(cookieParser());
app.use(express.json());

//enables CORS when not in production
if(!isProduction){
  app.use(cors());
};

//general security middleware
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
);

// sets the _csrf token and creates req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes);

// throws 404 if can't find endpoint
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// handles sequelize validation errors
app.use((err, req, res, next) => {
  if (err instanceof ValidationError){
    let errors = {};
    for (let error of err.errors){
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  };
  next(err);
});

//error formatter
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});



module.exports = app;
