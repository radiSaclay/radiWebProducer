/**
 * Created by lbertaux on 1/17/17.
 */
import Home from './Home'
import Login from './Login'
import Sendnotif from './Sendnotif'
import farmhome from './FarmHome.vue'
import eventhome from './EventHome.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/farmhome', component: farmhome },
  { path: '/eventhome', component: eventhome },
  { path: '/send-notif', component: Sendnotif }
]

export default {
  routes
}
