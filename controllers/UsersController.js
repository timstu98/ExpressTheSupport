const mongoose = require('mongoose')
// const Users = mongoose.model('users')
const Users = require('../models/Users.js')
const jwt = require('jsonwebtoken')

exports.registerNewUser = async (req, res) => {
  await new Users(req.body).save((err, data) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again later.'
      })
    } else {
      console.log(data)
      res.status(200).json({
        message: 'Congratulations, you created an account!',
        data
      })
    }
  })
}

exports.loginUser = async (req, res) => {
  const { username, password } = req.body
  const oneUser = await Users.findOne({ username: username, password: password }).exec()
  if (oneUser) {
    const accessToken = jwt.sign(
      { username: oneUser.username, role: oneUser.role },
      process.env.JWT_SECRET // If this goes wrong, add config for env at top.
    )
    res.status(200).json({
      message: 'Congratulations, you have logged in to your account!',
      accessToken
    })
  } else {
    res.status(500).send('Username or password incorrect')
  }
}
