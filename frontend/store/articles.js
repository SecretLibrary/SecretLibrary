import { sortByCreatedAt } from '~/utils/Object'

export const state = () => ({
    items: [],
    lastEvaluatedKey: null,
    firstTouch: true
})

export const mutations = {
    init (state) {
        state.items.splice(0, state.items.length)
        state.lastEvaluatedKey = null
        state.firstTouch = true
    },
    add (state, items) {
        items = sortByCreatedAt(items, false)
        state.firstTouch = false
        state.items.push(...items)
    },
    update (state, { key, value }) {
        state[key] = value
    }
}

export const actions = {
    init ({ commit }) {
        commit('init')
    },
    async fetch ({ commit, state }) {
        try {
            const { lastEvaluatedKey } = state
            const res = await this.$axios.get(`/articles?lastEvaluatedKey=${lastEvaluatedKey}`)
            const { LastEvaluatedKey, Items } = res.data.result
            commit('add', Items)
            commit('update', { key: 'lastEvaluatedKey', value: LastEvaluatedKey })
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
