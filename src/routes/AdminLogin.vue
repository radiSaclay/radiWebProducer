<template>
  <div class="ui center aligned one column grid">
    <div class="column">
      <h2 class="ui icon header">
        <div class="content">
          Connexion au centre d'administration
          <div class="sub header">Page réservée à l'administration du site.</div>
          <div class="sub header">Pour accéder à votre espace producteur</div>
          <div class="sub header">cliquer sur <router-link to="/">Connexion Producteur</router-link>.</div>
        </div>
      </h2>
      <br>
      <br>
      <div class="ui left icon input">
        <input type="text" name="email" placeholder="identifiant administrateur" v-model="credentials.email">
        <i class="user icon"></i>
      </div>
      <br>
      <br>
      <div class="ui left icon input">
        <input type="password" name="password" placeholder="mot de passe" v-model="credentials.password">
        <i class="lock icon"></i>
      </div>
      <br>
      <br>
      <button class="ui primary button" tabindex="0" v-on:click="submit">Connexion</button>
      <br>
      <div class="ui error compact message" v-if="attempted"> identifiants incorrects</div>
      <br>
      <div class="ui inverted primary basic button" v-on:click="sendPassword">
        <div class="header">mot de passe oublié ?</div>
      </div>
      <br>
      <br>

    </div>
  </div>
</template>

<script>
  import auth from '../Auth'
  import settings from '../config/settings'

  export default {
    name: 'login',
    data () {
      return {
        attempted: false,
        authenticated: false,
        credentials: {
          email: '',
          password: ''
        },
      }
    },
    methods: {
      submit: function () {
        auth.adminLogin(this, this.credentials, settings.urls.ADMINHOMEPAGE)
        this.attempted = true // tells if the user has already attempted to connect
      },
      // TODO implement a function to reset the admin password
      sendPassword: function () {
      }
    }
  }
</script>

