<template>
  <div class="home">
    <h1>Liste des notifications postées :</h1>
    <notiflist></notiflist>
  </div>
</template>

<script>
import Notiflist from '../components/Notiflist'
export default {
  name: 'home',
  components: {
    Notiflist
  }
}
</script>
