<template>
  <div class="eventhome">
    <!-- Button to add new event -->
    <button  v-on:click="addEvent()">+</button>
    <!-- For all events ... -->
    <div v-for="(event, event_index) in events">
      <h1> Event {{event.id}} </h1>
      <div>
        <input :disabled="!event.being_edited" v-model="event.title" placeholder="Title">
      </div>
      <div>
        <input :disabled="!event.being_edited" v-model="event.description" placeholder="Description">
      </div>
      <div>
        <h4>Début</h4>
        <Flatpickr :disabled="!event.being_edited" v-model="event.beginAt" :options="event.fpOptionsBeginDate"></Flatpickr>
      </div>
      <div>
        <h4>Fin</h4>
        <Flatpickr :disabled="!event.being_edited" v-model="event.endAt" :options="event.fpOptionsEndDate"></Flatpickr>
      </div>
      <div>
        <h3> Produits </h3>
        <!-- For each product of this event... -->
        <div v-for="(event_product, index) in event.products">
          <!-- Create a dropdown menu with value linked to the current product of the event -->
          <select v-model="events[event_index].products[index]"  :disabled="!event.being_edited" >
            <!-- Populate the options of this dropdown menu to be all available farm products -->
            <option v-for="product in farm_products" v-bind:value="product">
              {{product.name}}
            </option>
          </select>
          <button v-if="event.being_edited" :id="index" v-on:click="removeProduct(event_index,index)">-</button>
        </div>
      </div>
      <button v-if="event.being_edited" :id="event_index" v-on:click="addProduct(event_index)">+</button>
      <br> </br>
      <button v-on:click="editEvent(event_index)">{{event.being_edited ? "Enregistrer" : "Editer"}}</button>
      <button v-on:click="removeEvent(event_index)">Supprimer</button>
      <br> </br>
    </div>
  </div>
</template>




<script>
  import Vue from 'vue'
  // Moment deals with converting dates between UNIX timestamp and human readable format
  import moment from 'moment'
  import VueFlatpickr from 'vue-flatpickr'
  import 'vue-flatpickr/theme/airbnb.css'
  Vue.use(VueFlatpickr)
  let farm_id, events, farm_products

  // gets an array of products and returns an array of IDs of the products
  function getProductsID(products){
    let productsID = []
    products.forEach(function (product){
      productsID.push(product.id)
    });
    return productsID
  }

  // replaces the products from events by more complete objects from the list of products of the farm
  function convertEventProdToFullProducts(event, all_products){
    event.products.forEach(function (product, index, array){
      for (let i = 0; i < all_products.length; i++){
        if (all_products[i].id == product.id){
          array[index] = all_products[i]
        }
      }
    })
  }

  // Receives a list of events and creates a field for each one with the options used by the DatePicker
  // Also converts the date to human readable format
  function setupDatePickerOption(event){
    event.beginAt = moment(event.beginAt*1000).format('DD/MM/YY HH:mm')
    event.endAt = moment(event.endAt*1000).format('DD/MM/YY HH:mm')
    // It is done on a per event basis to have more flexibility in the future
    // Such as allow the alternative display format (altInput) to decouple internal representation from shown
    // representation. However this breaks the :disable flag in HTML and couldn't yet find a way to disable input
    // using the DatePicker API.
    event.fpOptionsBeginDate = {
      allowInput: false,
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      time_24hr: true
    }
    event.fpOptionsEndDate = {
      allowInput: false,
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      time_24hr: true
    }
  }

  function adaptEvent(event, farm_products){
      convertEventProdToFullProducts(event, farm_products)
      setupDatePickerOption(event)
      event.being_edited = false
  }


  export default {
    /* global localStorage:true */
    data () {
      // get user farm id
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (user_info) {
        // save farm Id
        farm_id = user_info.body['farm']['id']
        // Get products proposed by farm
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farm_id, {
          headers: {
            Authorization: localStorage.getItem('id_token')
          }
        }).then(function successCallback (prod_response) {
          this.farm_products = prod_response.body['products']

          // get events associated with this farm
          this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farm_id=' + farm_id + '&embedded=1').then(function successCallback (farm_events) {
            let received_events = farm_events.body
            let prods = this.farm_products
            received_events.forEach(function (event) {
              adaptEvent(event, prods)
            })
            this.events = received_events.reverse()
          }, function errorCallback (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          })
        })
      })
      return {
        events: [],
        farm_products
      }
    },
    methods: {
      editEvent: function (event_index) {
        if (this.events[event_index].being_edited) {
          if(this.events[event_index].id != null){
            this.$http({
              url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + this.events[event_index].id,
              method: 'PUT',
              headers: {
                'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
              },
              body: {
                "title": this.events[event_index].title,
                "description": this.events[event_index].description,
                "beginAt": moment(this.events[event_index].beginAt, "DD/MM/YY HH:mm").unix(),
                "endAt": moment(this.events[event_index].endAt, "DD/MM/YY HH:mm").unix(),
                "products": getProductsID(this.events[event_index].products)
              }
            }).then(function (success_resp) {
                if(success_resp.status==200){
                  console.log("All good")
                }
              },
              function (error_resp) {
                console.log("Crap")
              })
          }else {
            this.postEvent(event_index)
          }
        }
        // Replaces element in array, splice syntax = (begin, how many to delete, what to insert)
        // Needs to be done like this so Vue can detect changes and update the DOM
        this.events[event_index].being_edited = !this.events[event_index].being_edited
      },
      postEvent: function (event_index) {
        this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/', method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
          }, body: {
            "title": this.events[event_index].title,
            "description": this.events[event_index].description,
            "beginAt": moment(this.events[event_index].beginAt, "DD/MM/YY HH:mm").unix(),
            "endAt": moment(this.events[event_index].endAt, "DD/MM/YY HH:mm").unix(),
            "products": getProductsID(this.events[event_index].products)
          }
        }).then(function (response) {
          console.log(response)
        })
      },
      addProduct: function (event_index) {
        // Add the first product of the farm to the event
        this.events[event_index].products.push(this.farm_products[0])
      },
      removeProduct: function (event_index,index) {
        // Removing product with index "index"
        this.events[event_index].products.splice(index,1)
      },
      addEvent: function () {
        let new_event = {
          title: '',
          beginAt: moment().unix().toString(),
          endAt: (moment().unix() + 60*60*24*7).toString(), // set to to 7 days from now by default
          description: '',
          farm_id: this.farm_id,
          products: []
        }
        adaptEvent(new_event, this.farm_products)
        new_event.being_edited = true
        // push returns the new length of the array
        let new_length = this.events.unshift(new_event)
      },
      removeEvent: function (event_index) {
        // Removing event with index "event_index"
        this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + this.events[event_index].id, method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
          }
        }).then(function (success) {
            this.events.splice(event_index,1)
            console.log(response)
        },
        function (error) {

        })

      }
    }
  }
</script>



