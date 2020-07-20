import { setItem } from '../utils/Object'

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
    },
    put (state, { id, ...params }) {
        const target = state.items.find(item => item.id === id)
        if (target === undefined) {
            return
        }

        Object.keys(params).forEach((key) => {
            setItem(target, key, params[key])
        })
    }
}

export const actions = {
    async post ({ commit }, { size, title, lat, lng, placeTitle, placePosition, startDate, endDate }) {
        const state = 'OPEN'
        try {
            return await this.$axios.post('/meetings', { size, title, lat, lng, placeTitle, placePosition, startDate, endDate, state })
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    async fetch ({ commit }) {
        try {
            const res = await this.$axios.get('/meetings', { progress: true })
            const meetingList = res.data.result
            commit('add', meetingList)
            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    async changeState ({ commit }, { id, state }) {
        try {
            const res = await this.$axios.put(`/meetings/state/${id}`)

            state = res.data.result.Attributes.state
            commit('put', { id, state })
            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export const getters = {
    items: state => state.items,
    open: state => state.items.filter(item => item.state === 'OPEN')
}
