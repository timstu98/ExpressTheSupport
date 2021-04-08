const express = require('express')
const router = express.Router()
const usersRoutes = require('./routes/UsersRoutes')
const tasksRoutes = require('./routes/TasksRoutes')

router.use('/users', usersRoutes)
router.use('/tasks', tasksRoutes)

module.exports = router
