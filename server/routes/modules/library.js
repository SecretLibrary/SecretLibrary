const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const library = require('../../aws/modules/library')

const response = require('../utils/response')
const router = express.Router()

router.get('/', [isCompleteAuthenticated], async (req, res) => {
    const { itemKey, limit } = req.query

    try {
        const items = await library.getItems(itemKey, limit)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
