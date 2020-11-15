const db = require('../../config/mongoose.js')
const data = require('../data/rawData')
const Category = require('../category.js')

const categories = data.categories

db.once('open', () => {
  return Category.insertMany(categories, { ordered: false })
    .then(() => {
      console.log('Insert categories data successfully.')
      process.exit()
    })
    .catch(error => {
      process.exit()
    })
})