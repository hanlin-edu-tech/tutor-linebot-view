export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    studentCardAuthenticationMapping: Object
  },

  actions: {
    assignBindingAction ({commit}, lineBindingStudentCard) {
      commit('assignBinding', lineBindingStudentCard)
    },

    assignStudentCardAuthenticationMappingAction ({commit}, studentCardAuthenticationMapping) {
      commit('assignStudentCardAuthenticationMapping', studentCardAuthenticationMapping)
    }
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignStudentCardAuthenticationMapping (state, studentCardAuthenticationMapping) {
      state.studentCardAuthenticationMapping = studentCardAuthenticationMapping
    }
  }
}
