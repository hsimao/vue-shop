<template>
	<div>
    <a href="#" @click.prevent="signout">登出</a>
	</div>
</template>

<script>
export default {
	data() {
	return {
	}
  },
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      const vm = this
      this.$http.post(api).then((res) => {
        if (res.data.success) {
          vm.$router.push('/login')
        }
      });
    },
  }
};
</script>

<style lang="sass" scoped>

</style>
