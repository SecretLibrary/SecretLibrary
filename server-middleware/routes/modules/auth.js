
const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('AUTH ROOT')
})

router.post('/check', (req, res) => {
    const result = req.user && req.isAuthenticated()
    res.json(result)
})

router.get('/isManager', (req, res) => {
    const result = req.user && req.user.level > 1
    res.json(result)
})

router.post('/logout', (req, res) => {
    req.logout()
    res.json('done')
})

router.get('/kakao2', passport.authenticate('bearer'), (req, res) => res.json(req.user))

// router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/Login',
        successRedirect: '/Auth/Callback',
        failureFlash: false
    })
)

module.exports = router
