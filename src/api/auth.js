// import 'es6-promise/auto'
import axios from 'axios'
import {API_URL_AUTH, API_URL_SESSION, API_URL_VALIDATE_TOKEN} from './urls'

export default {
  getSession () {
    return axios({
      method: 'GET',
      url: API_URL_SESSION,
      withCredentials: true,
      headers: {
        appType: 'ADMIN'
      }
    })
  },

  validateToken (token) {
    return axios({
      method: 'GET',
      url: API_URL_VALIDATE_TOKEN,
      withCredentials: true,
      headers: {
        appType: 'ADMIN',
        authToken: token
      }
    })
  },

  login (loginId, password) {
    axios({
      method: 'POST',
      url: API_URL_AUTH,
      withCredentials: true,
      data: {
        uid: loginId,
        upass: password
      }
    })
  },

  logout (token) {
    localStorage['authToken'] = null;
    localStorage['authName'] = null;
    localStorage['userName'] = null;
    localStorage['myId'] = null;
    localStorage['bpName'] = null;
    localStorage['srsAuth'] = null;
    localStorage['windowReloadTime'] = null;
  
  }
}
