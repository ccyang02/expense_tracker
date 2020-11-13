const express = require('express')
const session = require('express-session')
const tools = require('../../utils/tools')
const router = express.Router()

const Category = require('../../models/category.js')
const Record = require('../../models/record.js')

// router.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))

router.get('/new', (req, res) => {
  // render to new.html
  const unsavedData = req.session.middleData
  Category
    .find()
    .sort({ '_id': 'asc' })
    .lean()
    .then(categories => res.render('new', { categories, unsavedData }))
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.post('/new', (req, res) => {
  // render to index.html
  let data = {}
  const userId = req.user._id
  data = Object.assign(data, req.body) // name, date, category, amount
  data.date = tools.transformDateType(data)
  data.userId = userId

  Record.create(data)
    .then(() => {
      req.session.middleData = undefined
      return res.redirect('/')
    })
    .catch(error => {
      console.log(error)
      req.session.middleData = req.body
      return res.redirect(`/record/new`) // 可以考慮改成直接 render
    })
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
          output.date = tools.date2String(output.date)
          return res.render('edit', { data: output, categories, isFail })
        })
    })
    .catch(error => {
      console.log(error)
      return res.end()
    })
})

router.put('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  const userId = req.user._id
  let newData = {}
  newData = Object.assign(newData, req.body) // name, date, category, amount, merchant
  newData.date = tools.transformDateType(newData)

  return Record.findOne({ _id: rid, userId })
    .then(record => {
      Object.assign(record, newData)
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