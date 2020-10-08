import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import * as fireBase from 'firebase'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	created: function () {
		const firebaseConfig = {
			apiKey: 'AIzaSyAnI2BvSkYCUJZJmN3GrUwJal8yjuj0jqs',
			authDomain: 'itc-ads-33610.firebaseapp.com',
			databaseURL: 'https://itc-ads-33610.firebaseio.com',
			projectId: 'itc-ads-33610',
			storageBucket: 'itc-ads-33610.appspot.com',
			messagingSenderId: '979161199578',
			appId: '1:979161199578:web:abf087309e3b3a264e06e3'
			};

			fireBase.initializeApp(firebaseConfig)

			fireBase.auth().onAuthStateChanged( user => {
				if (user) {
					this.$store.dispatch('autoLoginUser', user)
				}
			})
	},
	render: h => h(App),
}).$mount('#app')
