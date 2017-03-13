import settings from './config/settings'

const LOGIN_URL = settings.urls.LOGIN_URL

export default {

  /* global localStorage:true */

  // User object will let us check authentication status
  user: {
    authenticated: false,
    isAdmin: false
  },

  // Send a request to the login URL and save the returned JWT
  userLogin (context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds).then((data) => {
      if (data.body.validated) {
        localStorage.setItem('id_token', data.body.token)
        this.user.authenticated = true
        context.$router.push(redirect)
      }
    }, (data) => {
      console.log('connection failed')
    })
  },

  adminLogin (context, creds, redirect) {
    // send credentials to the server
    context.$http.post(LOGIN_URL, creds).then((data) => {
      if (data.body.validated) {
        // if valid, store the token
        localStorage.setItem('id_token', data.body.token)
        // request serv to know if the user is admin
        context.$http.get(settings.urls.USER_INFO_URL, {
          headers: {
            Authorization: localStorage.getItem('id_token')
          }
        }).then((data2) => {
          // if the user is admin, route him to the admin panel
          if (data2.body.isAdmin) {
            this.user.isAdmin = true
            this.user.authenticated = true
            context.$router.push(redirect)
          }
        }, (data2) => {
          console.log('connection failed')
        })
      }
    }, (data) => {
      console.log('connection failed')
    })
  },

  // Remove the token
  logout (context, redirect) {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
    this.user.isAdmin = false
    context.$router.push(redirect)
  },

  checkAuth () {
    var jwt = localStorage.getItem('id_token')
    if (jwt) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  },
}
