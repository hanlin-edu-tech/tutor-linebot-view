export default {
    namespaced: true,
    state: {
        // 帳號管理時 取得該line user下綁定的所有學生
        students: []
    },
    
    actions: {
        assignStudents({ commit }, students) {
            commit('setStudents', students)
        }
    },
    
    mutations: {
        setStudents(state, students) {
            state.students = students
        }
    }
}
