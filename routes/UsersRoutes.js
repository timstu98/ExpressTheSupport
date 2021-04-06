
const mongoose = require('mongoose')
const Users = mongoose.model('users')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  await new Users(req.body).save((err, data) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again later.'
      })
    } else {
      res.status(200).json({
        message: 'Congratulations, you created an account!',
        data
      })
    }
  })
})

module.exports = router
