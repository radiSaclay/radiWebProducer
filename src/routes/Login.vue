<template>
  <div class="login">
    <input type="text" name="email" placeholder="adresse e-mail" v-model="credentials.email">
    <input type="password" name="password" placeholder="mot de passe" v-model="credentials.password">
    <button v-on:click="submit">Connexion</button>
    <br>
    <button v-on:click="sendPassword">mot de passe oublié ?</button>
    <p v-if="attempted"> identifiants incorrects</p>
    <p v-if="showLoginDetails">identifiants de test {{ loginDetails }}<p>
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
