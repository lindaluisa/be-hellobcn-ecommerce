const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Item = require('../models/item');

// GET ITEM
app.get('/', (req, res) => {

  Item.find({})
  .populate('user', 'username email')
  .exec(
    (err, items)=> {

    if ( err ) {
      return res.status(500).json({
        ok: false,
        message: 'Error loading items',
        errors: err
      });
    }

    Item.count({}, (err, sumOfItems) => {
      res.status(200).json({
        ok: true,
        items: items,
        total: sumOfItems
      });
    });
  });
});


// UPLOAD ITEM
app.put('/:id', mdAuth.verifyToken, (req, res) => {

  const id = req.params.id;
  const body = req.body;

  Item.findById(id, ( err, item ) => {

    if ( err ) {
      return res.status(500).json({
        ok: false,
        message: 'Error finding item',
        errors: err
      });
    }

    if ( !item ) {
      return res.status(400).json({
        ok: false,
        message: 'There is no item with this ID',
        errors: { message: 'No item with that ID'}
      });
    }

    item.title = body.title;
    item.description = body.description;
    item.price = body.price;
    item.user = req.user._id;

    item.save( (err, updatedItem) => {

      if ( err ) {
        return res.status(400).json({
          ok: false,
          message: 'Error updating item',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        item: updatedItem
      });

    });

  });

});




// CREATE ITEM
app.post('/', mdAuth.verifyToken, (req, res) => {
  
  const body = req.body;

  const item = new Item({
    title: body.title,
    description: body.description,
    price: body.price,
    user: req.user._id
  });

  item.save( (err, savedItem) => {

    if ( err ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Cannot save item',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      item: savedItem
    });

  });

});



// DELETE ITEM
app.delete('/:id', mdAuth.verifyToken, ( req, res ) => {

  const id = req.params.id;

  Item.findByIdAndRemove(id, (err, removedItem) => {

    if ( err ){
      return res.status(500).json({
        ok: false,
        message: 'Error deleting item',
        errors: err
      });
    }

    if ( !removedItem) {
      return res.status(400).json({
        ok: false,
        mensaje: 'There is no item with this id',
        errors: { mensaje: 'There is no item with this id' }
      });
    }
    res.status(200).json({
      ok: true,
      item: removedItem
    });

  });

});



module.exports = app;