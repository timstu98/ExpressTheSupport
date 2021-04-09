const mongoose = require('mongoose')

const Tasks = require('../models/Tasks.js')

exports.createNewTask = async (req, res) => {
  await new Tasks(req.body).save((err, data) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again later.'
      })
    } else {
      res.status(200).json({
        message: 'Task Created'p,
        data
      })
    }
  })
}

exports.displayTaskList = async (req, res) => {
  const tasks = await Tasks.find()
  res.status(200).json(tasks)
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
  // console.log('INTO TASK CONTROLLER')
  if (JSON.stringify(Object.keys(req.body)) !== JSON.stringify(['status'])) {
    // console.log('if statement checking json keys triggered')
    res.status(403).json({ message: 'Please pass only a status update in request body.' })
  } else {
    await Tasks.findByIdAndUpdate({ _id: taskId }, { $set: req.body }, { new: true, runValidators: true }, (err, data) => {
      if (err) {
        res.status(500).json({ message: 'Find by id and update failed. Could be because the status is invalid. Please retry.' })
      }
      // if (req.body.status === data.status) {
      //   res.status(403).json({ message: 'No change of status as status entered is same as before.'})
      // }
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
