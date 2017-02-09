<template>
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
        <input  :disabled="!editingEvent[event.id]" v-model="event.beginAt" placeholder="">
      </div>
      <div>
        <input :disabled="!editingEvent[event.id]" v-model="event.endAt" placeholder="Date de Fin">
      </div>
      <h3> Produits </h3>
      <div v-for="(event_product, index) in event.products">
        <!--<h2>{{products}}</h2>-->
        <select v-if="event.products[index]" v-model="events[event_index].products[index]"  :disabled="!editingEvent[event.id]" >
          <option v-for="product in products" v-bind:value="product">
            {{product.name}}
          </option>
        </select>
      </div>
      <button :id="event.id" v-on:click="editEvent">{{editingEvent[event.id] ? "Done" : "Edit"}}</button>
      <br> </br>
    </div>
  </div>
</template>




<script>
  let farmid
  let events
  let editingEvent = {}
  let products
  import Vue from 'vue'

  function getProductsID(products){
    let productsID
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
    console.log(event_products)
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
//            received_events[0].products[0] = prods[1]
//            console.log(received_events[0].products)
          this.events = received_events
//            console.log(prods)
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        })
      })
      })
      console.log(products)
      return {
        events: [],
        editingTitle: false,
        editingDescription: false,
        editingBeginDate: false,
        editingEvent,
        products
      }
    },
    methods: {
      editEvent: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
//        console.log(getProductsID(this.events[vue_event_id].products))
        if (this.editingEvent) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + event.target.id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "title": this.events[vue_event_id].title,
              "description": this.events[vue_event_id].description,
              "beginAt": this.events[vue_event_id].beginAt,
              "endAt": this.events[vue_event_id].endAt,
//              "products": [5, 13]
            }
          })
        }
        // Replaces element in array, splice syntax = (begin, who many to delete, what to insert)
        // Needs to be done like this so Vue can detect changes and update the DOM
        this.$set(editingEvent, event.target.id, !editingEvent[event.target.id])
      }
    }
  }
</script>



