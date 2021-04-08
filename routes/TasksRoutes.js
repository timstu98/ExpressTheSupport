const express = require('express')
const router = express.Router()
const authFunctions = require('../authFunctions')

const tasksController = require('../controllers/TasksController')

router.get('/', authFunctions.authJWT, tasksController.displayTaskList)

router.post('/', authFunctions.requireUser, tasksController.createNewTask)

router.get('/:id', authFunctions.authJWT, tasksController.displaySpecificTask)

router.delete('/:id', authFunctions.requireAdmin, tasksController.deleteTask)

router.put('/:id', authFunctions.requireHelper, tasksController.updateStatus) // may change this to PATCH to be more RESTful

module.exports = router
