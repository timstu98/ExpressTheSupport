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

// start the server
app.listen(port, async () => {
  // initialize with mongo
  const db = await MongoClient.connect(URI)
  const database = db.db('ExpressTheSupportDB')
  // connect with users collection on mongo
  userCollection = database.collection('Users')
  // const dbUserCollection = await userCollection.find({}).toArray()
  if (!userCollection) {
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
})
