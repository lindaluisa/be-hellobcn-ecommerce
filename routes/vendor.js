const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Vendor = require('../models/vendor');

// GET VENDOR
app.get('/', (req, res, next) => {

  Vendor.find({ })
  .populate('user', 'username email')
  .populate('item')
  .exec(
    (err, vendors) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error finding vendors',
        errors: err
      });
    }

    Vendor.count({}, (err, sumOfVendors) => {

      res.status(200).json({
        ok: true,
        vendors: vendors,
        total: sumOfVendors
      });
    })
  });
});


// UPDATE VENDOR
app.put('/:id', mdAuth.verifyToken, (req, res) => {

  const body = req.body;
  const id = req.params.id;


  Vendor.findById(id, (err, vendor) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error - Cmon, you know better!',
        errors: err
      });
    }

    if (!vendor) {
      return res.status(400).json({
        ok: false,
        message: 'There is no vendor with ese id: ' + id + ' .',
        errors: { message: 'There is no vendor with this id.' }
      });
    }

    vendor.name = body.name,
    vendor.user = req.user._id,
    vendor.item = body.item

    vendor.save( (err, updatedVendor) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          message: 'Error updating vendor',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        vendor: updatedVendor
      });
    });
  });
});

// CREATE VENDOR
app.post('/', mdAuth.verifyToken, (req, res) => {

  const body = req.body;

  const vendor = new Vendor({
    name: body.name,
    user: req.user._id,
    item: body.item
  });

  vendor.save( (err, savedVendor) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error saving vendor',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      vendor: savedVendor
    });
  });
});

// DELETE VENDOR
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

  const id = req.params.id;

  Vendor.findByIdAndRemove(id, (err, deletedVendor) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error deleting vendor',
        error: err
      });
    }

    res.status(200).json({
      ok: true,
      vendor: deletedVendor
    });
  });
});

module.exports = app;