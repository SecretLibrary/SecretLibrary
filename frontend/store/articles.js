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

            let url = '/articles'

            if (lastEvaluatedKey) {
                const { itemKey } = lastEvaluatedKey
                url = `${url}?itemKey=${itemKey}`
            }

            const res = await this.$axios.get(url)
            const { LastEvaluatedKey, Items } = res.data.result
            commit('add', Items)

            if (LastEvaluatedKey) {
                commit('update', { key: 'lastEvaluatedKey', value: LastEvaluatedKey })
            }

            res.more = !!LastEvaluatedKey

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
