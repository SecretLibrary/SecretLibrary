
const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const { paramCheck } = require('../utils/params')
const comments = require('../../aws/modules/comments')

const response = require('../utils/response')
const router = express.Router()

router.get('/article/:articleKey', [], async (req, res) => {
    const { articleKey } = req.params

    try {
        const items = await comments.getItemsByArticleKey(articleKey)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.post('/article/:articleKey', [isCompleteAuthenticated], async (req, res) => {
    const { articleKey } = req.params
    const { comment, imgUrl } = req.body
    const { userId, profileImage, userName } = req.user
    const user = {
        userId,
        profileImage,
        userName
    }

    const check = paramCheck({ articleKey, comment })

    if (!check) {
        const message = 'Can not find some of params'
        return response.failed(res, { message })
    }

    try {
        const items = await comments.addItem(userId, articleKey, user, comment, imgUrl)
        return response.success(res, items)
    } catch (e) {
        console.error(e)
        return response.failed(res, e)
    }
})

router.get('/userId/:userId', [isCompleteAuthenticated], async (req, res) => {
    const { userId } = req.params

    try {
        const items = await comments.getItemsByUserId(userId)
        response.success(res, items)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.delete('/:itemKey', [isCompleteAuthenticated], async (req, res) => {
    const { itemKey } = req.params
    const { userId } = req.user

    try {
        const comment = await comments.getItem(itemKey)
        if (comment.userId !== userId) {
            return response.failed(res, { status: 403, message: 'userId does not matched.' })
        }
        await comments.deleteItem(itemKey)
        response.success(res, true)
    } catch (e) {
        console.error(e)
        return response.failed(res, e)
    }
})

module.exports = router
