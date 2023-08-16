export default {
  namespaced: true,
  state: {
    continueBinding: false,
    destinationId: '',
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
    },
    assignDestinationIdAction ({commit}, destinationId) {
      commit('setDestinationId', destinationId)
    }
  },

  mutations: {
    setContinueBinding (state, continueBinding) {
      state.continueBinding = continueBinding
    },
    setDestinationId (state, destinationId) {
      state.destinationId = destinationId
    }
  },
  
  getters: {
    isBoundSameStudentTwice(state) {
        // LineBinding created時 就會先取得該line id 下的所有學號
        // 綁定同學號兩次
        return state.student.studentCards.indexOf(state.student.studentCard) !== -1
    }
  }
}
