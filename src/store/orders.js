import * as firebase from 'firebase';
import { Order } from './essentials';

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
    // create order to the owner ad
    async createOrder({ dispatch }, { name, phone, adId, ownerId }) {
      const order = new Order({ adId, name, phone });
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

    // fetch orders to current user
    async fetchOrders({ commit, dispatch, rootState }) {
      dispatch('shared/increaseLoading', null, { root: true });
      dispatch('shared/clearError', null, { root: true });

      const resultOrders = [];

      try {
        const firebaseValue = await firebase
          .database()
          .ref(`/users/${rootState['user'].currentUser.id}/orders`)
          .once('value');

        const orders = firebaseValue.val();

        if (!orders) {
          dispatch('shared/decreaseLoading', null, { root: true });
          return;
        }

        Object.keys(orders).forEach((key) => {
          const order = orders[key];
          resultOrders.push(
            new Order({
              adId: order.adId,
              done: order.done,
              id: key,
              name: order.name,
              phone: order.phone,
            })
          );
        });

        commit('setOrders', resultOrders);
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error, { root: true });
        throw error;
      }
    },

    // mark to the done order
    async markOrderDone({ dispatch, rootState }, payload) {
      try {
        await firebase
          .database()
          .ref(`users/${rootState['user'].currentUser.id}/orders`)
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
    // return filtered array by done orders
    doneOrders(state) {
      return state.orders.filter((order) => order.done);
    },

    // return filtered array by all orders + sort (done + undone orders)
    orders(state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders);
    },

    // return filtered array by undone orders
    undoneOrders(state) {
      return state.orders.filter((order) => !order.done);
    },
  },
};
