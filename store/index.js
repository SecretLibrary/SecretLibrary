export const actions = {
    async nuxtServerInit ({ commit, state }, { store, res, req, $auth }) {
        console.log('nuxtServerInit req.session:', req.session)
        if (req && req.session && req.session.passport && req.session.passport.user) {
            const user = req.session.passport.user
            await $auth.setUser(user)
        }
    }
}
