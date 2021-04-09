const mongoose = require('mongoose')

require('dotenv').config({ path: '.env' })

mongoose.connect(process.env.URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })

mongoose.Promise = global.Promise // tell mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`database connection error: ${err.message}`)
})

require('./models/UsersModel')
require('./models/TasksModel')


const app = require('./app')

const server = app.listen(3000, () => {
  console.log(`Express running on PORT ${server.address().port}`)
})

module.exports=app