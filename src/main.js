import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import { LoopingRhombusesSpinner } from 'epic-spinners';
import Pagination from '@/components/Pagination';
import VeeValidate from 'vee-validate';
import zhTW_Validate from 'vee-validate/dist/locale/zh_TW'
import Datepicker from 'vuejs-datepicker';

import App from './App';
import router from './router';
import store from './store';
import './bus';
import currencyFilter from './filters/currency';
import dateFormat from './filters/dateFormat';
import timeFormat from './filters/timeFormat';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueAxios, axios);
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zhTW_Validate);

Vue.filter('currency', currencyFilter);
Vue.filter('dateFormat', dateFormat);
Vue.filter('timeFormat', timeFormat);
Vue.component('LoopingRhombusesSpinner', LoopingRhombusesSpinner); //全域組件
Vue.component('Pagination', Pagination); //全域組件
Vue.component('Datepicker', Datepicker);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

// 轉跳首頁驗證機制
router.beforeEach((to, from, next) => {

  // 如果從別頁轉跳到首頁,則需驗證
  if (to.meta.requiresAuth) {
		const api = `${process.env.APIPATH}/api/user/check`;
    const vm = this;

    // 呼叫檢查API, 確認是否已登入
    axios.post(api).then((res)=>{
      // 如果已經登入，放行轉跳
      if (res.data.success) {
        next();
      // 尚未登入，轉跳到登入頁面
      } else {
        next({
          path: '/login',
        });
      };
    });

  // 不需驗證，直接轉跳
  } else {
    next();
  }

})