
const express = require('express')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.get('/', auth.isCompleteAuthenticated, (req, res) => {
    res.send('Hello World')
})

module.exports = router
