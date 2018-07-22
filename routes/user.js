const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

const app = express();

const User = require('../models/user');

// Routes

// GET USER
app.get('/', (req, res, next) => {

User.find({}, 'name email img role')
  .exec(
    (err, users)=> {

      if ( err ) {
        return   res.status(500).json({
          ok: false,
          message: 'Error getting user',
          errors: err
        });
      }

User.count({ }, (err, sumOfUsers) => {

      res.status(200).json({
        ok: true,
        users: users,
        total: sumOfUsers
      });
    });
  });
});

// UPDATE USER
app.put('/:id', mdAuth.verifyToken, ( req, res ) => {
  const id = req.params.id;
  const body = req.body;

  User.findById( id, (err, user) => {

    if ( err ) {
      return res.status(500).json({
        true: false,
        message: 'User cannot be found',
        errors: err
      });
    }

    if ( !user ) {
      return res.status(400).json({
        ok: false, 
        message: 'Error, user with the id ' + id + ' does not exist.',
        errors: { message: 'There is no user with this ID.'}
      })
    }

    user.username = body.username;
    user.email = body.email;
    user.role = body.role;

    user.save( (err, savedUser) => {

      if ( err ) {
        return res.status(400).json({
          ok: false,
          message: 'User cannot be updated',
          errors: err
        });
      }

    savedUser.password = ':)';

      res.status(200).json({
        ok: true,
        user: savedUser
      });
    });

  });

});

// CREATE NEW USER
app.post('/', mdAuth.verifyToken, (req,res) => {
  const body = req.body;

  const user = new User({
    username: body.username,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save( (err, savedUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

  res.status(201).json({
    ok: true,
    user: savedUser,
    userToken: req.user
  });

  });

});


// DELETE USER
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

  const id = req.params.id;

  User.findByIdAndRemove(id, (err, deletedUser) => {

    if ( err ) {
      return res.status(500).json({
        ok: false,
        message: 'Error, user cannot be deleted',
        errors: err
      });
  }

    res.status(201).json({
      ok: true,
      user: deletedUser
    });

  });

});

module.exports = app;

// second parameter: cb, result of search