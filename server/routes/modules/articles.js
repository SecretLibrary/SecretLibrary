const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const articles = require('../../aws/modules/articles')

const response = require('../utils/response')
const router = express.Router()

router.get('/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const items = await articles.getItems(userId)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/:userId/:itemKey', async (req, res) => {
    const { userId, itemKey } = req.params
    try {
        const item = await articles.getItem(itemKey, userId)

        if (!item) {
            return response.failed(res, { status: 404, message: `Cannot find content ${userId}/${itemKey}`})
        }

        response.success(res, item)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/', async (req, res) => {
    try {
        const items = await articles.getItems()
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.post('/', [isCompleteAuthenticated], async (req, res) => {
    const { items, url, book, meetingKey } = req.body
    const user = req.user
    const userId = user.userId

    try {
        const articleId = await articles.addItem(user, book, items, userId, meetingKey, url)
        response.success(res, articleId)
    } catch (e) {
        response.failed(res, e)
    }
})

router.put('/', [isCompleteAuthenticated], async (req, res) => {
    const { items, url, book, meetingKey, itemKey } = req.body
    const user = req.user
    const userId = user.userId

    try {
        const item = articles.getItem(itemKey)
        if (item.userId !== userId) {
            return response.failed(res, { message: 'userId does not match!', status: 403 })
        }
        await articles.updateItem(itemKey, user, items, url, book, meetingKey, userId)
        response.success(res, true)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
