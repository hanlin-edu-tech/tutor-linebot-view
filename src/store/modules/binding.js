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
        // 綁定同學號兩次
        console.log('...')
        return state.student.studentCards.indexOf(state.student.studentCard) !== -1
    }
  }
}
