const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = require('../config/config').SECRET_KEY;

const app = express();

const User = require('../models/user');

app.post('/', (req, res) => {

  const body = req.body;

  User.findOne( { email: body.email } , (err, userDB) => {

    if ( err ) {
      return res.status(500).json({
        ok: false,
        message: 'Error finding user',
        errors: err
      });
    };

    if ( !userDB ) {
      return res.status(400).json({
        ok: false,
        message: 'Incorrect email',
        errors: { message: 'Error, no user found - email' }
      });
    };

    if ( !bcrypt.compareSync( body.password, userDB.password )) {
      return res.status(400).json({
        ok: false,
        message: 'Incorrect password',
        errors: err
      });
    };

    // CREATE TOKEN
    userDB.password = 'Not visible';
    const token = jwt.sign( { user: userDB}, SECRET_KEY, {expiresIn: 14400} );

    res.status(200).json({
      ok: true,
      user: userDB,
      token: token,
      id: userDB._id
    });

  });
});

module.exports = app;