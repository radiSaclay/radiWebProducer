<script>
  import Menubar from './components/Menubar'
  export default {
    name: 'App',
    components: {
      Menubar
    }
  }
</script>

<template>
  <div id="app">
    <menubar></menubar>
    <img src="./assets/logoRadiSaclayBlanc.png" width="100">
    <router-view></router-view>
  </div>
</template>


