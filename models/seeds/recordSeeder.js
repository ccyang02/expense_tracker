const db = require('../../config/mongoose.js')
const data = require('../data/rawData')
const Record = require('../record')

const records = data.records

db.once('open', () => {
  console.log('Mongodb connected!')
  Record.create(records)
    .then(() => {
      console.log('Record data inserting completed.')
      return db.close()
    })
    .then(() => {
      console.log('Close connection successfully.')
    })
})