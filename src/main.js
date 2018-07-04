import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';

import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  el: '#app',
  router,
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