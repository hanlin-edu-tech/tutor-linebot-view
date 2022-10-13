export default {
  namespaced: true,
  state: {
    continueBinding: false,
    student: {
      name: '',
      role: '',
      mobile: '',
      email:'',
      studentCard: '',
      studentCards: []
    }
  },

  actions: {
    assignContinueBindingAction ({commit}, continueBinding) {
      commit('setContinueBinding', continueBinding)
    }
  },

  mutations: {
    setContinueBinding (state, continueBinding) {
      state.continueBinding = continueBinding
    }
  },
  
  getters: {
    isBoundSameStudentTwice(state) {
      // LineBinding created時 就會先取得該line id 下的所有學號
      if (state.student.studentCards.length > 0) {
        for (let i = 0; i < state.student.studentCards.length; i++) {
          /*
           * 綁定同學號兩次
           */
          if (state.student.studentCards[i] === state.student.studentCard) {
            return true
          }
        }
      }
      return false
    }
  }
}
