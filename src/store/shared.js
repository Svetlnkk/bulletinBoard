export default {
  namespaced: true,
  state: {
    error: null,
    loading: 0,
  },
  mutations: {
    clearError(state) {
      state.error = null;
    },

    finishLoading(state) {
      state.loading--;
    },

    setError(state, payload) {
      state.error = payload;
    },

    startLoading(state) {
      state.loading++;
    },
  },
  actions: {
    clearError({ commit }) {
      commit('clearError');
    },

    finishLoading({ commit }) {
      commit('finishLoading');
    },

    setError({ commit }, payload) {
      commit('setError', payload);
    },

    startLoading({ commit }) {
      commit('startLoading');
    },
  },
};
