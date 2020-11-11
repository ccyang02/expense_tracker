const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', (req, res) => {
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  return res.render('register')
})

router.get('/logout', (req, res) => {
  return res.render('login')
})

module.exports = router