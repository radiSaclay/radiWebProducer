<template>
  <div class="ui three column centered grid">
    <div class="column">
      <div class="ui equal width form">

        <div class="field">
          <label>Nom de la ferme</label>
          <div class="ui input">
            <input :disabled="!editingName" v-model="name" placeholder="">
            <button class="ui primary button" v-on:click="editName">{{editingName ? "Done" : "Edit"}}</button>
          </div>
        </div>

        <div class="field">
          <label>Description</label>
          <div class="ui input">
            <textarea rows="2" :disabled="!editingAddress" v-model="address" placeholder=""></textarea>
            <button class="ui primary button" v-on:click="editAddress">{{editingAddress ? "Done" : "Edit"}}</button>
          </div>
        </div>

        <div class="field">
          <label>Adresse email</label>
          <div class="ui input">
            <input :disabled="!editingEmail" v-model="email" placeholder="">
            <button class="ui primary button" v-on:click="editEmail">{{editingEmail ? "Done" : "Edit"}}</button>
          </div>
        </div>

        <div class="field">
          <label>Numéro de téléphone</label>
          <div class="ui input">
            <input :disabled="!editingPhone" v-model="phone" placeholder="">
            <button class="ui primary button" v-on:click="editPhone">{{editingPhone ? "Done" : "Edit"}}</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>



<script>
  let farmid
  export default {
    /* global localStorage:true */
    data () {
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
        farmid = response.body['farm']['id']
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid).then(function successCallback (response) {
          // this callback will be called asynchronously
          // when the response is available
          this.name = response.body['name']
          this.address = response.body['address']
          this.email = response.body['email']
          this.phone = response.body['phone']
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response)
        })
      })
      return {
        name: '',
        address: '',
        email: '',
        phone: '',
        show: false,
        editingName: false,
        editingAddress: false,
        editingEmail: false,
        editingPhone: false
      }
    },
    methods: {
      editName: function () {
        if (this.editingName) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "name": this.name
            }
          })
        }
        this.editingName = !this.editingName
      },
      editAddress: function () {
        if (this.editingAddress) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "address": this.address
            }
          })
        }
        this.editingAddress = !this.editingAddress
      },
      editEmail: function () {
        if (this.editingEmail) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "email": this.email
            }
          })
        }
        this.editingEmail = !this.editingEmail
      },
      editPhone: function () {
        if (this.editingPhone) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "phone": this.phone
            }
          })
        }
        this.editingPhone = !this.editingPhone
      }
    }
  }
</script>



<style scoped>
  .farmhome input {
    display: inline-block;
  }
</style>
