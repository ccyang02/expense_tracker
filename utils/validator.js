const Category = require('../models/category')
const { check, validationResult } = require('express-validator')

const registerValidationRules = () => {
  return [
    check('email').isEmail().withMessage('信箱錯誤'),
    check('password').isLength({ min: 3, max: 8 }).withMessage('信箱錯誤'),
    check('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('密碼與驗證密碼不相符')
        }
        return true
      }),
  ]
}

const registerValidate = (req, res, next) => {
  const errorResults = validationResult(req)
  if (errorResults.isEmpty()) return next()

  const errors = errorResults.errors.map(error => error.msg)
  req.body.errors = errors
  return res.render('register', req.body)
}

const newValidationRules = () => {
  return [
    check('amount').custom(value => {
      if (Number(value) < 0) {
        throw new Error('金額不可為負數。')
      }
      return true
    })
  ]
}

const newValidate = (req, res, next) => {
  const errorResults = validationResult(req)
  if (errorResults.isEmpty()) return next()

  Category.find()
    .lean()
    .then(categories => {
      const errors = errorResults.errors.map(error => error.msg)
      req.body.categories = categories
      req.body.errors = errors
      return res.render('new', req.body)
    })
    .catch(error => next(error))
}

const editValidationRules = () => {
  return [
    check('amount').custom(value => {
      if (Number(value) < 0) {
        throw new Error('金額不可為負數。')
      }
      return true
    })
  ]
}

const editValidate = (req, res, next) => {
  const errorResults = validationResult(req)
  if (errorResults.isEmpty()) return next()

  return res.redirect(`/record/edit/${rid}?isFail=true`)

}

module.exports = {
  registerValidationRules,
  registerValidate,
  newValidationRules,
  newValidate,
  editValidationRules,
  editValidate
}

