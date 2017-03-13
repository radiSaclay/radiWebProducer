/**
 * Created by lbertaux on 1/17/17.
 */
import login from './Login'
import adminlogin from './AdminLogin'
import farmhome from './FarmHome'
import eventhome from './EventHome'
import adminpanel from './AdminPanel'
import farmcreate from './adminpanel/FarmCreate'
import farmdelete from './adminpanel/FarmDelete'
import productadd from './adminpanel/ProductAdd'
import productdelete from './adminpanel/ProductDelete'
import auth from '../Auth'

const routes = [
  { path: '/', name: 'login', component: login },
  { path: '/adminlogin', name: 'adminlogin', component: adminlogin},
  { path: '/farmhome', component: farmhome },
  { path: '/eventhome', component: eventhome },
  { path: '/adminpanel', component: adminpanel,
    children : [
      {path: 'farmcreate', component: farmcreate},
      {path: 'farmdelete', component: farmdelete},
      {path: 'productadd', component: productadd},
      {path: 'productdelete', component: productdelete},
    ],
    //restrict the access to admins
    beforeEnter: (to,from,next) => {
      if (auth.user.isAdmin) {
        next()
      }
      else {
        next(from)
      }
    }
  }
]

export default {
  routes
}
