<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-2 mr-0" href="#">Company name</a>
      <input class="form-control form-control-dark w-100"
        type="text" placeholder="Search" aria-label="Search">
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a v-if="isLogin" class="nav-link" href="#" @click.prevent="signout">Sign out</a>
          <router-link v-else to="/login" class="nav-link">Login</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    }
  },
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      this.$http.post(api).then((res) => {
        if (res.data.success) {
          vm.$router.push('/login');
        }
      });
    },
  },
  created() {
    const api = `${process.env.APIPATH}/api/user/check`;
    this.$http.post(api).then((res)=>{
      if (res.data.success) {
        this.isLogin = true;
      // 尚未登入，轉跳到登入頁面
      } else {
        this.isLogin = false
      };
    });
  }
}
</script>