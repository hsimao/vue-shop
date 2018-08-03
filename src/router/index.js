import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/pages/Login';
import Products from '@/components/pages/Products';
import Orders from '@/components/pages/Orders';
import CustomerOrder from '@/components/pages/CustomerOrder';
import Coupons from '@/components/pages/Coupons';
import CustomerCheckout from '@/components/pages/CustomerCheckout';

Vue.use(Router);

export default new Router({
  routes: [
    // 如果輸入的網址是沒有定義的路由，則導到login頁面
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children:[{
        path: 'products',
        name: 'Products',
        component: Products,
        meta: { requiresAuth: true },
      },{
        path: 'orders',
        name: 'Orders',
        component: Orders,
        meta: { requiresAuth: true },
      },{
        path: 'coupons',
        name: 'Coupons',
        component: Coupons,
        meta: { requiresAuth: true },
      },
    ]
    },
    {
      path: '/',
      component: Dashboard,
      children:[{
        path: 'customer_order',
        name: 'CustomerOrder',
        component: CustomerOrder,
      },{
        path: 'checkout/:orderId',
        name: 'CustomerCheckout',
        component: CustomerCheckout,
      },]
    },
  ],
});
