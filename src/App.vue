<template>
	<div id="app">
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
  }
};
</script>

<style lang="sass">
@import "./assets/all.sass"
.loading
  z-index: 100
.loading.center
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

.loading.center-l
  position: absolute
  left: 50%
  transform: translateX(-50%)

.loading.inline
  display: inline-block
  vertical-align: middle
  margin-top: -3px

.router-link-active
  color: #7971ea !important
</style>
