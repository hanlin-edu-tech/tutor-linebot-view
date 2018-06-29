import axios from 'axios'

export default {
  install: function (Vue, Option) {
    Vue.prototype['axios'] = axios
  }
}
