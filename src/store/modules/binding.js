export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    lineUserId: String
  },

  actions: {
    assignBindingAction ({commit}, lineBindingStudentCard) {
      commit('assignBinding', lineBindingStudentCard)
    },

    assignLineUserIdAction ({commit}, lineUserId) {
      commit('assignLineUserId', lineUserId)
    }
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignLineUserId (state, lineUserId) {
      state.lineUserId = lineUserId
    }
  }
}
