
const express = require('express')
const places = require('../../aws/modules/places')
const response = require('../utils/response')
const { paramCheck } = require('../utils/params')
const { isCompleteAuthenticated, isAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    try {
        const placeList = await places.getPlaceList()
        response.success(res, placeList)
    } catch (e) {
        response.failed(res, e)
    }
})

router.post('/', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    const { placeTitle, placePosition, tel, size } = req.body
    let { lat, lng } = req.body

    lat = Number(lat)
    lng = Number(lng)

    const check = paramCheck({ lat, lng, placeTitle, placePosition, tel, size })

    if (!check) {
        const message = 'Can not find some of params'
        response.failed(res, { message })
        return
    }

    try {
        const meetingId = await places.addPlace(lat, lng, placeTitle, placePosition, tel, size)
        response.success(res, meetingId)
    } catch (e) {
        response.failed(res, e)
    }
})

module.exports = router
