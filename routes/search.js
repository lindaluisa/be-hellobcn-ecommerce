const express = require('express');

const app = express();

const Item = require('../models/item');
const Vendor = require('../models/vendor');
const User = require('../models/user');

// ===========================
// SPECIFIC SEARCH
// ===========================
app.get('/collection/:group/:search', (req, res) => {

  const group = req.params.group;
  const search = req.params.search;
  const regex = new RegExp( search, 'i');

  let promise; 

  switch ( group ) {

    case 'items':
      promise = findItems( search, regex );
      break;
    
    case 'vendors':
      promise = findVendors( search, regex );
      break;

    case 'users':
      promise = findUsers( search, regex );
      break;

    default:
      return res.status(400).json({
        ok: false,
        message: 'The possible fields are items, vendors and users',
        error: { message: 'Not valid'}
      });
  }

  promise.then( data => {
    res.status(200).json({
      ok: true,
      [group]: data // [group] dynamically changing
    });
  });
});

// ===========================
// GENERAL SEARCH
// ===========================
app.get('/all/:search', (req, res, next) => {

  const search = req.params.search;
  const regex = new RegExp( search, 'i');

  Promise.all( [
    findItems(search, regex), 
    findVendors(search, regex),
    findUsers(search, regex) ])
    .then(responses => {

      res.status(200).json({
        ok: true,
        items: responses[0],
        vendors: responses[1],
        users: responses[2]
      });
    });
});


function findItems( search, regex ) {

  return new Promise ( (resolve, reject) => {

    Item.find( { title: regex} )
        .populate('user', 'username email')
        .exec( (err, items) => {

          if (err) {
            reject('Error loading items', err)
          } else {
            resolve(items)
          }
        });
  });
}

function findVendors( search, regex ) {

  return new Promise ( (resolve, reject) => {

    Vendor.find( { name: regex })
          .populate( 'user', 'username email' )
          .populate( 'item' )
          .exec( (err , vendors) => {

              if (err) {
                reject('Error loading vendors', err)
              } else {
                resolve(vendors)
              }
          });
  });
}

function findUsers( search, regex ) {

  return new Promise ( (resolve, reject) => {

    User.find({}, 'username email role')
        .or( [ {'username': regex}, {'email': regex} ])
        .exec( (err, users) => {

          if(err) {
            reject('Error loading users', err)
          } else {
            resolve(users)
          }
        });
  });
}

module.exports = app;

// REG.PARAMS.SEARCH
// req.params comes from path segments of the URL matching a param. in the route definition 
// e.g., /song/:songid. -- So, with a route using that designation and a URL such as /song/48586,
//  then req.params.songid === "48586"


// Item.find( {title: /red/i } , (err, items) => {
  // title refers to item model
  // aim: changing /red/i to a regular expression to make it a pattern

