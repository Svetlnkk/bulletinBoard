import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import AdModalBuyComponent from "@/components/shared/AdModalBuy";
import * as firebase from 'firebase';

Vue.config.productionTip = false;
Vue.component("app-ad-modal-buy", AdModalBuyComponent);

firebase.initializeApp( {
  apiKey: "AIzaSyAEbYKxQixKK_wiISacEj3Tpj6VM-8dzRE",
  authDomain: "bulletionboard.firebaseapp.com",
  databaseURL: 'https://bulletionboard-default-rtdb.firebaseio.com/',
  projectId: "bulletionboard",
  storageBucket: "bulletionboard.appspot.com",
  messagingSenderId: "1013696856564",
  appId: "1:1013696856564:web:4339e98f771f30ba3539a1",
  measurementId: "G-RMQY927XTF",
});
let application;

firebase.auth().onAuthStateChanged((user) => {
  if (!application) {
    application = new Vue({
      router,
      store,
      vuetify,
      created() {
        if (user) {
          this.$store.dispatch('user/autoLoginUser', user);
          this.$store.dispatch('user/fetchCurrentUser', user);
        }
        this.$store.dispatch('user/fetchAllUsers');
        this.$store.dispatch('ads/fetchAds');
      },
      render: (h) => h(App),
    }).$mount('#app');
  }
});
