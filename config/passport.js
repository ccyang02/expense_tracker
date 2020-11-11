const passport = require('passport')
const User = require('../models/user')
const LocalPassport = require('passport-local').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalPassport({ usernameField: 'email' }, (email, passport, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered!' })
        }
        if (user.passport !== passport) {
          return done(null, false, { message: 'Password is incorrect!' })
        }
        return done(error => done(error, false))
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}