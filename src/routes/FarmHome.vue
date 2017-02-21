<template>
  <div v-if="farm" class="farmhome">
    <h1>Ma Ferme</h1>
    <div>
      <input :disabled="!farm.being_edited" v-model="farm.name" placeholder="Nom">
    </div>
    <div>
      <input  :disabled="!farm.being_edited" v-model="farm.address" placeholder="Adresse">
    </div>
    <div>
      <input  :disabled="!farm.being_edited" v-model="farm.email" placeholder="Email">
    </div>
    <div>
      <input  :disabled="!farm.being_edited" v-model="farm.phone" placeholder="Phone">
    </div>
    <div>
      <input  :disabled="!farm.being_edited" v-model="farm.website" placeholder="Website">
    </div>
    <button v-on:click="editFarmInfo">{{farm.being_edited ? "Enregistrer" : "Editer"}}</button>
  </div>
</template>



<script>
  let farm_id, farm
  export default {
    /* global localStorage:true */
    data () {
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
        farm_id = response.body['farm']['id']
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farm_id).then(function successCallback (response) {
          // this callback will be called asynchronously
          // when the response is available
          this.farm = response.body
          // Needs to be declare like this to be reactive
          this.$set(this.farm, 'being_edited', false)
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response)
        })
      })
      return {
        farm
      }
    },
    methods: {
      editFarmInfo: function () {
        if (this.farm.being_edited) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farm_id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "name": this.farm.name,
              "website": this.farm.website,
              "address": this.farm.address,
              "phone": this.farm.phone,
              "email": this.farm.email
            }
          })
        }
        this.farm.being_edited = !this.farm.being_edited
      }
    }
  }
</script>



