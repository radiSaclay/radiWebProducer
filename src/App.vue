<template>
  <div id="app">
    <img src="./assets/logoRadiSaclay.png" width="150">
    <hello></hello>
    <login></login>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Login from './components/Login'

export default {
  name: 'app',
  components: {
    Hello,
    Login
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
