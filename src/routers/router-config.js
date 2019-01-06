import Refresh from './Refresh'
import LineBinding from '../components/line-binding/LineBinding'
import MultiProfile from '../components/profile/MultiProfile'
import Profile from '../components/profile/Profile'
import NotifySetting from '../components/parents-on-line/NotifySetting'

export default {
  routes: [
    {
      path: '/refresh',
      name: 'Refresh',
      component: Refresh
    },
    {
      path: '/lineBinding/:specificLineUser',
      name: 'LineBinding',
      component: LineBinding
    },
    {
      path: '/profile/:specificLineUser/:panel?',
      name: 'MultiProfile',
      component: MultiProfile,
      props: route => ({...route.params})
    },
    {
      path: '/profile/:specificLineUser/:studentCard/:panel?',
      name: 'Profile',
      component: Profile,
      props: route => ({...route.params})
    },
    {
      path: '/:specificLineUser?',
      redirect: {name: 'MultiProfile'}
    },
    {
      path: '/parentsOnLine/:specificLineUser',
      name: 'ParentsOnLine',
      component: NotifySetting,
      props: route => ({...route.params})
    }
  ]
}
