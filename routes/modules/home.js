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
  const queryCate = req.query.queryCate
  const queryTimestamp = req.query.queryTimestamp
  const promises = []
  const userId = req.user._id

  function getQuery(userId, queryCate, queryTimestamp) {
    let queryArr = [{ userId }]

    if (queryCate) {
      const cateCondition = [
        { category: queryCate }
      ]
      queryArr = [...queryArr, ...cateCondition]
    }

    if (queryTimestamp) {
      const startTimestamp = Number(queryTimestamp.slice(0, 13))
      const endTimestamp = Number(queryTimestamp.slice(13, 26))

      const timeCondition = [
        { date: { $gte: new Date(startTimestamp) } },
        { date: { $lt: new Date(endTimestamp) } },
      ]
      queryArr = [...queryArr, ...timeCondition]
    }

    return {
      $and: queryArr
    }
  }

  const query = getQuery(userId, queryCate, queryTimestamp)

  promises.push(Category.find().sort({ '_id': 'asc' }).lean().exec())
  promises.push(Record.find(query).lean().exec())

  Promise.all(promises).then(results => {
    const categories = results[0]
    const records = results[1]

    records.forEach(element => {
      element.date = element.date.getTime()
      // join category.icon to record
      element.icon = categories.find(c => c.code === element.category).icon
    })
    const totalAmount = (records.length === 0) ? 0 : Number(tools.getTotalAmount(records))
    return res.render('index', { categories, records, totalAmount, queryCate, queryTimestamp })
  }).catch(err => {
    console.log(err)
    return res.end()
  })
})

module.exports = router