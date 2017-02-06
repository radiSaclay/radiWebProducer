<template>
  <div class="eventhome">
    <div v-for="event in events" :key="event.id">
      <div>
        <input  :disabled="!editingTitle" v-model="event.title" placeholder="">
        <button :id="event.id" v-on:click="editTitle">{{editingTitle ? "Done" : "Edit"}}</button>
      </div>
      <div>
        <input  :disabled="!editingDescription" v-model="event.description" placeholder="">
        <button :id="event.id" v-on:click="editDescription">{{editingDescription ? "Done" : "Edit"}}</button>
      </div>
      <div>
        <input  :disabled="!editingBeginDate" v-model="event.BeginAt.date" placeholder="">
        <button :id="event.id" v-on:click="editBeginDate">{{editingBeginDate ? "Done" : "Edit"}}</button>
      </div>
      <div>
        <input :disabled="!editingEndDate" v-model="event.EndAt.date" placeholder="Date de Fin">
        <button :id="event.id" v-on:click="editEndDate">{{editingEndDate ? "Done" : "Edit"}}</button>
      </div>
    </div>
  </div>
</template>



<script>
  let farmid
  let events
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
      this.$http.get('http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/auth/user', {
        headers: {
          Authorization: localStorage.getItem('id_token')
        }
      }).then(function successCallback (response) {
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
      return {
        events: [],
        editingTitle: false,
        editingDescription: false,
        editingBeginDate: false,
        editingEndDate: false
      }
    },
    methods: {
      editTitle: function (event) {
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
        this.editingTitle = !this.editingTitle
      },
      editDescription: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
        if (this.editingDescription) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + event.target.id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "description": this.events[vue_event_id].description
            }
          })
        }
        this.editingDescription = !this.editingDescription
      },
      editBeginDate: function (event) {
        let vue_event_id
        vue_event_id = findVueId(this.events, event.target.id)
        this.events[vue_event_id].BeginAt.date = "2018-01-31 09:15:41";
        if (this.editingBeginDate) {
          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + event.target.id, method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
            }, body: {
              "BeginAt": {
                "date": "2018-02-31 09:15:41",
                "timezone_type": 3,
                "timezone": "UTC"
              }
            }
          })
        }
        this.editingBeginDate = !this.editingBeginDate
      },
      editEndDate: function (event) {
//        if (this.editingEndDate) {
//          this.$http({url: 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/api/events/' + input.target.id, method: 'PUT',
//            headers: {
//              'Authorization': localStorage.getItem('id_token'), 'Content-Type': 'application/json'
//            }, body: {
//              "description": "awesome"
//            }
//          })
//        }
        this.editingEndDate = !this.editingEndDate
      }
    }
  }
</script>



<style>
  .eventhome input {
    display: inline-block;
  }
</style>
