import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
axios.interceptors.response.use(response => response, Promise.reject)

export default {
  install: (Vue, Option) => {
    Vue.prototype.$axios = axios
  }
}
