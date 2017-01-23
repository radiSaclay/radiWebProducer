<template>
  <div class="notiflist">
    <ul>
      <!-- TODO: sort the results -->
      <li v-for="(annonce, index) in inventory">
        {{ index + 1 }} <h4>Vente de {{ annonce.product }} le {{ annonce.date }}.</h4>      Vu par {{ annonce.views }} personne(s), dont {{ annonce.interessed }} intéressée(s). <h2></h2>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'notiflist',
  data () {
    return {
      // TODO : get the data with a request to the database.
      inventory: [
        {product: 'pommes', date: '17/01/17', views: 20, interessed: 10},
        {product: 'radis', date: '12/01/17', views: 300, interessed: 50},
        {product: 'yaourt', date: '08/12/16', views: 10, interessed: 0},
        {product: 'cookies', date: '16/01/17', views: 100, interessed: 12}
      ]
    }
  }
}
</script>

<style>
li{
  border:1px solid grey;
  margin: 50px;
  margin-left: 20%;
  margin-right: 20%;
}
</style>
