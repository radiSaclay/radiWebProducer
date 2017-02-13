<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="eventhome">
    <div v-for="(event, event_index) in events" :key="event.id">
      <h1> Event {{event.id}} </h1>
      <div>
        <input  :disabled="!editingEvent[event.id]" v-model="event.title" placeholder="">
      </div>
      <div>
        <input  :disabled="!editingEvent[event.id]" v-model="event.description" placeholder="">
      </div>
      <div>
        <h4>Date de Début</h4>
        <Flatpickr :disabled="!editingEvent[event.id]" v-model="event.beginAt" :options="fpOptionsBeginDate[event_index]"></Flatpickr>
      </div>
      <div>
        <h4>Date de fin</h4>
        <Flatpickr :disabled="!editingEvent[event.id]" v-model="event.endAt" :options="fpOptionsEndDate[event_index]"></Flatpickr>
      </div>
      <div>
        <h3> Produits </h3>
        <div v-for="(event_product, index) in event.products">
          <select v-if="event.products[index]" v-model="events[event_index].products[index]"  :disabled="!editingEvent[event.id]" >
            <option v-for="product in products" v-bind:value="product">
              {{product.name}}
            </option>
          </select>
          <button v-if="editingEvent[event.id]"  :id="index" v-on:click="removeProduct(event_index,index)">-</button>
        </div>
      </div>
      <button v-if="editingEvent[event.id]"  :id="event.id" v-on:click="addProduct">+</button>
      <br> </br>
      <button :id="event.id" v-on:click="editEvent">{{editingEvent[event.id] ? "Save" : "Edit"}}</button>
      <br> </br>
    </div>
  </div>
</template>




<script>
  let farmid, events, editingEvent = {}, products, date, fpOptionsBeginDate, fpOptionsEndDate
  import Vue from 'vue'
  import moment from 'moment'
  import VueFlatpickr from 'vue-flatpickr'
  import 'vue-flatpickr/theme/airbnb.css'
  Vue.use(VueFlatpickr)
  function getProductsID(products){
    let productsID = new Array()
    products.forEach(function (product){
      productsID.push(product.id)
    });
    return productsID
  }
  // Gets a list of events as seen by the browser (a list of objects) and returns the index
  // of the event having Server ID EventIDperServer
  function findVueId(event_list, EventIDperServer) {
    let vue_event_id
    for (let event_index=0; event_index < event_list.length; event_index++){
      if(event_list[event_index].id == EventIDperServer){
        vue_event_id = event_index
        return vue_event_id
      }
    }
    return null
  }

  function convertEventProdToFullProducts(event_products, all_products){
    event_products.forEach(function (product, index, array){
      for (let i = 0; i < all_products.length; i++){
        if (all_products[i].id == product.id){
          array[index] = all_products[i]
        }
      }
    })
  }

  function setupDatePickerOption(events){
    let fpOptionsBeginDate = []
    let fpOptionsEndDate = []
    events.forEach(function (event, index, list) {
      fpOptionsBeginDate[index] = {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        defaultDate: event.beginAt*1000
      }
      fpOptionsEndDate[index] = {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        defaultDate: event.endAt*1000
      }
    })
    return [fpOptionsBeginDate, fpOptionsEndDate]
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
          this.products = prod_response.body['products']
          // get events associated with this farm
          this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farmId=' + farmid + '&embedded=1').then(function successCallback (farm_events) {
            let received_events = farm_events.body
            let prods = this.products
            received_events.forEach(function (event) {
              convertEventProdToFullProducts(event.products, prods)
            })
            this.events = received_events
            let options = setupDatePickerOption(received_events)
            this.fpOptionsBeginDate = setupDatePickerOption(received_events)[0]
            this.fpOptionsEndDate = setupDatePickerOption(received_events)[1]
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
        date,
        products,
        fpOptionsBeginDate,
        fpOptionsEndDate
      }
    },
    methods: {

      editEvent: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
        if (this.editingEvent) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + event.target.id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "title": this.events[vue_event_id].title,
              "description": this.events[vue_event_id].description,
              "beginAt": moment(this.events[vue_event_id].beginAt, "DD/MM/YY HH:mm").unix(),
              "endAt": moment(this.events[vue_event_id].endAt, "DD/MM/YY HH:mm").unix(),
              "products": getProductsID(this.events[vue_event_id].products)
            }
          })
        }
        // Replaces element in array, splice syntax = (begin, who many to delete, what to insert)
        // Needs to be done like this so Vue can detect changes and update the DOM
        this.$set(editingEvent, event.target.id, !editingEvent[event.target.id])
      },
      addProduct: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
        this.events[vue_event_id].products.push(this.products[0])
      },
      removeProduct: function (event_index,index) {
        this.events[event_index].products.splice(index,1)
      }
    }
  }
</script>



