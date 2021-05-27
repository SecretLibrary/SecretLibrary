
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': 2 })
    res.write('OK')
    res.end()
})

module.exports = router
