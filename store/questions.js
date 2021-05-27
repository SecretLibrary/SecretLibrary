import { setItem, sortByCreatedAt } from '../utils/Object'

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
    put (state, { itemKey, text, categoryCode }) {
        const target = state.items.find(item => item.itemKey === itemKey)
        if (target === undefined) {
            return
        }

        setItem(target, 'text', text)
        setItem(target, 'categoryCode', categoryCode)
    },
    deleteItem (state, { itemKey }) {
        const index = state.items.findIndex(item => item.itemKey === itemKey)
        if (index >= 0) {
            state.items.splice(index, 1)
        }
    }
}

export const actions = {
    async post ({ commit }, { text, categoryCode }) {
        try {
            const res = await this.$axios.post('/questions', { text, categoryCode })
            return res
        } catch (e) {
            console.error(e)
            return e
        }
    },
    async put ({ commit }, { itemKey, text, categoryCode }) {
        try {
            const res = await this.$axios.put(`/questions/${itemKey}`, { text, categoryCode })
            commit('put', { itemKey, text, categoryCode })
            return res
        } catch (e) {
            console.error(e)
            return e
        }
    },
    async deleteItem ({ commit }, { itemKey }) {
        try {
            const res = await this.$axios.delete(`/questions/${itemKey}`)
            commit('deleteItem', { itemKey })
            return res
        } catch (e) {
            console.error(e)
            return e
        }
    },
    async fetch ({ commit }) {
        try {
            const res = await this.$axios.get('/questions')
            const questions = sortByCreatedAt(res.data.result)
            commit('add', questions)
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
