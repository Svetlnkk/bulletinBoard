export default {
  namespaced: true,
  state: {
    loading: 0,
  },
  mutations: {
    startLoading(state) {
      state.loading++
    },
    finishLoading(state) {
      state.loading--
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    startLoading({commit}) {
        commit('startLoading');
    },
    finishLoading({commit}) {
        commit('finishLoading');
    },
    setError({commit}, payload) {
        commit('setError', payload);
    },
    clearError({commit}) {
        commit('clearError');
    },
  },
};
