<template>
  <article id="line-binding-confirm" class="font-secondary-info">
    <mu-container>
      <mu-row v-if="isLineUserBoundTwice()">
        <mu-col span="12">
          <span class="verify-result font-important-info">您已綁定過此帳號囉，請至帳號查詢頁面查看詳情！</span>
        </mu-col>
      </mu-row>
      <div v-else>
        <mu-row v-if="isBoundStudentTwice === true">
          <mu-col span="12">
            <span class="verify-result font-important-info">一個雲端學院帳號僅能提供一位學生綁定，請回上一步重新輸入</span>
          </mu-col>
        </mu-row>
        <div v-else>
          <div v-show="email && showStudentCard && this.email !== 'empty'">
            <mu-row>
              <mu-col span="12">
                以下為您輸入的資訊所對應之 E-Mail，請再次確認是否正確！
              </mu-col>
            </mu-row>
            <mu-row>
              <mu-col span="12">
                學號：<span class="font-important-info">{{ showStudentCard }}</span>
                <br />
                帳號：{{ retrieveEmail() }}
                <span class="verify-result info">{{ email }}</span>
              </mu-col>
            </mu-row>
          </div>
          <div v-show="email && !showStudentCard && this.email !== 'empty'">
            <mu-row>
              <mu-col span="12">
                <span class="verify-result font-important-info">
                  您尚未取得學號，請至翰林雲端學院，若仍無法登入，請洽雲端客服。
                </span>
              </mu-col>
            </mu-row>
          </div>
          <!-- 查無 email -->
          <div v-show="email && this.email === 'empty'">
            <mu-row>
              <mu-col span="12">
                <span class="verify-result font-important-info">
                  您的學號可能輸入錯誤，或是手機尚未認證，請至翰林雲端學院登入確認後再次嘗試，若仍無法登入，請洽雲端客服。
                </span>
              </mu-col>
            </mu-row>
          </div>
          <div class="app-center" v-show="!email">
            <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
          </div>
        </div>
      </div>
    </mu-container>
  </article>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'LineBindingConfirm',
    props: {
      role: String,
      studentCard: String,
      mobile: String,
      lineUserId: String
    },

    data () {
      const vueModel = this
      return {
        email: '',
        isBoundStudentTwice: false,
        showStudentCard: vueModel.studentCard
      }
    },

    computed: mapState('binding', ['studentCards']),

    methods: {
      isLineUserBoundTwice () {
        const vueModel = this
        if (vueModel.studentCards.length > 0) {
          for (let i = 0; i < vueModel.studentCards.length; i++) {
            /*
             * 同一位 line user 不能綁定同學號兩次
             */
            if (vueModel.studentCards[i] === vueModel.studentCard) {
              vueModel.$emit('given-email')
              vueModel.$emit('binding-same-student-card')
              return true
            }
          }
          return false
        }
      },

      retrieveEmail () {
        const vueModel = this
        vueModel.$axios(
          {
            method: 'get',
            url: `/linebot/lineBinding/user?studentCard=${vueModel.studentCard}&mobile=${vueModel.mobile}`,
          }
        ).then(
          response => {
            const jsonData = response.data

            // 查詢成功，jsonData.content 即 email
            if (jsonData.message.indexOf('success') > 0) {
              const specificUser = jsonData.content
              vueModel.email = specificUser.email
              vueModel.showStudentCard = specificUser.studentCard
              // 學生是否綁定兩次
              vueModel.isBoundStudentTwice = (specificUser.isBoundStudent === true && vueModel.role === 'student')
              if (vueModel.isBoundStudentTwice === true) {
                vueModel.$emit('given-email', '')
              } else if (!specificUser.studentCard) {
                vueModel.email = 'empty'
              } else {
                vueModel.$emit('given-email', specificUser)
              }
            } else {
              vueModel.email = 'empty'
            }
          }
        ).catch(error => {
          console.error(error)
          vueModel.email = 'empty'
        })
      }
    }
  }
</script>

<style lang="less">
  #line-binding-confirm .container {
    font-size: 20px;
  }

  #line-binding-confirm {
    span {
      font-weight: 500;
    }

    .info {
      color: #7f393b;
      font-size: 20px;
      word-break: break-all;
    }
  }
</style>
