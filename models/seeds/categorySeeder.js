// test case
const categories = [
  {
    code: 'residence',
    name: '家居物業',
    icon: 'fas fa-home'
  },
  {
    code: 'transportation',
    name: '交通出行',
    icon: 'fas fa-shuttle-van'
  },
  {
    code: 'amusement',
    name: '休閒娛樂',
    icon: 'fas fa-grin-beam'
  },
  {
    code: 'food',
    name: '餐飲食品',
    icon: 'fas fa-utensils'
  },
  {
    code: 'others',
    name: '其他',
    icon: 'fas fa-pen'
  }
]

const Category = require('../category.js')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  categories.forEach(category => Category.create(category))
  console.log('Complete!')
})
