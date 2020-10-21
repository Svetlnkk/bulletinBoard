import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/home'
import Ad from '@/components/ads/ad'
import AdList from '@/components/ads/adList'
import AdNew from '@/components/ads/AdNew'
import Login from '@/components/authentification/login'
import Registration from '@/components/authentification/registration'
import Orders from '@/components/user/orders'
import UserAccount from '@/components/user/UserAccount'
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
      name: 'AdNew',
      component: AdNew,
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