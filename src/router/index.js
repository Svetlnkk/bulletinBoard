import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/home'
import Ad from '@/components/ads/ad'
import AdList from '@/components/ads/adList'
import NewAd from '@/components/ads/newAd'
import Login from '@/components/authentification/login'
import Registration from '@/components/authentification/registration'
import Orders from '@/components/user/orders'
import Account from '@/components/user/account'
import PageNotFound from '@/components/common/404'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '',
      name: 'home',
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
      name: 'newAd',
      component: NewAd,
      beforeEnter: AuthGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration,
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      beforeEnter: AuthGuard,
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
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