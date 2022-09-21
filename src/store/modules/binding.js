export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    studentCards: Object,
    student: {
      role: '',
      mobile: '',
      email:'',
      studentCard: '',
      studentCards: []
    }
  },

  actions: {
    assignBindingAction ({commit}, lineBindingStudentCard) {
      commit('assignBinding', lineBindingStudentCard)
    },

    assignStudentCardsAction ({commit}, studentCards) {
      commit('assignStudentCards', studentCards)
    },
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignStudentCards (state, studentCards) {
      state.studentCards = studentCards
    },
  }
}
