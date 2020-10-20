export default {
    state: {
        loading: false,
        loadingUser: false,
        error: null,
    },
    mutations: {
        setLoading (state, payload) {
            state.loading = payload;
        },
        setLoadingUser (state, payload) {
            state.loadingUser = payload
        },
        setError (state, payload) {
            state.error = payload;
        },
        clearError (state) {
            state.error = null;
        }
    },
    actions: {
        setLoading ({commit}, payload) {
            commit('setLoading', payload)
        },
        setLoadingUser ({commit}, payload) {
            commit('setLoadingUser', payload)
        },
        setError ({commit}, payload) {
            commit('setError', payload)
        },
        clearError({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadingUser (state) {
            return state.loadingUser
        },
        loading (state) {
            return state.loading
        },
        error (state) {
            return state.error
        }
    }
}