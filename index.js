require('dotenv').config()

const express = require('express')
const MongoClient = require('mongodb')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000
const URI = process.env.URI

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let userCollection
let taskCollection

app.post('/users', async (req, res) => {
  const { user, password, role, contactInfo } = req.body
  try {
    const result = await userCollection.insertOne({
      user,
      password,
      role,
      contactInfo
    })
    const newUser = await userCollection.findOne({ _id: result.insertedId })
    res.status(201).json(newUser)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.post('/tasks', async (req, res) => {
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
    const newTask = await taskCollection.findOne({ _id: result.insertedId })
    res.status(201).json(newTask)
  } catch (e) {
    res.status(500).send(e)
  }
})

// start the server
app.listen(port, async () => {
  // initialize with mongo
  const db = await MongoClient.connect(URI)
  const database = db.db('ExpressTheSupportDB')
  // connect with users collection on mongo
  userCollection = database.collection('Users')
  const dbUserCollection = await userCollection.find({}).toArray()
  if (!dbUserCollection.length) {
    database.createCollection('Users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user', 'password', 'role', 'contactInfo'],
          additionalProperties: false,
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            user: {
              bsonType: 'string',
              description: 'Username'
            },
            password: {
              bsonType: 'string',
              description: 'Password'
            },
            role: {
              bsonType: 'string',
              description: 'Helper, helpee or (admin)?'
            },
            contactInfo: {
              bsonType: 'string',
              description: 'Phone number or email'
            }
          }
        }
      }
    })
  }
  taskCollection = database.collection('Tasks')
  const dbTaskCollection = await taskCollection.find({}).toArray()
  if (!dbTaskCollection.length) {
    database.createCollection('Tasks', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['taskName', 'taskType', 'status', 'description', 'username', 'dateTime', 'location', 'duration', 'covidInfo'],
          additionalProperties: false,
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            taskName: {
              bsonType: 'string',
              description: 'Name of task'
            },
            taskType: {
              bsonType: 'string',
              description: 'Type of task'
            },
            status: {
              bsonType: 'string',
              description: 'Status of task'
            },
            description: {
              bsonType: 'string',
              description: 'Description of task'
            },
            username: {
              bsonType: 'string',
              description: 'Username of helpee'
            },
            dateTime: {
              bsonType: 'string',
              description: 'Date of task'
            },
            location: {
              bsonType: 'string',
              description: 'Location of task'
            },
            duration: {
              bsonType: 'string',
              description: 'Duration of task'
            },
            covidInfo: {
              bsonType: 'string',
              description: 'Covid Info'
            }
          }
        }
      }
    })
  }
})
