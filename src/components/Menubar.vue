
<template>
  <div class="ui primary top fixed inverted menu">
    <div class="ui container">
      <router-link to="/farmhome" class="item" v-if="user.authenticated">Ma Ferme</router-link>
      <router-link to="/home" class="item" v-if="user.authenticated">Voir mes annonces</router-link>
      <router-link to="/send-notif" class="item" v-if="user.authenticated">Poster une annonce</router-link>
      <a v-on:click='logout' class="item" v-if="user.authenticated">Se déconnecter</a>
      <router-link to="/" class="item" v-if="!user.authenticated">Se connecter</router-link>
    </div>
  </div>
</template>

<script>
import auth from '../Auth'

export default {
  name: 'menubar',
  data () {
    return {
      user: auth.user
    }
  },
  methods: {
    logout () {
      auth.logout(this, '/')
    }
  }
}
</script>
