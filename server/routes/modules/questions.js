const express = require('express')
const { isCompleteAuthenticated, isAdmin } = require('../../middlewares/auth')
const response = require('../utils/response')
const { paramCheck } = require('../utils/params')

const questionsHandler = require('../../aws/modules/questions')

const router = express.Router()

router.get('/', [isCompleteAuthenticated], async (req, res) => {
    try {
        const { Items } = await questionsHandler.getList()
        return await response.success(res, Items)
    } catch (e) {
        console.error(e)
        return response.failed(res, e)
    }
})

router.post('/', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    const { text, categoryCode = '00' } = req.body
    const { userId, userName } = req.user

    const check = paramCheck({ text, categoryCode })

    if (!check) {
        const message = 'Can not find some of params'
        response.failed(res, { message })
        return
    }

    try {
        const itemKey = await questionsHandler.addItem(userId, userName, text, categoryCode)
        response.success(res, itemKey)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.put('/:itemKey', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    const { text, categoryCode = '00' } = req.body
    const { userId, userName } = req.user
    const itemKey = req.params.itemKey

    const check = paramCheck({ itemKey, text, categoryCode })

    if (!check) {
        const message = 'Can not find some of params'
        response.failed(res, { message })
        return
    }

    try {
        const data = await questionsHandler.updateItem(itemKey, userId, userName, text, categoryCode)
        response.success(res, data)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.delete('/:itemKey', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    const itemKey = req.params.itemKey
    try {
        await questionsHandler.deleteItem(itemKey)
        response.success(res, null)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
