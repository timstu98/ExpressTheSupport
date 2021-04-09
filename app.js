require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')

const app = express()

// IMPORT ROUTES
const api = require('./api.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Data sanitisation against NoSQL query injection - note: must be before the routes are defined
app.use(mongoSanitize())

// ROUTES
app.use('/api/v1', api)

// app.use('/test', (req,res) => {

// }

module.exports = app
