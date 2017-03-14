<template>
  <div v-if="farm" class="ui two column centered grid">
    <div class="column">
      <div class="ui equal width form">

        <div class="field">
          <label>Nom de la ferme</label>
          <div class="ui input">
            <input :disabled="!farm.being_edited" v-model="farm.name" placeholder="Nom">
          </div>
        </div>

<!--TODO : add a description field (this one should be the address)-->
        <div class="field">
          <label>Description</label>
          <div class="ui input">
            <input  :disabled="!farm.being_edited" v-model="farm.address" placeholder="Description">
          </div>
        </div>

        <div class="field">
          <label>Adresse email</label>
          <div class="ui input">
            <input  :disabled="!farm.being_edited" v-model="farm.email" placeholder="Email">
          </div>
        </div>

        <div class="field">
          <label>Numéro de téléphone</label>
          <div class="ui input">
            <input  :disabled="!farm.being_edited" v-model="farm.phone" placeholder="Téléphone">
          </div>
        </div>

        <div class="field">
          <label>Site internet</label>
          <div class="ui input">
            <input  :disabled="!farm.being_edited" v-model="farm.website" placeholder="Site internet">
          </div>
        </div>

        <div class="field">
          <label> Produits </label>
          <!-- For each product of this event... -->
          <div class="ui grid" style="margin-top:0px">
            <div v-for="(farm_product, farm_prod_index) in farm.products">
              <!-- Create a dropdown menu with value linked to the current product of the farm -->
              <dropdown :suggestions="all_products" :selection.sync="farm.products[farm_prod_index].name"
                        :isDisabled="!farm.being_edited" :product_index="farm_prod_index" :event_index="-1">
              </dropdown>
            </div>
            <button class="ui icon primary button" v-if="farm.being_edited" v-on:click="addProduct(farm_prod_index)">
              <i class="add icon"></i>
            </button>
          </div>
        </div>

        <br>
        <div class="ui center aligned basic segment">
          <button class="ui primary button" v-on:click="editFarmInfo">{{farm.being_edited ? "Enregistrer" : "Editer les informations de la ferme"}}</button>
        </div>

      </div>
    </div>
  </div>
</template>



<script>
  import * as api from '../api/general'
  import settings from '../config/settings'
  import Dropdown from '../components/Dropdown'
  let farm_id, farm, all_products

  export default {
    /* global localStorage:true */
    data () {
      // get user info
      this.$http.get(settings.urls.USER_INFO_URL, {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (user_info) {
        // save farm id
        farm_id = user_info.body['farm']['id']
        // get products
        this.$http.get(settings.urls.GET_PRODUCT_URL).then(function successCallback (products_info) {
          console.log(products_info)
          this.all_products = products_info.body
          this.$http.get(settings.urls.FARMS_URL + farm_id).then(function successCallback (farm_info) {
            // this callback will be called asynchronously
            // when the response is available
            this.farm = farm_info.body
            // Needs to be declare like this to be reactive
            this.$set(this.farm, 'being_edited', false)
            console.log(this.all_products)
            api.convertProdToFullProducts(this.farm, this.all_products)
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

    components: {
      Dropdown
    },

    methods: {
      editFarmInfo: function () {
        if (this.farm.being_edited) {
          this.$http({url: settings.urls.FARMS_URL + farm_id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "name": this.farm.name,
              "website": this.farm.website,
              "address": this.farm.address,
              "phone": this.farm.phone,
              "email": this.farm.email,
              "products": api.getProductsID(this.farm.products)
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
      },
      editProduct: function (event_index,farm_prod_index,new_product) {
        this.farm.products[farm_prod_index] = new_product;
      },
    }
  }

</script>
