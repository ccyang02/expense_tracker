const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')

const SEED_USERS = [
  {
    name: 'user01',
    email: 'user01@example.com',
    password: '1234'
  },
  {
    name: 'user02',
    email: 'user02@example.com',
    password: '1234'
  },
]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => {
      return Promise.all(SEED_USERS.map(user => bcrypt.hash(user.password, salt)))
    })
    .then(hash => {
      SEED_USERS.map((user, i) => user.password = hash[i])
      return User.insertMany(SEED_USERS, { ordered: false })
    })
    .then(() => {
      console.log('Insert users data successfully.')
      process.exit()
    })
    .catch(error => {
      // console.log(error)
      process.exit()
    })

})
