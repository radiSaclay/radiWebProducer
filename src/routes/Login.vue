<template>
  <div class="login">
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
    <button class="ui black button" tabindex="0" v-on:click="submit">Connexion</button>
    <br>
    <br>
    <div class="ui error compact message" v-if="attempted"> identifiants incorrects</div>
    <br>
    <div class="ui inverted blue basic button" v-on:click="sendPassword">
      <div class="header">mot de passe oublié ?</div>
      <div class="message" v-if="showLoginDetails">identifiants de test {{ loginDetails }}</div>
    </div>
  </div>
</template>

<script>
  import auth from '../Auth'

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
        // TODO replace by request to reset password
        showLoginDetails: false,
        loginDetails: {email: 'producer', password: 'radis'}
      }
    },
    methods: {
      submit: function () {
        auth.login(this, this.credentials, '/home')
        this.attempted = true // tells if the user as already attempted to connect
      },
      // TODO replace by a method that resets the password
      sendPassword: function () {
        this.showLoginDetails = true
      }
    }
  }
</script>
