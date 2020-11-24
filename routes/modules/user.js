const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const { registerValidationRules, registerValidate } = require('../../middleware/validator')

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

router.post('/register', registerValidationRules(), registerValidate, (req, res, next) => {
  const validatedInfo = { email: req.body.email, password: req.body.password }
  if (req.body.name) validatedInfo.name = req.body.name
  User.findOne({ email: validatedInfo.email })
    .then(user => {
      if (user) {
        req.body.errors = ['這個 email 已經被註冊過了！']
        return res.render('register', req.body)
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(validatedInfo.password, salt))
        .then(hash => {
          validatedInfo.password = hash
          User.create(validatedInfo)
            .then(() => {
              return res.redirect('/')
            })
            .catch(error => next(error))
        })
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  return res.redirect('/user/login')
})

module.exports = router