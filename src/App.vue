<template>
  <div id="app">
    <Room/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Room from './components/room/index.vue'

export default {
  name: 'app',
  components: {
    HelloWorld, Room
  }
}
</script>

<style>
html, body{
	margin: 0;
	padding: 0;
	font-size: 12px;
}
</style>
