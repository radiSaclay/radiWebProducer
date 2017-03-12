var SERVEUR_ROOT = 'http://ec2-52-56-114-123.eu-west-2.compute.amazonaws.com/'

const settings = {
  keys: {
    ID_TOKEN: 'id_token'
  },
  urls: {
    AUTH_URL: SERVEUR_ROOT + 'auth/',
    LOGIN_URL: SERVEUR_ROOT + 'auth/login',
    HOMEPAGE: '/farmhome',
    EVENTS_URL: SERVEUR_ROOT + '/api/events/',
    FARMS_URL: SERVEUR_ROOT + '/api/farms/',
    USER_INFO_URL: SERVEUR_ROOT + '/auth/user',
    GET_PRODUCT_URL: SERVEUR_ROOT + 'api/products/'
  }
}

export default settings
