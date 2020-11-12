const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

require('./config/mongoose')

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: require('./utils/hbsHelpers.js')
}))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'UncleRogerIsAFunnyYoutuberHiya',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(routes)


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})