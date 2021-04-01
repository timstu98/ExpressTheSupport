require("dotenv").config();

const express = require("express");
const MongoClient = require("mongodb");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const URI = process.env.URI;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let userCollection;
let taskCollection;

app.post("/users", async (req, res) => {
  const { user, password, role, contact_info } = req.body;
  try {
    const result = await userCollection.insertOne({
      user,
      password,
      role,
      contact_info,
    });
    const newUser = await userCollection.findOne({ _id: result.insertedId });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

//start the server
app.listen(port, () => {
  MongoClient.connect(URI, (err, db) => {
    if (err) throw err;
    const database = db.db("ExpressTheSupportDB");
    userCollection = database.collection("User");
    taskCollection = database.collection("Task");
  });
  console.log(`Server running on port ${port}`);
});
