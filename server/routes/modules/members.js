const express = require('express')
const members = require('../../aws/modules/user')
const response = require('../utils/response')
const { isCompleteAuthenticated } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', isCompleteAuthenticated, async (req, res) => {
    try {
        const list = await members.getItemList()
        response.success(res, list)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/:id', isCompleteAuthenticated, async (req, res) => {
    const id = req.params.id
    try {
        const user = await members.getMember(id)
        response.success(res, user)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
