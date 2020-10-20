import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import BuyModalComponent from '@/components/shared/buyModal'
import * as firebase from 'firebase'

Vue.config.productionTip = false;
Vue.component('app-buy-modal', BuyModalComponent)

firebase.initializeApp({
	apiKey: 'AIzaSyAnI2BvSkYCUJZJmN3GrUwJal8yjuj0jqs',
	authDomain: 'itc-ads-33610.firebaseapp.com',
	databaseURL: 'https://itc-ads-33610.firebaseio.com',
	projectId: 'itc-ads-33610',
	storageBucket: 'itc-ads-33610.appspot.com',
	messagingSenderId: '979161199578',
	appId: '1:979161199578:web:abf087309e3b3a264e06e3'
})

let application

firebase.auth().onAuthStateChanged( (user) => {
	if (!application) {
		application = new Vue({
			router,
			store,
			vuetify,
			created() {
				if (user) {
					this.$store.dispatch('autoLoginUser', user)
					this.$store.dispatch('fetchUser')
				}
				this.$store.dispatch('fetchUsers')
				this.$store.dispatch('fetchAds')
			},
			render: h => h(App),
		}).$mount('#app')
	}
})


