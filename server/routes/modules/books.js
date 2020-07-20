const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const response = require('../utils/response')
const kakaoSearch = require('../../utils/kakaoSearch')
// const books = require('../../aws/modules/books')

const router = express.Router()

router.get('/', [isCompleteAuthenticated], async (req, res) => {
    const query = req.query.query
    try {
        const Items = await kakaoSearch(query)
        response.success(res, Items)
    } catch (e) {
        response.failed(res, e)
    }
})

module.exports = router
