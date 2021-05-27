
const passport = require('passport')
const sha256 = require('js-sha256').sha256
const BearerStrategy = require('passport-http-bearer').Strategy
const KakaoStrategy = require('passport-kakao').Strategy

const axios = require('axios')
const userHandler = require('../aws/modules/user')

const kakaoClientID = process.env.KAKAO_CLIENT_ID
const kakaoCallbackURL = process.env.KAKAO_CALLBACK_URL

passport.serializeUser((user, done) => {
    // console.log('serialize', user)
    return done(null, user)
})
passport.deserializeUser((user, done) => {
    // console.log('desirialize', user)
    return done(null, user)
})

const hashKey = process.env.SESSION_KEY

passport.use(new BearerStrategy(
    async (token, done) => {
        try {
            const res = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    // eslint-disable-next-line camelcase
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })

            const { id } = res.data
            const provider = 'KAKAO'

            const key = sha256(`${provider}_${id}_${hashKey}`)
            const user = await userHandler.getItem(key)
            const registered = !!user

            if (registered) {
                const scope = user.cLevel > 5 ? 'admin' : 'user'
                return done(null, user, { scope })
            }

            return done(null, false, 'Not registered')
        } catch (e) {
            // console.log(e)
            return done(e)
        }
    }
))

passport.use(new KakaoStrategy({
    clientID: kakaoClientID,
    callbackURL: kakaoCallbackURL
}, async function (accessToken, refreshToken, profile, done) {
    const provider = 'KAKAO'

    const id = `${profile.id}`
    const username = profile.username
    const email = profile._json.kakao_account.email || null
    const profileImage = profile._json.properties.profile_image || null
    const userKey = sha256(`${provider}_${id}_${hashKey}`)

    try {
        let user = await userHandler.getItem(userKey)

        if (!user) {
            await userHandler.addItem(userKey, email, null, username, profileImage, '$NO_USER_ID', provider)
            user = await userHandler.getItem(userKey)
        }
        return done(null, user)
    } catch (e) {
        console.error(e)
        return done(e)
    }
}))
