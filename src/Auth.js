import settings from './config/settings'

const LOGIN_URL = settings.urls.LOGIN_URL

export default {

  /* global localStorage:true */

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
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

  // Remove the token
  logout (context, redirect) {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
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

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  }
}
