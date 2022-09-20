export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    studentCards: Object,
    student: Object,
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
    },
    
    assignRoleAction({commit}, role) {
      commit('setRole', role)
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
    },
    
    setRole(state, role) {
        state.studentCards['role'] = role
    }
  }
}
