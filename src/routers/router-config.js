import LineBinding from '../components/line-binding/LineBinding'
import MultiProfile from '../components/profile/MultiProfile'
import Profile from '../components/profile/Profile'

export default {
  routes: [
    {
      path: '/lineBinding/:specificLineUser',
      name: 'LineBinding',
      component: LineBinding
    },
    {
      path: '/profile/:specificLineUser',
      name: 'MultiProfile',
      component: MultiProfile
    },
    {
      path: '/profile/:specificLineUser/:studentCard',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/:specificLineUser?',
      redirect: {name: 'MultiProfile'}
    }
  ]
}
