<template>
  <div class="home">
    <h1>Liste des notifications postées :</h1>
    <router-link to="/send-notif">Poster une annonce</router-link>
    <notiflist></notiflist>
  </div>
</template>

<script>
import Notiflist from './home/Notiflist'
export default {
  name: 'home',
  components: {
    Notiflist
  }
}
</script>
