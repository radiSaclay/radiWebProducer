<template>
  <div class="login">
    <input type="text" name="email" placeholder="adresse e-mail" v-model="userInput.email">
    <input type="password" name="password" placeholder="mot de passe" v-model="userInput.pw">
    <button v-on:click="checkUser">{{ buttonText }}</button>
    <br>
    <button v-on:click="sendPassword">mot de passe oublié ?</button>
    <p v-if="!connected && attempted"> identifiants incorrects</p>
    <p v-if="showLoginDetails">identifiants de test --- email: {{ dataBaseSimulation[0].email }} mdp: {{ dataBaseSimulation[0].pw }}<p>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        attempted: false,
        connected: false,
        // TODO replace by request to reset password
        showLoginDetails: false,
        buttonText: 'Se connecter',
        userInput: {
          email: '',
          pw: ''
        },

        // TODO use the remote database
        dataBaseSimulation: [
          {email: 'radisaclay@ensta.fr', pw: 'radis'},
          {email: 'a', pw: ''}
        ]
      }
    },
    methods: {
      // TODO replace by query to database
      checkUser: function () {
        this.attempted = true // tells if the user as already attempted to connect
        var emailInput = this.userInput.email
        var pwInput = this.userInput.pw
        var filtered = this.dataBaseSimulation.filter(function (e) { return (e.email === emailInput && e.pw === pwInput) })
        // if login details are valid then go to user home
        if (filtered.length === 1) {
          this.connected = true
          this.$router.push('/home')
        }
      },
      // TODO replace by a method that resets the password
      sendPassword: function () {
        this.showLoginDetails = true
      }
    }
  }
</script>
