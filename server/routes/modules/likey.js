
const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const { paramCheck } = require('../utils/params')
const likey = require('../../aws/modules/likey')
const articles = require('../../aws/modules/articles')
const library = require('../../aws/modules/library')

const response = require('../utils/response')
const router = express.Router()

router.get('/article/:articleKey', async (req, res) => {
    const { articleKey } = req.params

    const check = paramCheck({ articleKey })

    if (!check) {
        const message = 'Can not find some of params'
        return response.failed(res, { message })
    }

    try {
        const items = await likey.getItemsByArticleKey(articleKey)
        return response.success(res, items)
    } catch (e) {
        console.error(e)
        return response.failed(res, e)
    }
})

router.post('/article/:articleKey', [isCompleteAuthenticated], async (req, res) => {
    const { articleKey } = req.params
    const { userId, profileImage, userName } = req.user
    const userInfo = {
        userId,
        profileImage,
        userName
    }

    const check = paramCheck({ articleKey })

    if (!check) {
        const message = 'Can not find some of params'
        return response.failed(res, { message })
    }

    try {
        const items = await likey.getItemsByArticleKey(articleKey)
        const targetLikey = items.find(item => item.userId === userId)

        if (targetLikey) {
            const { itemKey } = targetLikey

            const value = items.length + 1

            await likey.deleteItem(itemKey)
            await articles.updateLikey(articleKey, value)
            await library.updateLikey(articleKey, value)
            return response.success(res, -1)
        }

        const value = items.length + 1

        await likey.addItem(userId, articleKey, userInfo)
        await articles.updateLikey(articleKey, value)
        await library.updateLikey(articleKey, value)
        return response.success(res, 1)
    } catch (e) {
        console.error(e)
        return response.failed(res, e)
    }
})

module.exports = router
