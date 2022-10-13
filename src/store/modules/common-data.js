import axios from "axios";

export default {
    namespaced: true,
    state: {
        // 帳號管理時 取得該line user下綁定的所有學生
        students: []
    },
    
    actions: {
        // 初始化該使用者下的所有綁定學生
        async initStudentsWithLineUser({commit}, lineUserId) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `/linebot/profile/${lineUserId}`
                })
                const students = response.data.content
                commit('setStudents', students)
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    
    mutations: {
        setStudents(state, students) {
            state.students = students
        }
    }
}