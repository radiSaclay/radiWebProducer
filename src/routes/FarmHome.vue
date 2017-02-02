<template>
  <div class="farmhome">
    <h2>{{ name }}</h2>
    <h2>Address: {{ address }}</h2>
    <h2>Email: {{ email }}</h2>
    <h2>Phone: {{ phone }}</h2>
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
        phone: ''
      }
    }

  }
</script>



