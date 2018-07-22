const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {type: String, required: [true, 'Please indicate your name']},
  img: { type: String, required: false },
  user: {type: Schema.Types.ObjectId, ref:'User', required: true},
  item: {type: Schema.Types.ObjectId, ref:'Item', required: [true, 'The ID is a required field']}
});

module.exports = mongoose.model('Vendor', vendorSchema);

