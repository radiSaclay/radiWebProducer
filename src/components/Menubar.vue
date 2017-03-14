<template>
  <div class="ui olive top fixed inverted menu">
    <div class="ui container">
      <router-link to="/farmhome" class="item" v-bind:class="this.isActive('/farmhome')" v-if="user.authenticated && !user.isAdmin">Ma Ferme</router-link>
      <router-link to="/eventhome" class="item" v-bind:class="this.isActive('/eventhome')" v-if="user.authenticated && !user.isAdmin">Mes événements</router-link>
      <a v-on:click='logout' class="item" v-if="user.authenticated">Se déconnecter</a>
      <router-link to="/" class="item" v-if="!user.authenticated">Connexion Producteur</router-link>
      <router-link to="/adminlogin" class="right item" v-if="!user.authenticated || user.isAdmin">Centre d'administration</router-link>
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
    },
    isActive(path) {
      if (this.$route.fullPath == path) {
        return "header";
      }
    }
  }
}
</script>
