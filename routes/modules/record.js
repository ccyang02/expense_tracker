const express = require('express')
const router = express.Router()
const { registerValidationRules, registerValidate, newValidationRules,
  newValidate, editValidationRules, editValidate } = require('../../utils/validator')

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

router.get('/new', (req, res, next) => {
  // render to new.html
  Category
    .find()
    .sort({ '_id': 'asc' })
    .lean()
    .then(categories => {
      return res.render('new', { categories })
    })
    .catch(error => next(error))
})

router.post('/new', newValidationRules(), newValidate, (req, res, next) => {
  // render to index.html
  const userId = req.user._id
  let { name, date, category, amount, merchant } = req.body
  date = new Date(Number(req.body.unixTimestamp))

  Record.create({ name, date, category, amount, merchant, userId })
    .then(() => {
      req.session.middleData = undefined
      return res.redirect('/')
    })
    .catch(error => next(error))
})

router.get('/edit/:rid', (req, res, next) => {
  // render to edit.html
  const rid = req.params.rid
  const isFail = req.query.isFail
  const userId = req.user._id
  Category
    .find()
    .lean()
    .then(categories => {
      // throw new Error('Error from Category...')
      return Record
        .findOne({ _id: rid, userId })
        .lean()
        .then(output => {
          // throw new Error('Error from Record...')
          output.date = output.date.getTime()
          return res.render('edit', { data: output, categories, isFail })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.put('/edit/:rid', editValidationRules(), editValidate, (req, res, next) => {
  // render to edit.html
  const rid = req.params.rid
  const userId = req.user._id
  let { name, date, category, amount, merchant } = req.body
  date = new Date(Number(req.body.unixTimestamp))
  console.log('put get data: ....', name, req.body.date, date, category, amount, merchant)
  return Record.findOne({ _id: rid, userId })
    .then(record => {
      Object.assign(record, { name, date, category, amount, merchant })
      return record.save()
    })
    .then(() => {
      return res.redirect(`/record/edit/${rid}?isFail=false`)
    })
    .catch(error => {
      console.log(error)
      return res.redirect(`/record/edit/${rid}?isFail=true`)
    })
})

router.delete('/delete/:rid', (req, res, next) => {
  // render to index.html
  const rid = req.params.rid
  const userId = req.user._id
  Record.findOne({ _id: rid, userId })
    .then(output => { output.remove() })
    .then(() => res.redirect('/'))
    .catch(error => next(error))
})

module.exports = router