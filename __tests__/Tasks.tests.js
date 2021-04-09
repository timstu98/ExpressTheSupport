

const app = require('../app.js')
const supertest = require('supertest')
const request = supertest(app)
const { it } = require("@jest/globals");
const mongoose=require('mongoose')
require('dotenv').config({ path: '.env' })
const Tasks = require('../models/Tasks.js')

beforeAll(async () => {
    // Connect to a Mongo DB
    await mongoose.connect(process.env.URI,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true
        })
      
      mongoose.Promise = global.Promise // tell mongoose to use ES6 promises
      mongoose.connection.on('error', (err) => {
        console.error(`database connection error: ${err.message}`)
      })

      mongoose.connection.on("connected", (err, res) => {
        console.log("mongoose is connected")
      })
      
      require('../models/Users')
      require('../models/Tasks')

      module.exports = app
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });


  // {"username":"timbo","password":"pw12345678","role":"user","contactInfo":"timstu@egg.com"}


describe('GET /', () => {
    it('Return 401 if incorrect authorization', async done => {
        const res = await request.get('/api/v1/tasks')
        expect(res.status).toBe(401)
        done()
    })

    it('Check task GET returns 200 status', async done => {
        const res = await request.get('/api/v1/tasks').set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
        expect(res.status).toBe(200)
        done()
    })
  
})

describe('POST /', () => {

  it("Should save task to database as user", async done => {
      const res = await request.post("/api/v1/tasks")
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send({"taskName":"Mow Lawn","taskType":"Gardening","status":"posted",
      "description":"Will you please come round and mow lawn",
      "username":"timbo","dateTime":"tomorrow","location":"Rutland",
      "duration":"2 days","covidInfo":"Safe"});
      
      expect(res.status).toBe(200)
      done();
    });

    it("Should save task to database as not user authorised", async done => {
      const res = await request.post("/api/v1/tasks")
      .set('Authorization', `Bearer ${process.env.HELPER_TOKEN}`)
      .send({"taskName":"Mow Lawn","taskType":"Gardening","status":"posted",
      "description":"Will you please come round and mow lawn",
      "username":"timbo","dateTime":"tomorrow","location":"Rutland",
      "duration":"2 days","covidInfo":"Safe"});
      
      expect(res.status).toBe(401)
      done();
    });
})

describe('DELETE /', () => {

  it("Could save and then use DELETE method to remove task", async done => {

    const res = await request.post("/api/v1/tasks")
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send({"taskName":"Mow Lawn","taskType":"Gardening","status":"posted",
      "description":"Will you please come round and mow lawn",
      "username":"timbo","dateTime":"tomorrow","location":"Rutland",
      "duration":"2 days","covidInfo":"Safe"});

      const res2 = await request.delete("/api/v1/tasks/"+res.body.data._id)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      
      expect(res2.status).toBe(204)
      done();
    });

    it("Only admin should be able to delete task", async done => {

      const res = await request.post("/api/v1/tasks")
        .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
        .send({"taskName":"Mow Lawn","taskType":"Gardening","status":"posted",
        "description":"Will you please come round and mow lawn",
        "username":"timbo","dateTime":"tomorrow","location":"Rutland",
        "duration":"2 days","covidInfo":"Safe"});
  
        const res2 = await request.delete("/api/v1/tasks/"+res.body.data._id)
        .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
        
        expect(res2.status).toBe(401)
        done();
      });
})

