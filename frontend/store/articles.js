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
        const { lastEvaluatedKey, firstTouch } = state

        if (!firstTouch && !lastEvaluatedKey) {
            return {
                more: false
            }
        }

        try {
            console.log('fucking fetched!', lastEvaluatedKey)

            let url = '/articles'

            if (lastEvaluatedKey) {
                const { itemKey } = lastEvaluatedKey
                url = `${url}?itemKey=${itemKey}`
            }

            const res = await this.$axios.get(url)
            const { LastEvaluatedKey, Items } = res.data.result
            commit('add', Items)

            const key = 'lastEvaluatedKey'
            const value = LastEvaluatedKey || null
            commit('update', { key, value })

            res.more = !!LastEvaluatedKey

            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export const getters = {
    items: state => state.items,
    firstTouch: state => state.firstTouch
}
