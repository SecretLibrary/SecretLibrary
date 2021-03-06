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
    add (state, targetItems) {
        const { items, firstTouch, itemSet } = state
        if (firstTouch) {
            state.firstTouch = false
        }

        targetItems.forEach((item) => {
            const key = item.itemKey
            if (itemSet.has(key) === false) {
                items.push(item)
                itemSet.add(key)
            }
        })

        state.items = sortByCreatedAt(items, false)
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
