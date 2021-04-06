
const mongoose = require('mongoose')
const Tasks = mongoose.model('tasks')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
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
})

router.get('/', async (req, res) => {
  const tasks = await Tasks.find()
  res.json(tasks)
})

module.exports = router
