const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Record = require('../../models/record.js')
const Category = require('../../models/category.js')
const tools = require('../../public/javascripts/main')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.static('public'))

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

    records.forEach(element => {
      element.date = tools.date2String(element.date)
      element.icon = categories.find(c => c.code === element.category).icon // join category.icon to record
    })
    // console.log(records[0].date.getMonth())
    return res.render('index', { categories, records })
  }).catch(err => {
    console.log(err)
  })

})

module.exports = router