const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const User = require('../models/user');
const Item = require('../models/item');
const Vendor = require('../models/vendor');

app.use(fileUpload());

app.put('/:type/:id', (req, res, next) => {

  const type = req.params.type;
  const id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'No files has been selected',
      errors: { message: 'No file selected'}
    });
  }

  // VALID FILE TYPES
  const validTypes = ['items', 'users', 'vendors'];
  
  if (validTypes.indexOf(type) < 0) { // -1
    return res.status(400).json({
      ok: false,
      mensaje: 'Type is not valid!',
      errors: { message: 'Las valid types are ' + validTypes.join(', ')}
    });
  }

  // VALID FILE EXTENSION
  const archive = req.files.img;
  const nameSplittedByPeriod = archive.name.split('.');   // Narrowing file down to FE 
  const fileExtension = nameSplittedByPeriod[nameSplittedByPeriod.length - 1];

  const validFileExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (validFileExtensions.indexOf(fileExtension) < 0) { // -1

    return res.status(400).json({
      ok: false,
      mensaje: 'Unvalid file extension',
      errors: { message: 'The valid file extensinos are ' + validFileExtensions.join(', ')}
    });
  }


// 23234243-123.png (id-random number.png)
  const fileName = `${ id }-${ new Date().getMilliseconds() }.${ fileExtension }`; // personalized archive
  const path = `./uploads/${ type }/${ fileName }`;

    archive.mv(path, function(err) {

      if (err)
        return res.status(500).json({
          ok: false,
          message: 'Error moving file',
          errors: err
        });

    uploadByType( type, id, fileName, res);

    });
});

function uploadByType( type, id, fileName, res) {

  if ( type === 'users') {

    User.findById(id, (err, user) => {

      if (!user) {
        return res.status(400).json({
          ok: false,
          message: 'No user with this id',
          errors: { message: 'No user with this id'}
        });
      }

      const oldPath = './uploads/users' + user.img;

      if (fs.existsSync(oldPath) ) {
        fs.unlink(oldPath);
      }

      user.img = fileName;

      user.save( (err, updatedUser) => {

        updatedUser.password = ':)';

        res.status(200).json({
          ok: true,
          message: 'User image has been updated',
          user: updatedUser
        });
      });
    });
  }

  if ( type === 'items') {

    
    Item.findById( id, (err, item) => {

      
      if(!item) {
        return res.status(400).json({
          ok: false,
          message: 'No item with this id',
          errors: { message: 'No item with this id'}
        });
      }
      
      const oldPath = './uploads/items' + item.img;

      if (fs.existsSync(oldPath) ) {
        fs.unlink(oldPath);
      }

      item.img = fileName;

      item.save( (err, updatedItem) => {

        res.status(200).json({
          ok: true,
          message: 'Item image has been updated',
          item: updatedItem
        });
      });
    });
  }

  if ( type === 'vendors') {

    Vendor.findById(id, (err, vendor) => {

      if (!vendor) {
        return res.status(400).json({
          ok: false,
          message: 'No vendor with this id',
          errors: { message: 'No vendor with this id'}
        });
      }

      const oldPath = './uploads/vendors/' + vendor.img;

      if(fs.existsSync(oldPath) ) {
        fs.unlink(oldPath);
      }

      vendor.img = fileName;

      vendor.save( (err, updatedVendor) => {

        res.status(200).json({
          ok: true,
          message: 'Vendor has been updated',
          vendor: updatedVendor
        });
      });
    });
  }

}

module.exports = app;



// indexOf
// returns the index of the first occurrence of a value in an array

          // var beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];
          // console.log(beasts.indexOf('bison'));      // 1
          // console.log(beasts.indexOf('giraffe'));    // - 1