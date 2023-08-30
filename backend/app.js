const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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
