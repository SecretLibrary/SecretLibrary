const express = require('express')
const passport = require('passport')
const session = require('cookie-session')
const cors = require('cors')

require('dotenv').config()

const app = express()

const secret = process.env.SESSION_KEY

//  Express Settings
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    resave: false,
    saveUninitialized: true
}))

app.use(cors())

app.use(passport.initialize({}))
app.use(passport.session({}))

//  Initialize passport strategies
require('./middlewares/passport')

//  Routes
const api = require('./routes/api')

//  Set additional API routes
api.forEach(({ path, router }) => app.use(path, router))

module.exports = app
