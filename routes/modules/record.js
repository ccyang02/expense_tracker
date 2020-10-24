const express = require('express')
const router = express.Router()
const session = require('express-session')
const Category = require('../../models/category.js')
const Record = require('../../models/record.js')
const tools = require('../../public/javascripts/main')
router.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))

router.get('/new', (req, res) => {
  // render to new.html
  // const unsavedData = (Object.keys(req.query).length === 0) ? null : req.query
  const unsavedData = req.session.middleData
  Category
    .find()
    .sort({ '_id': 'asc' })
    .lean()
    .then(categories => {
      return res.render('new', { categories, unsavedData })
    })
    .catch(error => console.log(error))
})

router.post('/new', (req, res) => {
  // render to index.html
  let data = {}
  data = Object.assign(data, req.body) // name, date, category, amount
  const tokens = data.date.split('-')
  data.date = new Date(tokens[0], tokens[1], tokens[2])

  Record.create(data, function (error) {
    if (error) {
      console.log(error)
      req.session.middleData = req.body
      return res.redirect(`/record/new`)
    } else {
      req.session.middleData = undefined
      return res.redirect('/')
    }
  })
})

router.get('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  const isFail = req.query.isFail
  let hint = null
  if (isFail === 'false') hint = '輸入成功'
  if (isFail === 'true') hint = '<strong>Error: </strong>請確認修改的空格都已確實填入！且金額不得小於等於零。'
  console.log(isFail, hint)
  Category
    .find()
    .lean()
    .then(categories => {
      Record
        .find({ _id: rid })
        .lean()
        .then(output => {
          output.forEach(element => element.date = tools.date2String(element.date))
          return res.render('edit', { data: output[0], categories, isFail, hint })
        })
    })
    .catch(error => console.log(error))
})

router.put('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  let newData = {}
  newData = Object.assign(newData, req.body) // name, date, category, amount
  newData.date = tools.transformDateType(newData)
  newData.amount = Number(newData.amount)

  return Record.findById(rid)
    .then(record => {
      Object.assign(record, newData)
      return record.save()
    })
    .then((error) => {
      res.redirect(`/record/edit/${rid}?isFail=false`)
    })
    .catch(error => {
      res.redirect(`/record/edit/${rid}?isFail=true`)
      console.log(error)
    })
})

router.delete('/delete/:rid', (req, res) => {
  // render to index.html
  const rid = req.params.rid
  Record.findById(rid)
    .then(output => { output.remove() })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router