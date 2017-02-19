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
    <div>
      <h3> Produits </h3>
      <button v-if="!farm.being_edited" v-on:click="addProduct(farm_prod_index)">+</button>
      <!-- For each product of this event... -->
      <div v-for="(farm_product, farm_prod_index) in farm.products">
        <!-- Create a dropdown menu with value linked to the current product of the farm -->
        <select v-model="farm.products[farm_prod_index]"  :disabled="!farm.being_edited" >
          <!-- Populate the options of this dropdown menu to be all available products -->
          <option v-for="product in all_products" v-bind:value="product">
            {{product.name}}
          </option>
        </select>
        <button v-if="farm.being_edited" v-on:click="removeProduct(farm_prod_index)">-</button>
      </div>
    </div>
    <button v-on:click="editFarmInfo">{{farm.being_edited ? "Enregistrer" : "Editer"}}</button>
  </div>

</template>



<script>

  // gets an array of products and returns an array of IDs of the products
  function getProductsID(products){
    let productsID = []
    products.forEach(function (product){
      productsID.push(product.id)
    });
    return productsID
  }


  // replaces the products from the farm by more complete objects from the global list of products
  function convertFarmProdToFullProducts(farm, all_products){
    farm.products.forEach(function (product, index, array){
      for (let i = 0; i < all_products.length; i++){
        if (all_products[i].id == product.id){
          array[index] = all_products[i]
        }
      }
    })
  }

  let farm_id, farm, all_products
  export default {
    /* global localStorage:true */
    data () {
      // get user info
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (user_info) {
        // save farm id
        farm_id = user_info.body['farm']['id']
        // get products
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/products/').then(function successCallback (products_info) {
          console.log(products_info)
          this.all_products = products_info.body

          this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farm_id).then(function successCallback (farm_info) {
            // this callback will be called asynchronously
            // when the response is available
            this.farm = farm_info.body
            // Needs to be declare like this to be reactive
            this.$set(this.farm, 'being_edited', false)
            console.log(this.all_products)
            convertFarmProdToFullProducts(this.farm, this.all_products)
          }, function errorCallback (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response)
          })


        },function (error_getting_prod) {
          console.log("Error getting product list")
          console.log(error_getting_prod)
        })
      })
      return {
        farm,
        all_products
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
              "email": this.farm.email,
              "products": getProductsID(this.farm.products)
            }
          })
        }
        this.farm.being_edited = !this.farm.being_edited
      },
      addProduct: function (event_index) {
        // Add the first product of the farm to the event
        this.farm.products.push(this.all_products[0])
      },
      removeProduct: function (farm_prod_index) {
        // Removing product with index "farm_prod_index" from farm
        this.farm.products.splice(farm_prod_index,1)
      }
    }
  }
</script>



