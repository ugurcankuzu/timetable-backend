const { ObjectId } = require("mongodb");
const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  surname: {
    type: String,
    default: ''
  },
  courses: {
    type: [String],
    default: []
  },
  freeTimes: {
    type: [String],
    default: []
  },
  role: {
    type: Number,
    default: 0
  }
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

module.exports = User;