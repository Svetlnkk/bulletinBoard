import * as firebase from 'firebase';

class Order {
  constructor(name, phone, adId, done = false, id = null) {
    this.name = name;
    this.phone = phone;
    this.adId = adId;
    this.done = done;
    this.id = id;
  }
}

export default {
  state: {
    orders: [],
  },
  mutations: {
    loadOrders(state, payload) {
      state.orders = payload;
    },
  },
  actions: {
    async createOrder({ commit }, { name, phone, adId, ownerId }) {
      const order = new Order(name, phone, adId);
      commit('shared/clearError');

      try {
        await firebase
          .database()
          .ref(`/users/${ownerId}/orders`)
          .push(order);
      } catch (error) {
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async fetchOrders({ commit, getters }) {
      commit('shared/setLoading', true);
      commit('shared/clearError');

      const resultOrders = [];

      try {
        const firebaseValue = await firebase
          .database()
          .ref(`/users/${getters.user.id}/orders`)
          .once('value');

        const orders = firebaseValue.val();

        if (!orders) {
          commit('shared/setLoading', false);
          return;
        }

        Object.keys(orders).forEach((key) => {
          const order = orders[key];
          resultOrders.push(
            new Order(order.name, order.phone, order.adId, order.done, key)
          );
        });

        commit('loadOrders', resultOrders);
        commit('shared/setLoading', false);
      } catch (error) {
        commit('shared/setLoading', false);
        commit('shared/setError', error);
        throw error;
      }
    },
    async markOrderDone({ commit, getters }, payload) {
      try {
        await firebase
          .database()
          .ref(`users/${getters.user.id}/orders`)
          .child(payload)
          .update({
            done: true,
          });
      } catch (error) {
        commit('shared/setError', error);
        throw error;
      }
    },
  },
  getters: {
    doneOrders(state) {
      return state.orders.filter((order) => order.done);
    },
    undoneOrders(state) {
      return state.orders.filter((order) => !order.done);
    },
    orders(state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders);
    },
  },
};
