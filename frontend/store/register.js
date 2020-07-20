import { setItem } from '~/utils/Object'

export const state = () => ({
    token: null
})

export const mutations = {
    update (state, token) {
        setItem(state, 'token', token)
    },
    clear (state) {
        state.token = null
    }
}

export const actions = {
    update ({ commit }, token) {
        commit('update', token)
    },
    clear ({ commit }) {
        commit('clear')
    }
}

export const getters = {
    token: state => state.token
}
