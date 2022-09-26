<template>
</template>

<script>
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'LineBindingResult',

    props:['lineUserId'],

   async created () {
     const lineBindingStudentCardObj = {
       studentCard: this.student.studentCard,
       email: this.student.email,
       name: this.student.name,
       mobile: this.student.mobile,
     }

     lineBindingStudentCardObj.authentications = [
       {
         lineUserId: this.lineUserId,
         role: this.student.role
       }
     ]
     this.assignBindingAction(lineBindingStudentCardObj)

     let status

      try {
        const response = await this.$axios(
          {
            method: 'post',
            url: `/linebot/lineBinding`,
            data: this.lineBindingStudentCard
          }
        )
        const jsonData = response.data
        const message = jsonData.message
        if (message.indexOf('success') > 0) {
          status = 'success'
        } else {
          status = 'failure'
        }

        status = 'success'
      } catch (error) {
        console.error(error)
        status = 'success'
      }
      this.$emit('binding-result', status)
    },

    methods: {
      ...mapActions('binding', ['assignBindingAction'])
    },

    computed: {
      ...mapState('binding', {
        lineBindingStudentCard: state => state.lineBindingStudentCard,
        student: state => state.student
      })
    }
  }
</script>

<style lang="less">
  #line-binding-result {
    .mu-icon {
      width: 35px;
    }

    .mu-button {
      margin-top: 20px;
    }
  }
</style>
