import * as fireBase from 'firebase'

class User {
    constructor (id) {
        this.id = id
    }
}

export default {
    state: {
        user: null,
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        }
    },
    actions: {
        async registerUser ({commit}, {email, password}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                const user = await fireBase.auth().createUserWithEmailAndPassword(email, password)
                commit('setUser', new User(user.user.uid))
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false)
                commit('setError', error.message)
                throw(error)
            }
        },
        async loginUser({commit}, {email, password}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                const user = await fireBase.auth().signInWithEmailAndPassword(email, password)
                commit('setUser', new User(user.uid))
                commit('setLoading', false)
            } catch (error) {
                commit('setLoading', false)
                commit('setError', error.message)
                throw(error)
            }
        },
        autoLoginUser ({commit}, payload) {
            commit('setUser', new User(payload.uid))
        },
        logoutUser ({commit}) {
            fireBase.auth().signOut()
            commit('setUser', null)
            this.$router.push('/')
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        isUserLoggedIn (state) {
            return state.user !== null
        }
    },
}