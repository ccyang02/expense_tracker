// test case
const records = [
  {
    name: '打牌輸錢',
    category: 'amusement',
    date: new Date(2020, 10, 20),
    amount: 2000,
  },
  {
    name: '家人吃餐廳',
    category: 'food',
    date: new Date(2020, 10, 21),
    amount: 666,
  }
]

const Record = require('../record')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  records.forEach(record => Record.create(record))
  console.log('Complete!')
})

// pass: there exists execution problem when use `npm run seed`