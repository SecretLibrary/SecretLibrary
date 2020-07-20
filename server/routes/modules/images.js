
const express = require('express')
const imageHandler = require('../../aws/modules/imageHandler')

const router = express.Router()

router.get('/', async (req, res) => {
    const images = await imageHandler.getImageList()
    res.json({
        images
    })
})

router.post('/', imageHandler.uploadImageViaMulter.single('img'), (req, res) => {
    const url = req.file.location
    res.json({
        url
    })
})

module.exports = router
