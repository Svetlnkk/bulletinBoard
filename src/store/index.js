import Vue from 'vue';
import Vuex from 'vuex';
import ads from './ads';
import orders from './orders';
import shared from './shared';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ads,
    orders,
    shared,
    user,
  },
});
