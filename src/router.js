import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/refresh',
      name: 'Refresh',
      component: () => import('@/views/Refresh.vue')
    },
    {
      path: '/lineBinding/:specificLineUser/:destinationId',
      name: 'LineBinding',
      component: () => import('@/views/LineBinding.vue')
    },
    {
      path: '/profile/:specificLineUser/:studentCard?',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      props: route => ({ ...route.params })
    }
  ]
})