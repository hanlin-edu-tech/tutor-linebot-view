import axios from 'axios'

// 本地開發設為 http://localhost:8080
axios.defaults.baseURL = ''
axios.interceptors.response.use(response => response, Promise.reject)

export default {
  install: (Vue, Option) => {
    Vue.prototype.$axios = axios
  }
}
