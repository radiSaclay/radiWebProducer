/**
 * Created by lbertaux on 1/17/17.
 */
import Home from './Home'
import Login from './Login'
import Sendnotif from './Sendnotif'

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/send-notif', component: Sendnotif }
]

export default {
  routes
}
