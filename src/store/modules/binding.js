export default {
  namespaced: true,
  state: {
    lineBindingStudentCard: Object,
    studentCards: Object,
    continueBinding: false,
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
    
    assignContinueBindingAction ({commit}, continueBinding) {
      commit('setContinueBinding', continueBinding)
    }
  },

  mutations: {
    assignBinding (state, lineBindingStudentCard) {
      state.lineBindingStudentCard = lineBindingStudentCard
    },

    assignStudentCards (state, studentCards) {
      state.studentCards = studentCards
    },
    
    setContinueBinding (state, continueBinding) {
      state.continueBinding = continueBinding
    }
  }
}
