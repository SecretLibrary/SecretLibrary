
export const state = () => ({
    items: []
})

export const mutations = {
    add (state, memberList) {
        const target = state.items
        target.splice(0, target.length)
        target.push(...memberList)
    }
}

export const actions = {
    async fetch ({ commit }) {
        try {
            const res = await this.$axios.get('/members')
            const memberList = res.data.result
            commit('add', memberList)
            return res
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export const getters = {
    items: state => state.items || []
}
