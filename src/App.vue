<template>
	<div id="app">
    <div class="loading center" v-if="isLoading">
      <looping-rhombuses-spinner
        :animation-duration="2000"
        :size="80"
        color="#7971ea"
      />
    </div>
    <Alert/>
    <router-view/>
	</div>
</template>

<script>
import Alert from '@/components/AlertMessage';
export default {
  name: 'App',
  components: {
    Alert,
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    }
  }
};
</script>

<style lang="sass">
@import "./assets/all.sass"
.loading
  z-index: 100
.loading.center
  position: fixed
  top: 200px
  left: 50%
  transform: translateX(-50%)

.loading.inline
  display: inline-block
  vertical-align: middle
  margin-top: -3px

.router-link-active
  color: #7971ea !important
</style>
