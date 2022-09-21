<template>
  <mu-container id="line-binding-result" v-if="status === 'success'">
    <LineBindingSuccess></LineBindingSuccess>
  </mu-container>
  <mu-container id="line-binding-result" v-else-if="status === 'failure'">
    <LineBindingFailure @binding-again="$emit('binding-again')"></LineBindingFailure>
  </mu-container>
</template>

<script>
  import LineBindingReachLimited from '@/components/line-binding/result/LineBindingReachLimited'
  import LineBindingFailure from '@/components/line-binding/result/LineBindingFailure'
  import LineBindingSuccess from '@/components/line-binding/result/LineBindingSuccess'
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'LineBindingResult',
    components: {
      LineBindingSuccess,
      LineBindingFailure,
      LineBindingReachLimited
    },

    props:['lineUserId'],

    data () {
      return {
        status: '',
        discount: 0,
        code: '',
        expireDate: '',
      }
    },

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


      try {
        const response = await this.$axios(
          {
            method: 'post',
            // url: `/linebot/lineBinding`,
            url: `https://www.tbbt.com.tw/linebot/lineBinding`,
            data: this.lineBindingStudentCard
          }
        )
        const jsonData = response.data
        const message = jsonData.message
        let status
        if (message.indexOf('success') > 0) {
          status = 'success'
        } else if (message.indexOf('limited') > 0) {
          status = 'reachedLimited'
        } else {
          status = 'failure'
        }

        this.status = 'success'
      } catch (error) {
        console.error(error)
        this.status = 'success'
      }
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
