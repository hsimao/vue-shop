<template>
	<div id="app">
			<router-view/>
		</div>
</template>

<script>
export default {
	name: 'App',
};
</script>

<style lang="sass">
@import "./assets/all.sass"

.loading.center
  position: absolute
  top: 30vh
  left: 50%
  transform: translate(-50%, -50%)

.loading.inline
  display: inline-block
  vertical-align: middle
</style>
