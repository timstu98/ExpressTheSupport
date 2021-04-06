
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { taskName, taskType, status, description, username, dateTime, location, duration, covidInfo } = req.body
  try {
    const result = await taskCollection.insertOne({
      taskName,
      taskType,
      status,
      description,
      username,
      dateTime,
      location,
      duration,
      covidInfo
    })
    const newTask = await index.taskCollection.findOne({ _id: result.insertedId })
    res.status(201).json(newTask)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const tasks = await index.taskCollection.find({}).toArray()
    res.status(200).json(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
