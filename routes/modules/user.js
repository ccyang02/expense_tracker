const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true,
}))

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  User.create(req.body)
    .then(() => {
      return res.redirect('/')
    })
    .catch(error => console.log(error))
})

router.get('/logout', (req, res) => {
  return res.render('login')
})

module.exports = router