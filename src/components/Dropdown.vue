<template>
  <div class="ui column">
    <div style="position:relative" v-bind:class="openSuggestion">
      <div class="ui left icon labeled input">

        <i class="dropdown icon"></i>

        <label class="ui right corner icon olive button label" v-if="!isDisabled" :id="product_index" v-on:click="$parent.removeProduct(event_index,product_index)">
          <i class="remove icon"></i>
        </label>

        <input class="form-control" type="text" v-model="selection" :disabled="isDisabled" v-on:click="removeSelection"
        @keydown.enter = 'enter(event_index,product_index)'
        @keydown.down = 'down'
        @keydown.up = 'up'
        @input = 'change'
        />
      </div>
      <div class="ui vertical menu" v-if="open&&!isDisabled">
        <div class="ui item" v-bind:class="isActive(index)" v-for="(suggestion, index) in matches" @click="suggestionClick(event_index,product_index,index)" v-bind:value="suggestion">
          {{ suggestion.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    data() {
      return {
        open: false,
        current: 0
      }
    },
    props: {
      suggestions: {
        type: Array,
        required: true
      },
      selection: {
        type: String,
        required: true,
        twoWay: true
      },
      isDisabled: {
        type: Boolean,
        required: false
      },
      product_index: {
        type: Number,
        required: true
      },
      event_index: {
        type: Number,
        required: true
      }
    },
    computed: {
      matches() {
        return this.suggestions.filter(({name: str}) => {
          return str.indexOf(this.selection) >= 0;
        });
      },
      openSuggestion() {
        if (this.selection !== "" &&
        this.matches.length != 0 &&
        this.open === true){
          return "open";
        }

      }
    },
    methods: {
      //When enter pressed on the input
      enter(event_index,product_index) {
        var element = this.matches[this.current];
        this.selection = this.matches[this.current].name;
        this.open = false;
        this.$parent.editProduct(event_index,product_index,element);
      },
      //When up pressed while suggestions are open
      up() {
        if(this.current > 0)
        this.current--;
      },
      //When down pressed while suggestions are open
      down() {
        if(this.current < this.suggestions.length - 1)
        this.current++;
      },
      //For highlighting element
      isActive(index) {
        if (index === this.current){
          return "active";
        }
      },
      //When the user changes input
      change() {
        if (this.open == false) {
          this.open = true;
          this.current = 0;
        }
      },
      //When one of the suggestion is clicked
      suggestionClick(event_index,product_index,index) {
        var element = this.matches[index];
        this.selection = this.matches[index].name;
        this.open = false;
        this.$parent.editProduct(event_index,product_index,element);
      },
      //Removes the previous selected value when the input is clicked.
      //So that you don't have to delete everything by hand in order to see all the others previous products
      removeSelection() {
        this.selection="";
        this.current=0;
        this.open = true;
      }
    }
  }
</script>
