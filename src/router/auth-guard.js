// import store from '../store'
import * as firebase from 'firebase'

export default async function (to, from, next) {
    if (firebase.auth().currentUser) {
        next()
    } else {
        next('/login?loginError=true')
    }
}