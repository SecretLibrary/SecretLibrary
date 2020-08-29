const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const articles = require('../../aws/modules/articles')
const library = require('../../aws/modules/library')

const response = require('../utils/response')
const router = express.Router()

router.get('/userId/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const items = await articles.getItemsByUserId(userId)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/:itemKey', async (req, res) => {
    const { itemKey } = req.params
    try {
        const item = await articles.getItem(itemKey)

        if (!item) {
            return response.failed(res, { status: 404, message: `Cannot find content ${itemKey}` })
        }

        response.success(res, item)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/', async (req, res) => {
    const { itemKey, limit } = req.query

    try {
        const items = await articles.getItems(itemKey, limit)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.post('/', [isCompleteAuthenticated], async (req, res) => {
    const { items, imageUrl, book, meetingKey } = req.body
    const { userId, profileImage, userName } = req.user
    const user = {
        userId,
        profileImage,
        userName
    }

    const questions = items.map(item => item.question)

    try {
        const articleId = await articles.addItem(user, book, items, userId, meetingKey, imageUrl)
        await library.addItem(user, book, questions, userId, meetingKey, imageUrl)
        response.success(res, articleId)
    } catch (e) {
        response.failed(res, e)
    }
})

router.put('/:itemKey', [isCompleteAuthenticated], async (req, res) => {
    const { itemKey } = req.params
    const { items, imageUrl, book, meetingKey } = req.body
    const { userId, profileImage, userName } = req.user
    const user = {
        userId,
        profileImage,
        userName
    }

    try {
        const item = await articles.getItem(itemKey)

        if (item.userId !== userId) {
            return response.failed(res, { message: 'userId does not match!', status: 403 })
        }
        await articles.updateItem(itemKey, user, items, imageUrl, book, meetingKey, userId)
        response.success(res, true)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.delete('/:itemKey', async (req, res) => {
    const { itemKey } = req.params
    const user = req.user

    try {
        const item = await articles.getItem(itemKey)

        if (!item) {
            return response.failed(res, { status: 404, message: `can not find item ${itemKey}` })
        }

        const userId = item.userInfo.userId

        if (user.userId !== userId) {
            return response.failed(res, { status: 403, message: 'userId does not match.' })
        }

        await articles.deleteItem(itemKey, userId)

        response.success(res, true)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
