import { sortByCreatedAt } from '~/utils/Object'

export const state = () => ({
    items: [],
    lastEvaluatedKey: null,
    firstTouch: true,
    itemSet: new Set()
})

export const mutations = {
    init (state) {
        state.items.splice(0, state.items.length)
        state.lastEvaluatedKey = null
    },
    add (state, items) {
        if (state.firstTouch) {
            state.firstTouch = false
        }

        const keys = items.map(item => item.itemKey)
        keys.forEach(key => state.itemSet.add(key))
        items.forEach((item) => {
            const key = item.key
            if (!state.itemSet.has(key)) {
                state.items.push(item)
            }
        })
        // state.items.push(...items)
        state.items = sortByCreatedAt(state.items, false)
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
        // if (lastEvaluatedKey) {
        //     console.log('lastEvaluatedKey', lastEvaluatedKey.itemKey, 'firstTouch', firstTouch)
        // } else {
        //     console.log('lastEvaluatedKey : null', 'firstTouch', firstTouch)
        // }

        if (!firstTouch && !lastEvaluatedKey) {
            return {
                more: false
            }
        }

        try {
            let url = '/library'

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
    items: state => state.items
}
