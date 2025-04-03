import axios from 'axios'

const enhanceAccessToken = () => {
  const {accessToken} = localStorage
  if (!accessToken) return
  axios.defaults.headers.common['authType'] = accessToken
}

enhanceAccessToken()

const RES_CODES = {
  ERROR_CODE_SUCCESS: 2000
}

export default {
  RES_CODES
}
