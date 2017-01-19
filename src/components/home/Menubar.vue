<template>
  <div class="ui fixed inverted menu">
    <div class="ui container"> <!-- = centered -->

      <router-link to="/home" class="item">Voir mes annonces</router-link>
      <router-link to="/send-notif" class="item">Poster une annonce</router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: 'menubar'
}
</script>
