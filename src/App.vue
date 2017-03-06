<template>
  <div id="app">
    <menubar></menubar>
    <div style="height:4em"></div>
    <img class="ui centered image" src="./assets/logoRadiSaclayBlanc.png" width="100">
    <router-view></router-view>
  </div>
</template>

<script>
import Menubar from './components/Menubar'
export default {
  name: 'app',
  components: {
    Menubar
  }
}
</script>
