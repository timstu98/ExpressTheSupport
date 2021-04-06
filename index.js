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

const JWT_SECRET = 'SomeSecret'

const authJWT = (req, res, next) => {
  const auth = req.headers.authorization
  if (auth) {
    const token = auth.split(' ')[1]
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) res.sendStatus(403)
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userList = await userCollection.find({}).toArray()
  const user = userList.find(
    (singleUser) => singleUser.username === username && singleUser.password === password
  )
  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET
    )
    res.send({ accessToken })
  } else {
    res.send('Username or password incorrect')
  }
})

const tasks = require('./routes/tasks.js')
app.use('/tasks', tasks)

// start the server
app.listen(port, async () => {
  // initialize with mongo
  const db = await MongoClient.connect(URI)
  const database = db.db('ExpressTheSupportDB')
  function toArray (iterator) {
    return new Promise((resolve, reject) => {
      iterator.toArray((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  const dbCollections = await toArray(database.listCollections())
  const arrayOfCollections = []
  for (const object of dbCollections) {
    arrayOfCollections.push(object.name)
  }
  if (!arrayOfCollections.includes('Users')) {
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
  if (!arrayOfCollections.includes('Tasks')) {
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

  userCollection = database.collection('Users')
  taskCollection = database.collection('Tasks')
})
