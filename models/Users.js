const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'helper', 'admin']
  },
  contactInfo: {
    type: String,
    required: true
  }
}, { strict: true })

module.exports = mongoose.model('users', usersSchema)
