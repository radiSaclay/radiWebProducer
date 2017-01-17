<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <router-link to="/send-notif">Poster une annonce</router-link>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        msg: 'Page perso'
      }
    }
  }
</script>
