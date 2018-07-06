<template>
  <article id="line-binding-confirm" class="font-secondary-info">
    <mu-container>
      <mu-row v-if="Object.keys(studentCardAuthenticationMapping).length && isRoleBoundSameStudentCard()">
        <mu-col span="12">
          <span class="verify-result font-important-info">您已綁定過此學號，請至帳號查詢頁面查看詳情！</span>
        </mu-col>
      </mu-row>
      <div v-else>
        <mu-row>
          <mu-col span="12">
            以下為您輸入的學號所對應之 E-Mail，請再次確認是否正確！
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-col span="12">
            學號：<span class="font-important-info">{{studentCard}}</span>
            <br />
            帳號：{{retrieveEmail()}}
            <span class="verify-result info" v-show="email">{{email}}</span>
            <span class="verify-result font-important-info" v-show="!email">
              您的學號可能輸入錯誤，請至翰林雲端學院登入確認後再次嘗試，若仍無法登入，請洽雲端客服。
            </span>
          </mu-col>
        </mu-row>
      </div>
    </mu-container>
  </article>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'LineBindingConfirm',
    data () {
      return {
        email: ''
      }
    },

    props: {
      studentCard: String,
      role: String
    },

    computed: mapState('binding', ['studentCardAuthenticationMapping']),

    methods: {
      isRoleBoundSameStudentCard () {
        let authentication = this.studentCardAuthenticationMapping[this.studentCard]
        /*
         * 同一學號，家長不能綁定兩次
         */
        if (authentication && authentication.role === 'parent' && authentication.role === this.role) {
          this.$emit('is-show-completed-btn', '')
          this.$emit('is-show-query-profiles-btn')
          return true
        }
        return false
      },

      retrieveEmail () {
        let vueModel = this
        if (vueModel.email) {
          return
        }

        vueModel
          .axios({
            method: 'get',
            url: `/linebot/lineBinding/${this.studentCard}`,
          })
          .then(response => {
            let jsonData = response.data

            // 查詢成功，jsonData.content 即 email
            if (jsonData.message.indexOf('success') > 0) {
              let specificUser = jsonData.content
              vueModel.email = specificUser.email
              vueModel.$emit('is-show-completed-btn', specificUser)
            }
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
  }
</script>

<style lang="less">
  #line-binding-confirm .container {
    font-size: 1.4em;
  }

  #line-binding-confirm {
    span {
      font-weight: 500;
    }

    .info {
      color: #7f393b;
      font-size: 1.1em;
      word-break: break-all;
    }
  }
</style>
