const express = require('express')
const router = express.Router()
const usersRoutes = require('./UsersRoutes')
const tasksRoutes = require('./TasksRoutes')

router.use('/users', usersRoutes)
router.use('/tasks', tasksRoutes)

module.exports = router
