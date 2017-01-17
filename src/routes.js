/**
 * Created by lbertaux on 1/17/17.
 */
import Home from './components/Home'
import Login from './components/Login'
import Sendnotif from './components/Sendnotif'

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/send-notif', component: Sendnotif }
]

export default {
  routes
}
