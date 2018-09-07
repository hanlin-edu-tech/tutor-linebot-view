export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    authentications: Object
  },

  actions: {
    assignBindingAction ({commit}, lineBindingStudentCard) {
      commit('assignBinding', lineBindingStudentCard)
    },

    assignAuthenticationsAction ({commit}, authentications) {
      commit('assignAuthentications', authentications)
    }
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignAuthentications (state, authentications) {
      state.authentications = authentications
    }
  }
}
