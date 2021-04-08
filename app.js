require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
// const mongoSanitize = require('express-mongo-sanitize')

const app = express()

// IMPORT ROUTES
// const usersRoutes = require('./routes/UsersRoutes.js')
// const tasksRoutes = require('./routes/TasksRoutes.js')
const api = require('./routes/api.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Data sanitisation against NoSQL query injection - note: must be before the routes are defined
// app.use(mongoSanitize())
// right now appears to be doing nothing

// ROUTES

app.use('/api/v1', api)
// app.use('/users', usersRoutes)
// app.use('/tasks', tasksRoutes)

// const payload = {"$something":"hello"}
// console.log(payload)
// const test = mongoSanitize.sanitize(payload)
// console.log(test)

module.exports = app
