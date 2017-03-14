<template>
  <div class="ui center aligned one column grid">
    <div class="column">
      <br>
      <div class="ui left icon input">
        <input type="text" name="email" placeholder="adresse e-mail" v-model="credentials.email">
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
      <br>
      <div class="ui error compact message" v-if="attempted"> identifiants incorrects</div>
      <br>
      <div class="ui inverted primary basic button" v-on:click="sendPassword">
        <div class="header">mot de passe oublié ?</div>
      </div>
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
        console.log
        auth.userLogin(this, this.credentials, settings.urls.HOMEPAGE)
        this.attempted = true // tells if the user has already attempted to connect
      },
      // TODO replace by a method that resets the password
      sendPassword: function () {
      }
    }
  }
</script>
