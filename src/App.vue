<template>
  <div id="app">

    <!-- TODO: hide the menu bar when in the login page -->
    <menubar></menubar>

    <img src="./assets/logoRadiSaclay.png" width="150">
    <router-view></router-view>

  </div>
</template>

<script>
import Menubar from './components/home/Menubar'
export default {
  name: 'app',
  components: {
    Menubar
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
