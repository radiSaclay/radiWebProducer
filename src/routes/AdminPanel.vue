<template>
    <div>
      <!--action menu-->
      <div class="ui secondary vertical menu">
        <router-link to="/adminpanel/farmcreate" v-bind:class='isActive("farmcreate")' v-on:click.native='activateItem("farmcreate")'>Créer une ferme</router-link>
        <router-link to="/adminpanel/farmdelete" v-bind:class='isActive("farmdelete")' v-on:click.native='activateItem("farmdelete")'>Supprimer une ferme</router-link>
        <router-link to="/adminpanel/productadd" v-bind:class='isActive("productadd")' v-on:click.native='activateItem("productadd")'>Ajouter un produit</router-link>
        <router-link to="/adminpanel/productdelete" v-bind:class='isActive("productdelete")' v-on:click.native='activateItem("productdelete")'>Supprimer un produit</router-link>
      </div>

      <!--render administration components-->
      <router-view></router-view>
    </div>
</template>
<script>
    export default{
        name: 'adminpanel',
        data(){
          return {
            activeItem: "farmcreate"
          }
        },

        methods: {
          isActive(item) {
            if(this.activeItem === item) {
              return "active item"
            }
            else {
              return "item"
            }
          },
          activateItem(item) {
            this.activeItem = item
            console.log(this.activeItem)
          }
        }
    }
</script>
