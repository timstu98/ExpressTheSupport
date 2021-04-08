const jwt = require('jsonwebtoken')

const authJWT = exports.authJWT = (req, res, next) => {
  const auth = req.headers.authorization
  if (auth) {
    const token = auth.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

exports.requireHelper = (req, res, next) => {
  authJWT(req, res, function () {
    if (req.user.role !== 'helper') {
      res.status(401).json('You are not logged in as a helper who requires help. Helpers only for this page.')
    } else {
      next()
    }
  })
}

exports.requireUser = (req, res, next) => {
  authJWT(req, res, function () {
    if (req.user.role !== 'user') {
      res.status(401).json('You are not logged in as a user who requires help. Users only for this page.')
    } else {
      next()
    }
  })
}

exports.requireAdmin = (req, res, next) => {
  authJWT(req, res, function () {
    if (req.user.role !== 'admin') {
      res.status(401).json('You are not logged in as an admin so you cannot delete this task.')
    } else {
      next()
    }
  })
}
