<template>
  <div class="eventhome">
    <button  v-on:click="addEvent()">+</button>
    <div v-for="(event, event_index) in events" :key="event_index">
      <h1> Event {{event.id}} </h1>
      <div>
        <input  :disabled="!editingEvent[event_index]" v-model="event.title" placeholder="">
      </div>
      <div>
        <input  :disabled="!editingEvent[event_index]" v-model="event.description" placeholder="">
      </div>
      <div>
        <h4>Date de Début</h4>
        <Flatpickr :disabled="!editingEvent[event_index]" v-model="event.beginAt" :options="event.fpOptionsBeginDate"></Flatpickr>
      </div>
      <div>
        <h4>Date de fin</h4>
        <Flatpickr :disabled="!editingEvent[event_index]" v-model="event.endAt" :options="event.fpOptionsEndDate"></Flatpickr>
      </div>
      <div>
        <h3> Produits </h3>
        <div v-for="(event_product, index) in event.products">
          <select v-if="event.products[index]" v-model="events[event_index].products[index]"  :disabled="!editingEvent[event_index]" >
            <option v-for="product in farm_products" v-bind:value="product">
              {{product.name}}
            </option>
          </select>
          <button v-if="editingEvent[event_index]"  :id="index" v-on:click="removeProduct(event_index,index)">-</button>
        </div>
      </div>
      <button v-if="editingEvent[event_index]"  :id="event_index" v-on:click="addProduct(event_index)">+</button>
      <br> </br>
      <button :id="event_index" v-on:click="editEvent(event_index)">{{editingEvent[event_index] ? "Save" : "Edit"}}</button>
      <br> </br>
    </div>
  </div>
</template>




<script>
  let farmid, events, editingEvent = {}, farm_products, fpOptionsBeginDate, fpOptionsEndDate
  import Vue from 'vue'
  import moment from 'moment'
  import VueFlatpickr from 'vue-flatpickr'
  import 'vue-flatpickr/theme/airbnb.css'
  Vue.use(VueFlatpickr)

  // gets an array of products and returns an array of IDs
  function getProductsID(products){
    let productsID = new Array()
    products.forEach(function (product){
      productsID.push(product.id)
    });
    return productsID
  }

  // replaces the products from events by more complete objects from the list of products of the farm
  function convertEventProdToFullProducts(event_products, all_products){
    event_products.forEach(function (product, index, array){
      for (let i = 0; i < all_products.length; i++){
        if (all_products[i].id == product.id){
          array[index] = all_products[i]
        }
      }
    })
  }

  // Receives a list of events and returns an array with the begin and end date options used by the FilePicker
  function setupDatePickerOption(event){
      event.beginAt = moment(event.beginAt*1000).format('DD/MM/YY HH:mm')
      event.endAt = moment(event.endAt*1000).format('DD/MM/YY HH:mm')
      event.fpOptionsBeginDate= {
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
        farmid = user_info.body['farm']['id']
        // Get products proposed by farm
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/farms/' + farmid, {
          headers: {
            Authorization: localStorage.getItem('id_token')
          }
        }).then(function successCallback (prod_response) {
          this.farm_products = prod_response.body['products']

          // get events associated with this farm
          this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farmId=' + farmid + '&embedded=1').then(function successCallback (farm_events) {
            let received_events = farm_events.body
            let prods = this.farm_products
            received_events.forEach(function (event) {
              convertEventProdToFullProducts(event.products, prods)
              setupDatePickerOption(event)
            })

            this.events = received_events
          }, function errorCallback (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          })
        })
      })
      return {
        events: [],
        editingTitle: false,
        editingDescription: false,
        editingBeginDate: false,
        editingEvent,
        farm_products
      }
    },
    methods: {
      editEvent: function (event_index) {
        if (this.editingEvent[event_index]) {
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
        this.$set(editingEvent, event_index, !editingEvent[event_index])
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
        // Removing event with index "index"
        this.events[event_index].products.splice(index,1)
      },
      addEvent: function () {
        // Removing event with index "index"
        let new_event = {
            title: '',
            beginAt: moment().unix().toString(),
            endAt: (moment().unix() + 60*60*24*7).toString(), // set to to 7 days from now
            description: '',
            farmId: this.farmId,
            products: []
        }
        setupDatePickerOption(new_event)
        // push returns the new length of the array
        let new_length = this.events.push(new_event)
        this.$set(editingEvent, new_length-1, !editingEvent[new_length-1])
      }
    }
  }
</script>



