const express = require('express')
const { isCompleteAuthenticated } = require('../../middlewares/auth')
const response = require('../utils/response')

const category = require('../../const/category.json')

const router = express.Router()

router.get('/', [isCompleteAuthenticated], async (req, res) => {
    const data = Object.keys(category).map(key => category[key])
    return await response.success(res, data)
})

router.get('/upper', [isCompleteAuthenticated], async (req, res) => {
    const data = Object.keys(category).map(Code => Object
        .assign({}, {
            Category: category[Code].Category,
            Code
        })
    )
    return await response.success(res, data)
})

module.exports = router
