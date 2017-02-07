<template>
  <div class="eventhome">
    <div v-for="event in events" :key="event.id">
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
      <div v-for="product in event.products" :key="product.id">
        <div>
          <input :disabled="!editingEvent[event.id]" v-model="product.name" placeholder="">
        </div>
      </div>
      <select>
        <div v-for="product in ALLproducts">
          <h3>{{product}}</h3>
          <option>product</option>
        </div>
        <option>B</option>
        <option>C</option>
      </select>
      <button :id="event.id" v-on:click="editEvent">{{editingEvent[event.id] ? "Done" : "Edit"}}</button>
      <br> </br>
    </div>
  </div>
</template>



<script>
  let farmid
  let events
  let editingEvent = {}
  let ALLproducts
  import Vue from 'vue'

  function getProducts (context){
    context.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/products/', {
      headers: {
        Authorization: localStorage.getItem('id_token')
      }
    }).then(function successCallback (response) {
      console.log(response.body)
      context.ALLproducts = response.body
      return response.body

    })
  }

  // Creates a null date because the v-model expectes event.EndAt.date to exist (even if it is null)
  function dateEndOrNull(event) {
    if (!event.EndAt){
      event.EndAt = {date: null};
    }
    return event
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
  export default {
    /* global localStorage:true */
    data () {
      ALLproducts = getProducts(this)
      // get user farm id
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
        // save farm Id
        farmid = response.body['farm']['id']
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farmId=' + farmid + '&embedded=1').then(function successCallback (response) {
          // Make sure events have at least a null end date
//          for (let i=0; i<response.body.length; i++){
//            response.body[i] = (dateEndOrNull(response.body[i]))
//          }
          this.events = response.body
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response)
        })
      })
      return {
        events: [],
        editingTitle: false,
        editingDescription: false,
        editingBeginDate: false,
        editingEvent,
        ALLproducts
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
              "products": this.events[vue_event_id].products,
              "beginAt": this.events[vue_event_id].beginAt,
              "endAt": this.events[vue_event_id].endAt
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



