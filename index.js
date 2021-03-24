const express = require('express')
const routes = require('./routes/index')
const njk = require('nunjucks')
const cookie_parser = require('cookie-parser')
const app = express()
const port = 3000

njk.configure('views', {
  autoescape: true,
  express: app
})

// Loads root directory for serving static files
app.use(express.static(__dirname))

// Decode url encoded data
app.use(
  express.urlencoded({
    extended: false
  })
)

// Parses requst body as json
app.use(express.json())

// Set and read cookies
app.use(cookie_parser())

// Routes
app.use(routes.home)

app.use(routes.auth)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
