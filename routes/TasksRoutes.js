const express = require('express')
const router = express.Router()
const authFunctions = require('../authFunctions')

const tasksController = require('../controllers/TasksController')

router.post('/', authFunctions.authJWT, tasksController.createNewTask)

router.get('/', tasksController.displayTaskList)

router.get('/:id', tasksController.displaySpecificTask)

router.put('/:id/update', tasksController.updateStatus) // may change this to PATCH to be more RESTful

module.exports = router
