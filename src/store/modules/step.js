export default {
  namespaced: true,
  state: {
    bindingStep: 0
  },

  actions: {
    resetStepAction ({commit}) {
      commit('resetStep')
    },

    forwardStepAction ({commit}) {
      commit('forwardStep')
    },

    backwardStepAction ({commit}) {
      commit('backwardStep')
    }
  },

  mutations: {
    resetStep (state) {
      state.bindingStep = 0
    },

    forwardStep (state) {
      state.bindingStep++
    },

    backwardStep (state) {
      state.bindingStep--
    }
  }
}
