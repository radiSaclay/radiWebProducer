<template>
  <div id="app">
    <img src="./assets/logoRadiSaclay.png" width="150">
    <welcome></welcome>
    <login></login>
  </div>
</template>

<script>
import Welcome from './components/Welcome'
import Login from './components/Login'

export default {
  name: 'app',
  components: {
    Welcome,
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
