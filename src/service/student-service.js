import axios from "axios"

export default {
    methods: {
        async searchStudentWithStudentCard(studentCard) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `/linebot/lineBinding/user?studentCard=${studentCard}`
                })
                if (response.data.message.indexOf('failure') > 0) {
                    return 'student not found'
                } else {
                    const student = response.data.content
                    return student
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        
        async searchStudentsWithMobile(mobile) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `/linebot/lineBinding/students-by-mobile?mobile=${mobile}`,
                })
                // 捷徑運算 若content不存在 則不執行 .length 造成錯誤
                if (response.data.content && response.data.content.length > 0) {
                    const students = response.data.content
                    
                    return students
                }
            } catch (error) {
                console.error(error)
            }
        },
        
        async searchStudentWithStudentCardAndMobile(studentCard, mobile) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `/linebot/lineBinding/user?studentCard=${studentCard}&mobile=${mobile}`,
                })
                
                const data = response.data
                if (data.message.indexOf('success') > 0) {
                    const student = data.content
                    
                    return student
                } else {
                    throw new Error('no student data with studentCard and mobile')
                }
                
            } catch (error) {
                console.error(error)
            }
        },
        
        async isBindingStudentResult(studentObj) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `/linebot/lineBinding`,
                    data: studentObj
                })
                const message = response.data.message
                const status = message.indexOf('success') > 0 ? 'success' : 'failure'
                
                return status
            } catch (error) {
                console.error(error)
            }
        }
    }
}