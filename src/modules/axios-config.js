import axios from 'axios'

axios.defaults.baseURL = ''
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default {
  install: function (Vue, Option) {
    Vue.prototype['axios'] = axios
  }
}
