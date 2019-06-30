import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/store'
import axiosConfig from '@/modules/axios-config'
import MuseUI from 'muse-ui'
import 'dayjs/locale/zh-tw'
import 'muse-ui/dist/muse-ui.css'
import 'typeface-roboto'  // 字體

// 關閉 vue instance 產生時的提示
Vue.config.productionTip = false
Vue.use(axiosConfig)
Vue.use(MuseUI)

new Vue({
  router,
  store,
  render: createElement => createElement(App)
}).$mount('#app')