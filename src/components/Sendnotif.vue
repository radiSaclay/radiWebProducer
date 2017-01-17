<template>
  <div class="send-notif">
    <h1>{{ msg }}</h1>
    <router-link to="/home">Voir mes annonces</router-link>
  </div>
</template>

<script>
  export default {
    name: 'send-notif',
    data () {
      return {
        msg: 'Envoyer une notification'
      }
    }
  }
</script>
