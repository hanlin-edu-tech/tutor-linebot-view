<template>
  <mu-container id="line-binding-result" v-if="status === 'success'">
    <LineBindingSuccess></LineBindingSuccess>
  </mu-container>
  <mu-container id="line-binding-result" v-else-if="status === 'failure'">
    <LineBindingFailure></LineBindingFailure>
  </mu-container>
</template>

<script>
  import LineBindingReachLimited from './result/LineBindingReachLimited'
  import LineBindingFailure from './result/LineBindingFailure'
  import LineBindingSuccess from './result/LineBindingSuccess'
  import { mapState } from 'vuex'

  export default {
    name: 'LineBindingResult',
    components: {
      LineBindingSuccess,
      LineBindingFailure,
      LineBindingReachLimited
    },

    data () {
      return {
        status: '',
        discount: 0,
        code: '',
        expireDate: '',
      }
    },

    /* 使用 store module 的命名空間：binding，來取得此 module 儲存的 lineBindingStudentCard 物件 */
    computed: mapState('binding', ['lineBindingStudentCard']),

    created () {
      let vueModel = this
      vueModel
        .axios(
          {
            method: 'post',
            url: `/linebot/lineBinding`,
            data: vueModel.lineBindingStudentCard
          }
        )
        .then(function (response) {
          let jsonData = response.data
          let message = jsonData.message
          let status

          if (message.indexOf('success') > 0) {
            status = 'success'
          } else if (message.indexOf('limited') > 0) {
            status = 'reachedLimited'
          } else {
            status = 'failure'
          }

          vueModel.status = status
        })
        .catch(error => {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    mounted () {
      document.querySelector('#line-binding .mu-stepper').style.display = 'none'
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
