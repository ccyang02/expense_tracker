const Category = require('../category.js')
const data = require('../data/rawData')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

const categories = data.categories

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('Mongodb connected!')
  Category.create(categories)
    .then(() => {
      console.log('Category data inserting completed.')
      return db.close()
    })
    .then(() => {
      console.log('Close connection successfully.')
    })
})