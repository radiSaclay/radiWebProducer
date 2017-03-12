<template>
  <div class="ui one column centered grid">

    <div class="column">

      <!-- Button to add new event -->
      <div class="ui center aligned basic segment">
        <button class="ui primary button" v-on:click="addEvent()">Créer un nouvel événement</button>
      </div>

      <!-- For all events ... -->
      <div class="ui equal width form" v-for="(event, event_index) in events">

        <!-- frame surronding one event ... -->
        <div class="ui container secondary message">

          <!-- Number of the event ... -->
          <div class="ui center aligned basic segment"> <h1> Event {{event.id}} </h1></div>

          <!-- Title of the event ... -->
          <div class="field">
            <div class="ui labeled input">
              <div class="ui olive inverted label" style="width:100px">Titre</div>
              <input :disabled="!event.being_edited" v-model="event.title" placeholder="Title"></input>
            </div>
          </div>

          <!-- Description of the event ... -->
          <div class="field">
            <div class="ui labeled input">
              <div class="ui olive inverted label" style="width:100px">Description</div>
              <textarea rows="2" :disabled="!event.being_edited" v-model="event.description" placeholder="Description"></textarea>
            </div>
          </div>

          <!-- Beginning date ... -->
          <div class="field">
            <div class="ui labeled input">
              <div class="ui olive inverted label" style="width:100px">Début</div>
              <Flatpickr :disabled="!event.being_edited" v-model="event.beginAt" :options="event.fpOptionsBeginDate"></Flatpickr>
            </div>
          </div>

          <!-- Ending date ... -->
          <div class="field">
            <div class="ui labeled input">
              <div class="ui olive inverted label" style="width:100px">Fin</div>
              <Flatpickr :disabled="!event.being_edited" v-model="event.endAt" :options="event.fpOptionsEndDate"></Flatpickr>
            </div>
          </div>

          <!-- Products involved ... -->
          <div class="field">
            <div class="ui labeled input">

              <div class="ui olive inverted label" style="width:100px">Produits</div>

              <div class="ui four column grid" style="margin-top:0px">
                <!-- For each product of this event... -->
                <div v-for="(event_product, index) in event.products">
                  <!-- Create a dropdown menu with value linked to the current product of the event -->
                  <dropdown :suggestions="farm_products" :selection.sync="events[event_index].products[index].name" :isDisabled="!event.being_edited" :product_index="index" :event_index="event_index"></dropdown>
                </div>
              </div>

              <button class="ui icon primary button" v-if="event.being_edited" :id="event_index" v-on:click="addProduct(event_index)">
                <i class="add icon"></i>
              </button>

            </div>
          </div>


          <!-- Buttons to edit or delete the event ... -->
          <div class="ui center aligned basic segment">
            <button class="ui secondary button" v-on:click="editEvent(event_index)">{{event.being_edited ? "Enregistrer" : "Editer"}}</button>
            <button class="ui secondary button" v-on:click="removeEvent(event_index)">Supprimer</button>
          </div>


        </div>
        <br>
      </div>


    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  // Moment deals with converting dates between UNIX timestamp and human readable format
  import moment from 'moment'
  import VueFlatpickr from 'vue-flatpickr'
  import 'vue-flatpickr/theme/airbnb.css'
  import * as api from '../api/general'
  import settings from '../config/settings'
  import Dropdown from '../components/Dropdown'
  Vue.use(VueFlatpickr)
  let farm_id, events, farm_products

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


  // When an event comes from the server its products cant be bound using Vue-js' v-bind to
  // the full list of farm proposed products because they have different fields (different level of detail)
  // This function converts the "event" products into "farm_products" by matching and replacing them
  // it also adds the necessary configuration fields needed by the DatePicker for more info see setupDatePickerOption
  // function
  function adaptEvent(event, farm_products){
    api.convertEventProdToFullProducts(event, farm_products)
    setupDatePickerOption(event)
    event.being_edited = false
  }

  export default {
    /* global localStorage:true */

    components: {
      Dropdown
    },

    data () {
      // get user farm id
      this.$http.get(settings.urls.USER_INFO_URL, {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (user_info) {
        // save farm Id
        farm_id = user_info.body['farm']['id']
        // Get products proposed by farm
        this.$http.get(settings.urls.FARMS_URL + farm_id, {
          headers: {
            Authorization: localStorage.getItem('id_token')
          }
        }).then(function successCallback (prod_response) {
          this.farm_products = prod_response.body['products']
          // get events associated with this farm
          this.$http.get(settings.urls.EVENTS_URL + '?farm_id=' + farm_id + '&embedded=1').then(function successCallback (farm_events) {
            let received_events = farm_events.body
            let prods = this.farm_products
            received_events.forEach(function (event) {
              adaptEvent(event, prods)
            })
            this.events = received_events.reverse()
          }, function errorCallback (error_getting_farm_events) {
            console.log("Error getting farm events: " + error_getting_farm_events)
          })
        }, function (error_getting_farm_products) {
          console.log("Error getting farm products: " + error_getting_farm_products)
        })
      }, function (error_getting_user_info) {
        console.log("Error getting user info: " + error_getting_user_info)
      })
      return {
        events: [],
        farm_products
      }
    },

    methods: {
      editEvent: function (event_index) {
        // If is being edited and is not a new event, continue with PUT, else if is new do a POST
        if (this.events[event_index].being_edited) {
          if(!this.events[event_index].isNewEvent){
            this.$http({
              url: settings.urls.EVENTS_URL + this.events[event_index].id,
              method: 'PUT',
              headers: {
                'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
              },
              body: {
                "title": this.events[event_index].title,
                "description": this.events[event_index].description,
                "beginAt": moment(this.events[event_index].beginAt, "DD/MM/YY HH:mm").unix(),
                "endAt": moment(this.events[event_index].endAt, "DD/MM/YY HH:mm").unix(),
                "products": api.getProductsID(this.events[event_index].products)
              }
            }).then(function (success_resp) {
                  // TODO: put a visual sign that it was successful
              },
              function (error_resp) {
                console.log("Error editing event")
                console.log(error_resp)
                // TODO: put a visual sign that it was NOT successful
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
        this.$http({url: settings.urls.EVENTS_URL, method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
          }, body: {
            "title": this.events[event_index].title,
            "description": this.events[event_index].description,
            "beginAt": moment(this.events[event_index].beginAt, "DD/MM/YY HH:mm").unix(),
            "endAt": moment(this.events[event_index].endAt, "DD/MM/YY HH:mm").unix(),
            "products": api.getProductsID(this.events[event_index].products)
          }
        }).then(function (success) {
            console.log('Success')
        }, function (error) {
          console.log('Failed')
          console.log(error)
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
      editProduct: function (event_index,product_index,new_product) {
        this.events[event_index].products[product_index] = new_product;
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
        new_event.isNewEvent = true
        // push returns the new length of the array
        let new_length = this.events.unshift(new_event)
      },
      removeEvent: function (event_index) {
        // Removing event with index "event_index"
        this.$http({url: settings.urls.EVENTS_URL + this.events[event_index].id, method: 'DELETE',
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
