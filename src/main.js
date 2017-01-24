// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes/routes'
import VueResource from 'vue-resource'

// initialization of the router
Vue.use(VueResource)
Vue.use(VueRouter)

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
