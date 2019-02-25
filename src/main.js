import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import axiosConfig from './modules/axios-config'
import routerConfig from './routers/router-config'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'typeface-roboto'  // 字體
import App from './App.vue'

Vue.use(Router)
Vue.use(Vuex)
Vue.use(axiosConfig)
Vue.use(MuseUI)

let router = new Router(routerConfig)
new Vue({
  el: '#app',
  router: router,
  render: createElement => createElement(App)
})
