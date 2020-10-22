export default {
  namespaced: true,
  state: {
    loading: false,
    loadingUser: false,
    error: null,
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setLoadingUser(state, payload) {
      state.loadingUser = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    setLoading({ commit }, payload) {
      commit('shared/setLoading', payload);
    },
    setLoadingUser({ commit }, payload) {
      commit('shared/setLoadingUser', payload);
    },
    setError({ commit }, payload) {
      commit('setError', payload);
    },
    clearError({ commit }) {
      commit('clearError');
    },
  },
  getters: {
    error(state) {
      return state.error;
    },
  },
};
