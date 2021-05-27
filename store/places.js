
export const state = () => ({
    items: []
})

export const mutations = {
    add (state, items) {
        const target = state.items
        if (Array.isArray(items)) {
            target.splice(0, target.length)
            target.push(...items)
        } else {
            state.items.push(items)
        }
    }
}

export const actions = {
    async post ({ commit }, { lat, lng, placeTitle, placePosition, tel, size = null }) {
        try {
            return await this.$axios.post('/places', { lat, lng, placeTitle, placePosition, tel, size })
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    async fetch ({ commit }) {
        try {
            const res = await this.$axios.get('/places')
            const placeList = res.data.result
            commit('add', placeList)
            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export const getters = {
    items: state => state.items
}
