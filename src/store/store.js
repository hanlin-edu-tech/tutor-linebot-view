import Vue from 'vue'
import Vuex from 'vuex'
import binding from './modules/binding'
import step from './modules/step'
import unifyDesc from './modules/unify-desc'
import profile from "@/store/modules/profile";

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    binding,
    step,
    unifyDesc,
    profile
  }
})

export default store
