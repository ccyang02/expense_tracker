const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

const routes = require('./routes')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(routes)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`)
})