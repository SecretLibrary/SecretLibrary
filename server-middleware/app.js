const express = require('express')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const MemoryStore = require('session-memory-store')(session)

require('dotenv').config()

const app = express()

const secret = process.env.SESSION_KEY

//  Express Settings
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://www.secretlibrary.net'
    ]
    // methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    // exposedHeaders: 'Authorization',
    // credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 14 * 24 * 60 * 60 * 1000 },
    store: new MemoryStore()
}))

app.use(passport.initialize({}))
app.use(passport.session({}))

//  Initialize passport strategies
require('./middlewares/passport')

//  Routes
const api = require('./routes/api')

//  Set additional API routes
api.forEach(({ path, router }) => app.use(path, router))

module.exports = app
