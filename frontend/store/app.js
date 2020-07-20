
const threshold = {
    scroll: 30
}

export const state = () => ({
    scroll: 0
})

export const mutations = {
    scroll (state, scroll) {
        state.scroll = scroll
    }
}

export const actions = {
    init ({ commit }) {
        commit('scroll', 0)
    },
    scroll ({ commit }, scroll) {
        commit('scroll', scroll)
    }
}

export const getters = {
    scroll: state => state.scroll,
    scrolled: state => state.scroll > threshold.scroll
}
