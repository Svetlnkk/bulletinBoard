import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/Home'
import Ad from '@/components/ads/ad'
import AdList from '@/components/ads/AdList'
import AdNew from '@/components/ads/AdNew'
import Login from '@/components/authentification/Login'
import Registration from '@/components/authentification/Registration'
import UserOrders from '@/components/user/UserOrders'
import UserAccount from '@/components/user/UserAccount'
import PageNotFound from '@/components/common/404'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '',
      name: 'Home',
      component: Home,
    },
    {
      props: true,
      path: '/ad/:id',
      name: 'ad',
      component: Ad,
    },
    {
      path: '/list',
      name: 'list',
      component: AdList,
      beforeEnter: AuthGuard,
    },
    {
      path: '/new',
      name: 'AdNew',
      component: AdNew,
      beforeEnter: AuthGuard,
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/UserOrders',
      name: 'UserOrders',
      component: UserOrders,
      beforeEnter: AuthGuard,
    },
    {
      path: '/UserAccount',
      name: 'UserAccount',
      component: UserAccount,
      beforeEnter: AuthGuard,
    },
    { path: "*",
      component: PageNotFound,
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL,
})

export default router