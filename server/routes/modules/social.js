const express = require('express')
const axios = require('axios')
const response = require('../utils/response')
const router = express.Router()

router.get('/kakao/me', async (req, res) => {
    const token = req.headers.token

    try {
        const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                // eslint-disable-next-line camelcase
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })

        const { id } = data
        const { email, profile } = data.kakao_account
        const key = `kakao_${id}`

        const result = {
            key,
            email
        }

        if (profile) {
            result.name = profile.nickname
            result.profile_image_url = profile.profile_image_url
            result.thumbnail_image_url = profile.thumbnail_image_url
        }

        return response.success(res, result)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
