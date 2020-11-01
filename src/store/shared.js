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

    decreaseLoading(state) {
      state.loading--;
    },

    setError(state, payload) {
      state.error = payload;
    },

    increaseLoading(state) {
      state.loading++;
    },
  },
  actions: {
    clearError({ commit }) {
      commit('clearError');
    },

    decreaseLoading({ commit }) {
      commit('decreaseLoading');
    },

    setError({ commit }, payload) {
      commit('setError', payload);
    },

    increaseLoading({ commit }) {
      commit('increaseLoading');
    },
  },
};
