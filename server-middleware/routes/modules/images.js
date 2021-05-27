
const express = require('express')
const imageHandler = require('../../aws/modules/imageHandler')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const response = require('../utils/response')

const router = express.Router()

router.post('/', [isCompleteAuthenticated, imageHandler.uploadImageViaMulter.single('img')], (req, res) => {
    const url = req.file.location
    response.success(res, url)
})

module.exports = router
