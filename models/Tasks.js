const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const TasksSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['posted', 'in-progress', 'completed']
  },
  description: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  dateTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  covidInfo: {
    type: String,
    required: true
  }
}, { strict: true })

module.exports = mongoose.model('tasks', TasksSchema)
