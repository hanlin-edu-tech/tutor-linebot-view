export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    studentCards: Object,
    student: {
      role: '',
      mobile: '',
      studentCard: ''
    }
  },

  actions: {
    assignBindingAction ({commit}, lineBindingStudentCard) {
      commit('assignBinding', lineBindingStudentCard)
    },

    assignStudentCardsAction ({commit}, studentCards) {
      commit('assignStudentCards', studentCards)
    },
    
    assignStudentAction ({commit}, student) {
      commit('setStudent', student)
    }
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignStudentCards (state, studentCards) {
      state.studentCards = studentCards
    },
  
    setStudent(state, student) {
        state.student = student
    }
  }
}
