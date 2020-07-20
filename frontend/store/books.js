
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
    init ({ commit }) {
        commit('add', [])
    },
    async fetch ({ commit }, { title }) {
        try {
            const res = await this.$axios.get(`/books?query=${title}`)
            const books = res.data.result
            commit('add', books)
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
