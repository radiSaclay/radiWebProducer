/* *
* This is the first file to be loaded from index.html .
* It is loaded by index.html because it has a div of id app which is referenced here
*
* */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes/routes'
import VueResource from 'vue-resource'

require('!style!css!less!./config/css/semantic.less')

// initialization of the router
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.config.debug = true;

const router = new VueRouter({
  routes: routes.routes
})

// instantiation of the vue
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router
}).$mount('#app')
