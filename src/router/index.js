import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthGuard from './auth-guard';
import Home from '@/components/Home';
import Ad from '@/components/ads/Ad';
import AdList from '@/components/ads/AdList';
import AdNew from '@/components/ads/AdNew';
import Login from '@/components/authentification/Login';
import Registration from '@/components/authentification/Registration';
import UserOrders from '@/components/user/UserOrders';
import UserAccount from '@/components/user/UserAccount';
import PageNotFound from '@/components/common/404';

Vue.use(VueRouter);

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
      name: 'AdList',
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
      name: 'Login',
      component: Login,
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/orders',
      name: 'UserOrders',
      component: UserOrders,
      beforeEnter: AuthGuard,
    },
    {
      path: '/account',
      name: 'UserAccount',
      component: UserAccount,
      beforeEnter: AuthGuard,
    },
    { path: '*', component: PageNotFound },
  ],
  mode: 'history',
  base: process.env.BASE_URL,
});

export default router;
