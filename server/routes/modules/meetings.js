
const express = require('express')
const meetings = require('../../aws/modules/meetings')
const attendee = require('../../aws/modules/attendee')
const { isCompleteAuthenticated, isAdmin } = require('../../middlewares/auth')

const constState = require('../../const/meeting').state
const response = require('../utils/response')

const router = express.Router()

const paramCheck = params => Object.keys(params).every(key => params[key] !== undefined)

router.get('/', async (req, res) => {
    const { date, amount, unit } = req.query

    try {
        const list = await meetings.getMeetingList(date, amount, unit)
        response.success(res, list)
    } catch (e) {
        response.failed(res, e)
    }
})

router.get('/userId/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const list = await attendee.getAttendedItemsByUserId(userId)
        response.success(res, list)
    } catch (e) {
        response.failed(res, e)
    }
})

router.get('/:itemKey', isCompleteAuthenticated, async (req, res) => {
    const itemKey = req.params.itemKey
    try {
        const meeting = await meetings.getMeeting(itemKey)
        meeting.attendee = await attendee.getAttendeeByMeetingKey(itemKey)
        response.success(res, meeting)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.post('/', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    const { size, title, lat, lng, placeTitle, placePosition, startDate, endDate, state } = req.body
    const check = paramCheck({ title, lat, lng, placeTitle, placePosition, startDate, endDate, size, state })
    const { userId, userName } = req.user

    if (!check) {
        const message = 'Can not find some of params'
        response.failed(res, { message })
        return
    }

    try {
        const meetingId = await meetings.addMeeting({ size, title, userId, userName, lat, lng, placeTitle, placePosition, startDate, endDate, state })
        response.success(res, meetingId)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

router.post('/attend', [isCompleteAuthenticated], async (req, res) => {
    const { meetingKey } = req.body
    const { userId, profileImage, userName } = req.user
    const check = paramCheck({ meetingKey })

    if (!check) {
        const message = 'Can not find some of params'
        response.failed(res, { message })
        return
    }

    try {
        const meeting = await meetings.getMeeting(meetingKey)

        if (meeting.Item === null) {
            const message = `Cannot find meeting item with id (${meetingKey})`
            return response.failed(res, { message })
        }

        const attendeeList = await attendee.getAttendeeByMeetingKey(meetingKey)

        if (attendeeList && attendeeList.length >= meeting.size) {
            const message = `Cannot attend to meeting. (${meeting.attendeeList.length}/${meeting.size})`
            const status = 406
            return response.failed(res, { message, status })
        }

        if (attendeeList.some(item => item.userId === userId)) {
            const message = 'Cannot attend same user in same meeting'
            const status = 409
            return response.failed(res, { message, status })
        }

        const data = await attendee.addItem(meetingKey, userId, userName, profileImage)
        response.success(res, data)
    } catch (e) {
        response.failed(res, e)
    }
})

router.put('/state/:id', [isCompleteAuthenticated, isAdmin], async (req, res) => {
    let { state } = req.body
    const id = req.params.id

    if (state === undefined || !Object.keys(constState).some(key => constState[key] === state)) {
        state = constState.close
    }

    try {
        const data = await meetings.changeState(id, state)
        response.success(res, data)
    } catch (e) {
        console.error(e)
        response.failed(res, e)
    }
})

module.exports = router
