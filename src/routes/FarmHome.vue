<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="farmhome">
    <div class = "nameline">
    <input  :disabled="!editingName" v-model="name" placeholder="">
    <button v-on:click="editName">{{editingName ? "Done" : "Edit"}}</button>
    </div>
    <div class = "addressline">
    <input  :disabled="!editingAddress" v-model="address" placeholder="">
    <button v-on:click="editAddress">{{editingAddress ? "Done" : "Edit"}}</button>
    </div>
  </div>

</template>



<script>
  export default {
    data () {
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/1').then(function successCallback (response) {
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
      return {
        name: '',
        address: '',
        email: '',
        phone: '',
        show: false,
        editingName: false,
        editingAddress: false
      }
    },
    methods: {
      editName: function () {
        this.editingName = !this.editingName
      },
      editAddress: function () {
        this.editingAddress = !this.editingAddress
      }
    }
  }
</script>



<style scoped>
  .farmhome input {
    display: inline-block;
  }
</style>
