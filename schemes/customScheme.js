import LocalScheme from '@nuxtjs/auth/lib/schemes/local'
import axios from 'axios'

export default class CustomScheme extends LocalScheme {
    // Override `fetchUser` method of `local` scheme
    async fetchUser (endpoint) {
        // Token is required but not available
        if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
            return
        }

        // User endpoint is disabled.
        if (!this.options.endpoints.user) {
            this.$auth.setUser({})
            return
        }

        const token = this.$auth.getToken(this.name)

        const { data } = await axios.get(`api${this.options.endpoints.user.url}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const user = data.result

        this.$auth.setUser(user)
    }

    // Override `login` method of `local` scheme
    async login (endpoint) {
        if (!this.options.endpoints.login) {
            return
        }

        await this.$auth.reset()

        const res = await this.$auth.request(endpoint, this.options.endpoints.login, true)
        const { response } = res

        if (this.options.tokenRequired) {
            const token = response.config.headers.authorization.split(' ')[1]

            this.$auth.setToken(this.name, token)
            this._setToken(`Bearer ${token}`)
        }

        if (this.options.autoFetchUser) {
            await this.fetchUser()
        }

        return response
    }
}
