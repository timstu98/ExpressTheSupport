const mongoose = require('mongoose')
const Tasks = mongoose.model('tasks')

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

exports.displayTaskList = async (req, res) => {
  const tasks = await Tasks.find()
  res.json(tasks)
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
    console.log('if statement checking json keys triggered')
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
