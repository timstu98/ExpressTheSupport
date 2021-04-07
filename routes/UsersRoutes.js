const express = require('express')
const router = express.Router()

const usersController = require('../controllers/UsersController')

router.post('/register', usersController.registerNewUser)

router.post('/login', usersController.loginUser)

module.exports = router
