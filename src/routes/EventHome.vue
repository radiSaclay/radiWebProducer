<template>
  <div class="eventhome">
    <div v-for="event in events" :key="event.id">
      <div>
        <input  :disabled="!editingEvent[event.id]" v-model="event.title" placeholder="">
      </div>
      <div>
        <input  :disabled="!editingEvent[event.id]" v-model="event.description" placeholder="">
      </div>
      <div>
        <input  :disabled="!editingEvent[event.id]" v-model="event.BeginAt.date" placeholder="">
      </div>
      <div>
        <input :disabled="!editingEvent[event.id]" v-model="event.EndAt.date" placeholder="Date de Fin">
      </div>
      <button :id="event.id" v-on:click="editEvent">{{editingEvent ? "Done" : "Edit"}}</button>
      <br> </br>
    </div>
  </div>
</template>



<script>
  let farmid
  let events
  let editingEvent = []
  import Vue from 'vue'



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
      // get user farm id
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
        // save farm Id
        farmid = response.body['farm']['id']
        this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/?farmId=' + farmid).then(function successCallback (response) {
          // Make sure events have at least a null end date
          for (let i=0; i<response.body.length; i++){
            response.body[i] = (dateEndOrNull(response.body[i]))
          }
          this.events = response.body
        }, function errorCallback (response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response)
        })
      })
      editingEvent[5] = true
      return {
        events: [],
        editingTitle: false,
        editingDescription: false,
        editingBeginDate: false,
        editingEvent
      }
    },
    methods: {
      editEvent: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
        if (this.editingTitle) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + event.target.id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "title": this.events[vue_event_id].title
            }
          })
        }
        editingEvent.splice(event.target.id, 1, !editingEvent[event.target.id])
      }
    }
  }
</script>



