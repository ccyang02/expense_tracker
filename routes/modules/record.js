const express = require('express')
const tools = require('../../utils/tools')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

router.get('/new', (req, res) => {
  // render to new.html
  Category
    .find()
    .sort({ '_id': 'asc' })
    .lean()
    .then(categories => {
      return res.render('new', { categories })
    })
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.post('/new', [
  check('amount').custom(value => {
    if (Number(value) < 0) {
      throw new Error('金額不可為負數。')
    }
    return true
  })
], (req, res) => {
  // render to index.html
  const errorResults = validationResult(req)
  if (!errorResults.isEmpty()) {
    Category.find()
      .lean()
      .then(categories => {
        const errors = errorResults.errors.map(error => error.msg)
        req.body.categories = categories
        req.body.errors = errors
        return res.render('new', req.body)
      })
      .catch(error => {
        console.log(error)
        return res.end()
      })
  } else {
    const userId = req.user._id
    let { name, date, category, amount, merchant } = req.body
    date = new Date(Number(req.body.unixTimestamp))

    Record.create({ name, date, category, amount, merchant, userId })
      .then(() => {
        req.session.middleData = undefined
        return res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        return res.end()
      })
  }
})

router.get('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  const isFail = req.query.isFail
  const userId = req.user._id
  Category
    .find()
    .lean()
    .then(categories => {
      Record
        .findOne({ _id: rid, userId })
        .lean()
        .then(output => {
          output.date = output.date.getTime()
          return res.render('edit', { data: output, categories, isFail })
        })
    })
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.put('/edit/:rid', [
  check('amount').custom(value => {
    if (Number(value) < 0) {
      throw new Error('金額不可為負數。')
    }
    return true
  })
], (req, res) => {
  const errorResults = validationResult(req)
  if (!errorResults.isEmpty()) {
    return res.redirect(`/record/edit/${rid}?isFail=true`)
  }

  // render to edit.html
  const rid = req.params.rid
  const userId = req.user._id

  let { name, date, category, amount, merchant } = req.body
  date = new Date(Number(req.body.unixTimestamp))

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

router.delete('/delete/:rid', (req, res) => {
  // render to index.html
  const rid = req.params.rid
  const userId = req.user._id
  Record.findOne({ _id: rid, userId })
    .then(output => { output.remove() })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})


module.exports = router