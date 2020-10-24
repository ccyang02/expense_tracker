const db = require('../../config/mongoose.js')
const data = require('../data/rawData')
const Category = require('../category.js')

const categories = data.categories

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