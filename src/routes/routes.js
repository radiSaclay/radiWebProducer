/**
 * Created by lbertaux on 1/17/17.
 */
import Login from './Login'
import farmhome from './FarmHome.vue'
import eventhome from './EventHome.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/farmhome', component: farmhome },
  { path: '/eventhome', component: eventhome },
]

export default {
  routes
}
