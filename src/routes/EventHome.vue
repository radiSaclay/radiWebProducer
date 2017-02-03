<template>
  <div class="eventhome">
    <div>
      <input  :disabled="!editingTitle" v-model="title" placeholder="">
      <button v-on:click="editTitle">{{editingTitle ? "Done" : "Edit"}}</button>
    </div>
    <div>
      <input  :disabled="!editingAddress" v-model="address" placeholder="">
      <button v-on:click="editAddress">{{editingAddress ? "Done" : "Edit"}}</button>
    </div>
    <div>
      <input  :disabled="!editingEmail" v-model="email" placeholder="">
      <button v-on:click="editEmail">{{editingEmail ? "Done" : "Edit"}}</button>
    </div>
    <div>
      <input  :disabled="!editingPhone" v-model="phone" placeholder="">
      <button v-on:click="editPhone">{{editingPhone ? "Done" : "Edit"}}</button>
    </div>
  </div>

</template>



<script>
  let farmid
  let events
  export default {
    /* global localStorage:true */
    data () {
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
        farmid = response.body['farm']['id']
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farmId=' + farmid).then(function successCallback (response) {
          // this callback will be called asynchronously
          // when the response is available
          this.title = response.body[0]['title']
//          this.address = response.body['address']
//          this.email = response.body['email']
//          this.phone = response.body['phone']
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response)
        })
      })
      return {
        title: '',
        address: '',
        email: '',
        phone: '',
        show: false,
        editingTitle: false,
        editingAddress: false,
        editingEmail: false,
        editingPhone: false
      }
    },
    methods: {
      editTitle: function () {
        if (this.editingTitle) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "name": this.title
            }
          })
        }
        this.editingTitle = !this.editingTitle
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
  .eventhome input {
    display: inline-block;
  }
</style>
