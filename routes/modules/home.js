const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const tools = require('../../utils/tools')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.static('public'))

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

router.get('/', (req, res) => {
  return res.redirect('/index')
})

router.get('/index', (req, res) => {
  const queryCate = req.query.category
  const promises = []
  const userId = req.user._id

  // if users filter data by category
  let condition = (queryCate) ? { category: queryCate } : {}

  promises.push(Category.find().sort({ '_id': 'asc' }).lean().exec())
  promises.push(Record.find(condition).find({ userId }).lean().exec())

  Promise.all(promises).then(results => {
    const categories = results[0]
    const records = results[1]

    records.forEach(element => {
      element.date = tools.date2String(element.date)
      // join category.icon to record
      element.icon = categories.find(c => c.code === element.category).icon
    })

    const totalAmount = (records.length === 0) ? 0 : Number(tools.getTotalAmount(records))
    return res.render('index', { categories, records, totalAmount })
  }).catch(err => {
    console.log(err)
    return res.end()
  })
})

module.exports = router