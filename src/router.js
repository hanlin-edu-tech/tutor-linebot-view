import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/refresh',
      name: 'Refresh',
      component: () => import('@/views/Refresh.vue')
    },
    {
      path: '/lineBinding/:specificLineUser',
      name: 'LineBinding',
      component: () => import('@/views/LineBinding.vue')
    },
    {
      path: '/profile/:specificLineUser/:panel?',
      name: 'MultiProfile',
      component: () => import('@/views/MultiProfile.vue'),
      props: route => ({ ...route.params })
    },
    {
      path: '/profile/:specificLineUser/:studentCard/:panel?',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      props: route => ({ ...route.params })
    },
    {
      path: '/:specificLineUser?',
      redirect: { name: 'MultiProfile' }
    }
  ]
})