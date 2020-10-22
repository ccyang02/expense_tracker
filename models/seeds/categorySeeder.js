// test case
const categories = [
  {
    name: 'residence',
    image: 'fas fa-home'
  },
  {
    name: 'transportation',
    image: 'fas fa-shuttle-van'
  },
  {
    name: 'amusement',
    image: 'fas fa-grin-beam'
  },
  {
    name: 'food',
    image: 'fas fa-utensils'
  },
  {
    name: 'others',
    image: 'fas fa-pen'
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
