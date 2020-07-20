
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
    async fetch ({ commit }) {
        try {
            const res = await this.$axios.get('/category/upper')
            const questions = res.data.result
            commit('add', questions)
            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export const getters = {
    items: state => state.items,
    item: state => code => state.items.find(item => item.Code === code) || { Category: '전체', Code: '00' }
}
