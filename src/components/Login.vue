<template>
  <div class="login">
    <input type="text" name="email" placeholder="adresse e-mail" v-model="userInput.email">
    <input type="password" name="password" placeholder="mot de passe" v-model="userInput.pw">
    <button v-model="message" v-on:click="checkUser">{{ message }}</button>
    <p v-if="connected"> connexion réussie </p>
    <p v-if="!connected && attempted"> identifiants incorrects</p>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        // TODO replace by request to database
        dataBaseSimulation: [
          {email: 'radisaclay@ensta.fr', pw: 'radis'}
        ],
        message: 'Se connecter',
        connected: false,
        attempted: false,
        userInput: {
          email: '',
          pw: ''
        }
      }
    },
    methods: {
      checkUser: function () {
        this.attempted = true
        var emailInput = this.userInput.email
        var pwInput = this.userInput.pw
        var filtered = this.dataBaseSimulation.filter(function (e) { return (e.email === emailInput && e.pw === pwInput) })
        if (filtered.length === 1) {
          this.connected = true
        }
      }
    }
  }
</script>
