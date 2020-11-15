const db = require('../../config/mongoose.js')
const data = require('../data/rawData')
const Record = require('../record')
const User = require('../user')

let records = data.records

db.once('open', () => {
  promises = []
  promises.push(User.find().lean().exec())
  promises.push(Record.find().lean().exec())

  Promise.all(promises)
    .then(results => {
      const users = results[0]
      let recordsInDB = results[1]
      if (recordsInDB.length !== 0) {
        // skip data if there exists the same name in db
        recordsInDB = recordsInDB.map(record => record.name)
        records = records.filter(record => recordsInDB.includes(record.name))
      }
      records = records.map((record, i) => {
        if (i < (records.length) / 2) record.userId = users[0]._id
        else record.userId = users[1]._id
        return record
      })
      return records
    })
    .then(records => {
      console.log('>>>', records)
      return Record.create(records)
        .then(() => {
          console.log('Insert records data successfully.')
          process.exit()
        })
        .catch(error => {
          console.log(error)
          process.exit()
        })
    })
})