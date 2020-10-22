const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
  return res.redirect('/index')
})

router.get('/index', (req, res) => {
  const queryCate = req.query.category
  const promises = []

  let condition = (queryCate) ? { category: queryCate } : {}

  promises.push(Category.find().sort({ '_id': 'asc' }).lean().exec())
  promises.push(Record.find(condition).lean().exec())

  Promise.all(promises).then(results => {
    const categories = results[0]
    const records = results[1]
    // console.log(records[0].date.getMonth())
    return res.render('index', { categories, records })
  }).catch(err => {
    console.log(err)
  })
})

module.exports = router