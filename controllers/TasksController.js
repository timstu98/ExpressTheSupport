const mongoose = require('mongoose')
const jwt_decode = require('jwt-decode')

const Tasks = require('../models/TasksModel')

exports.createNewTask = async (req, res) => {
  await new Tasks(req.body).save((err, data) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again later.'
      })
    } else {
      res.status(200).json({
        message: 'Task Created',
        data
      })
    }
  })
}

exports.displaySpecificTask = async (req, res) => {
  const taskId = req.params.id
  await Tasks.findById({ _id: taskId }, (err, data) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again later.'
      })
    } else {
      res.status(200).json({
        message: 'Task found',
        data
      })
    }
  })
}

exports.updateStatus = async (req, res) => {
  const taskId = req.params.id
  if (JSON.stringify(Object.keys(req.body)) !== JSON.stringify(['status'])) {
    res.status(403).json({ message: 'Please pass only a status update in request body.' })
  } else {
    await Tasks.findByIdAndUpdate({ _id: taskId }, { $set: req.body }, { new: true, runValidators: true }, (err, data) => {
      if (err) {
        res.status(500).json({ message: 'Find by id and update failed. Could be because the status is invalid. Please retry.' })
      }
    })
    await Tasks.findById({ _id: taskId }, (err, data) => {
      if (err) {
        res.status(500).json({
          message: 'Something went wrong pulling the data. This error should not be possible.'
        })
      } else {
        res.status(200).json({
          message: 'Updated task',
          data
        })
      }
    })
  }
}

exports.deleteTask = async (req, res) => {
  const taskId = req.params.id
  await Tasks.findByIdAndDelete({ _id: taskId }, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Find by id and delete failed. Could be because your id does not match an entry. Please retry.' })
    } else {
      res.status(204).json({
        message: 'Deleted Task'
      })
    }
  })
}

exports.displayOrderedTaskList = async (req, res) => {
  const auth = req.headers.authorization
  const token = auth.split(' ')[1]
  const decoded = jwt_decode(token)
  
  const lng = decoded.location.coordinates[0]
  const lat = decoded.location.coordinates[1]

  const maxDistanceInMeters = Infinity

  const result = await Tasks
    .find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: maxDistanceInMeters
        }
      }
    }).sort('-score')
  res.send(result)
}
