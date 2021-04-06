require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const usersRoutes = require('./routes/UsersRoutes.js')
app.use('/users', usersRoutes)

const tasksRoutes = require('./routes/TasksRoutes.js')
app.use('/tasks', tasksRoutes)

module.exports = app
