const express = require('express')
const router = express.Router()
const Category = require('../../models/category.js')
const Record = require('../../models/record.js')


router.get('/new', (req, res) => {
  // render to new.html
  const unsavedData = req.query
  Category
    .find()
    .sort({ '_id': 'asc' })
    .lean()
    .then(categories => {
      return res.render('new', { categories, unsavedData })
    })
})

router.post('/new', (req, res) => {
  // render to index.html
  let data = {}
  data = Object.assign(data, req.body) // name, date, category, amount
  const tokens = data.date.split('/')
  data.date = Date(tokens[0], tokens[1], tokens[2])
  data.amount = Number(data.amount)

  Record.create(data, function (error) {
    if (error) {
      console.log(error)
      // pass: use session
      return res.redirect(`/record/new?name=${data.name}&date=${data.date}&category=${data.category}&amount=${data.amount}`)
    } else {
      return res.redirect('/')
    }
  })
})

router.get('/:rid/edit', (req, res) => {
  // render to edit.html
})

router.put('/:rid/edit', (req, res) => {
  // render to edit.html
})

router.delete('/:rid/delete', (req, res) => {
  // render to index.html
})


module.exports = router