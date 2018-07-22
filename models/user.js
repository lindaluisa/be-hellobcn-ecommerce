const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
  values: ['ADMIN_ROLE',  'USER_ROLE'],
  message: '{VALUE} is not a valid role'
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: [true, 'Your name is required'] },
  email: { type: String, unique: true, required: [true, 'Please insert your email'] },
  password: { type: String, required: [true, 'Please insert your password'] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles}
})

userSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'});

module.exports = mongoose.model('User', userSchema);