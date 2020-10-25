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
  namespaced: true,
  state: {
    orders: [],
  },
  mutations: {
    setOrders(state, payload) {
      state.orders = payload;
    },
  },
  actions: {
    async createOrder({ dispatch }, { name, phone, adId, ownerId }) {
      const order = new Order(name, phone, adId);
      dispatch('shared/clearError', null, { root: true });

      try {
        await firebase
          .database()
          .ref(`/users/${ownerId}/orders`)
          .push(order);
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },
    async fetchOrders({ commit, dispatch, rootState }) {
      dispatch('shared/startLoading', null, { root: true });
      dispatch('shared/clearError', null, { root: true });
      const resultOrders = [];

      try {
        const firebaseValue = await firebase
          .database()
          .ref(`/users/${rootState['user'].user.id}/orders`)
          .once('value');

        const orders = firebaseValue.val();

        if (!orders) {
          dispatch('shared/finishLoading', null, { root: true });
          return;
        }

        Object.keys(orders).forEach((key) => {
          const order = orders[key];
          resultOrders.push(
            new Order(order.name, order.phone, order.adId, order.done, key)
          );
        });

        commit('setOrders', resultOrders);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error, { root: true });
        throw error;
      }
    },
    async markOrderDone({ dispatch, rootState }, payload) {
      try {
        await firebase
          .database()
          .ref(`users/${rootState['user'].user.id}/orders`)
          .child(payload)
          .update({
            done: true,
          });
      } catch (error) {
        dispatch('shared/setError', error, { root: true });
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
