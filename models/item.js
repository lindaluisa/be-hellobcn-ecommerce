const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const itemSchema = new Schema({
  title: { type: String, required: [true, 'Please indicate a title'] },
  description: { type: String, required: [true, 'Write a few words about the item']},
  price: { type: Number, required: [true, 'ATTENTION PLEASE']},
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {collection: 'items' });

module.exports = mongoose.model('Item', itemSchema);