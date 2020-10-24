const Record = require('../record')
const data = require('../data/rawData')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

const records = data.records

db.on('error', () => {
  console.log('mongodb error!')
})
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