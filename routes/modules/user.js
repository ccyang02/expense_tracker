const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const { check, validationResult } = require('express-validator')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  // failureFlash: true,
}))

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', [
  check('email').isEmail().withMessage('信箱錯誤'),
  check('password').isLength({ min: 3, max: 8 }).withMessage('信箱錯誤'),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與驗證密碼不相符')
      }
      return true
    }),
], (req, res) => {
  const errorResults = validationResult(req)
  if (!errorResults.isEmpty()) {
    const errors = errorResults.errors.map(error => error.msg)
    req.body.errors = errors
    return res.render('register', req.body)
  }

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
            .catch(error => {
              console.log(error)
              return res.end()
            })
        })


    })


})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  return res.redirect('/user/login')
})

module.exports = router