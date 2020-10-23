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
    .catch(error => console.log(error))
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

router.get('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  Category
    .find()
    .lean()
    .then(categories => {
      Record
        .find({ _id: rid })
        .lean()
        .then(output => {
          return res.render('edit', { data: output[0], categories })
        })
    })
    .catch(error => console.log(error))
})

router.put('/edit/:rid', (req, res) => {
  // render to edit.html
  const rid = req.params.rid
  let newData = {}
  newData = Object.assign(newData, req.body) // name, date, category, amount
  const tokens = newData.date.split('/')
  newData.date = Date(tokens[0], tokens[1], tokens[2])
  newData.amount = Number(newData.amount)

  return Record.findById(rid)
    .then(record => {
      Object.assign(record, newData)
      return record.save()
    })
    .then(() => res.redirect(`/record/edit/${rid}`))
    .catch(error => console.log(error))
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