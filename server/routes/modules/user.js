
const express = require('express')
const axios = require('axios')
const sha256 = require('js-sha256').sha256
const userHandler = require('../../aws/modules/user')
const object = require('../../utils/object')
const { isIncompleteAuthenticated, isCompleteAuthenticated } = require('../../middlewares/auth')

const response = require('../utils/response')
const router = express.Router()

router.put('/', [isIncompleteAuthenticated], async (req, res) => {
    const { email, gender, name, thumbnail, userId } = req.body
    const { itemKey } = req.user
    const registered = true

    try {
        const item = await userHandler.putItem(itemKey, email, gender, name, thumbnail, userId, registered)
        response.success(res, item)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.put('/updateProfile', [isCompleteAuthenticated], async (req, res) => {
    const { userName, profileImage, introduce } = req.body
    const { itemKey } = req.user

    try {
        await userHandler.updateProfile(itemKey, userName, introduce, profileImage)
        response.success(res, true)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const items = await userHandler.getUserById(userId)
        if (items.length > 0) {
            return response.success(res, items[0])
        }
        return response.failed(res, { status: 404, message: `Can not find userId ${userId}`})
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/check/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const items = await userHandler.getUserById(userId)
        response.success(res, items.length > 0)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.get('/kakao/me', async (req, res) => {
    const Authorization = req.headers.authorization

    try {
        const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                // eslint-disable-next-line camelcase
                Authorization,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })

        const { id } = data
        const provider = 'KAKAO'

        const userKey = sha256(`${provider}_${id}_${hashKey}`)
        const user = await userHandler.getItem(userKey)
        const { itemKey } = user
        const registered = !!itemKey

        if (registered) {
            return response.success(res, object.excludeKey(user, 'itemKey'))
        }

        return response.failed(res, { status: 401, message: '등록되지 않은 사용자 입니다.' })
    } catch (e) {
        // console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
