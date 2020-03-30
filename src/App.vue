<template>
  <div id="app">
    <Room/>
  </div>
</template>

<script>
import Room from './components/room/index.vue'

export default {
  name: 'app',
  components: {
    Room
  }
}
</script>

<style>
html, body{
	margin: 0;
	padding: 0;
	font-size: 24px;
}
</style>
