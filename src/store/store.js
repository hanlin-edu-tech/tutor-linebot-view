import Vue from 'vue'
import Vuex from 'vuex'
import binding from './modules/binding'
import step from './modules/step'
import unifyDesc from './modules/unify-desc'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    binding,
    step,
    unifyDesc
  }
})

export default store
