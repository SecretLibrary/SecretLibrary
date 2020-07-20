const express = require('express')
const consola = require('consola')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')

const app = express()

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'
config.apiKeyPath = process.env.API_KEY_PATH

require('dotenv').config()

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
api.forEach(({ path, router }) => {
    app.use(`/api/${path}`, router)
})

async function start () {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    const { host, port } = nuxt.options.server

    await nuxt.ready()
    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()
