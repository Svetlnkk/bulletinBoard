import Vue from 'vue';
import Vuex from 'vuex';
import ads from './modules/ads';
import orders from './modules/orders';
import shared from './modules/shared';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ads,
    orders,
    shared,
    user,
  },
});
