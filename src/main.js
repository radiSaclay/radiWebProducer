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
import auth from './Auth'
import settings from './config/settings'

require('!style!css!less!./config/css/semantic.less')

// initialization of the router
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.config.debug = true;

const router = new VueRouter({
  routes: routes.routes
})

//route protection
router.beforeEach((to,from,next) => {
  //check if the user is authenticated
  auth.checkAuth()
  //redirect the user to the login route if he wants to navigate without authentification
  if (to.name != 'login') {
    if (!auth.user.authenticated) {
      next({name : 'login'})
    }
    else {
      next()
    }
  }
  //skip the login page if the user is already authenticated
  else {
    if (!auth.user.authenticated) {
      next()
    }
    else {
      next(settings.urls.HOMEPAGE)
    }
  }
})

// instantiation of the vue
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router
}).$mount('#app')
