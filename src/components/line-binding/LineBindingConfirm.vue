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
            <span
                class="verify-result font-important-info">一個雲端學院帳號僅能提供一位學生綁定，請回上一步重新輸入</span>
          </mu-col>
        </mu-row>
        <div v-else>
          <div v-show="student.email && student.studentCard && student.email !== 'empty'">
            <div>
              <div id="title-area">
                <p class="title">資料確認：</p>
                <small>- 會員升級綁定 -</small>
              </div>
              <mu-row>
                <mu-col span="12">
                  以下為您輸入的資訊所對應之 E-Mail，請再次確認是否正確！
                </mu-col>
              </mu-row>
              <mu-row>
                <mu-col span="12">
                  <mu-icon size="18" value="circle" color="#01579b"></mu-icon>
                  學號：<span class="font-important-info"> {{ student.studentCard }} </span>
                  <br>
                  <mu-icon size="18" value="circle" color="#01579b"></mu-icon>
                  帳號：{{ retrieveEmail() }}<span class="font-important-info"> {{ student.email }} </span>
                </mu-col>
              </mu-row>

              <div class="button-div">
                <mu-button @click="inputToPrevious" color="lightBlue" round class="color-primary">上一步</mu-button>
                <mu-button @click="bindingCompleted" color="orange" round v-if="isCompleted">完成</mu-button>
                <mu-button @click="queryProfiles" color="orange" round v-if="isExistStudentCard">帳號查詢</mu-button>
              </div>
            </div>

            <div v-show="student.email && !student.studentCard && student.email !== 'empty'">
              <mu-row>
                <mu-col span="12">
                <span class="verify-result font-important-info">
                  您尚未取得學號，請至翰林雲端學院，若仍無法登入，請洽雲端客服。
                </span>
                </mu-col>
              </mu-row>
            </div>
            <!-- 查無 email -->
            <div v-show="student.email && student.email === 'empty'">
              <mu-row>
                <mu-col span="12">
                <span class="verify-result font-important-info">
                  您的學號可能輸入錯誤，或是手機尚未認證，請至翰林雲端學院登入確認後再次嘗試，若仍無法登入，請洽雲端客服。
                </span>
                </mu-col>
              </mu-row>
            </div>
            <div class="app-center" v-show="!student.email">
              <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
            </div>
          </div>
        </div>
      </div>
    </mu-container>
  </article>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'LineBindingConfirm',

  props: {
    lineUserId: String
  },

  data() {
    return {
      isBoundStudentTwice: false,
      isExistStudentCard: false,
      isCompleted: false
    }
  },

  methods: {
    isLineUserBoundTwice() {
      if (this.student.studentCards.length > 0) {
        for (let i = 0; i < this.student.studentCards.length; i++) {
          /*
           * 同一位 line user 不能綁定同學號兩次
           */
          if (this.student.studentCards[i] === this.student.studentCard) {
            this.isExistStudentCard = true
            return true
          }
        }
        return false
      }
    },

    retrieveEmail() {
      this.$axios(
          {
            method: 'get',
            // url: `/linebot/lineBinding/user?studentCard=${this.student.studentCard}&mobile=${this.student.mobile}`,
            url: `https://www.tbbt.com.tw/linebot/lineBinding/user?studentCard=${this.student.studentCard}&mobile=${this.student.mobile}`,
          }
      ).then(
          response => {
            const jsonData = response.data

            // 查詢成功，jsonData.content 即 email
            if (jsonData.message.indexOf('success') > 0) {
              const specificUser = jsonData.content
              this.student.email = specificUser.email
              this.student.studentCard = specificUser.studentCard
              this.student.mobile = specificUser.mobile
              this.student.name = specificUser.name

              // 學生是否綁定兩次
              this.isBoundStudentTwice = (specificUser.isBoundStudent === true && this.student.role === 'student')
              if (this.isBoundStudentTwice === true) {
                this.$emit('given-email', '')
              } else if (!specificUser.studentCard) {
                this.student.email = 'empty'
              } else {
                this.isCompleted = true
              }
            } else {
              this.student.email = 'empty'
            }
          }
      ).catch(error => {
        console.error(error)
        this.student.email = 'empty'
      })
    },

    inputToPrevious() {
      this.handlePrevious()
    },

    bindingCompleted() {
      // step +1 改變LineBinding的步驟 前往下一步Result
      this.handleNext()
    },

    queryProfiles() {
      this.$router.push(`/profile/${this.lineUserId}`)
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      handlePrevious: 'backwardStepAction'
    }),

  },

  computed: mapState('binding', ['student'])
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
    color: #03a9f4;
    font-size: 20px;
    word-break: break-all;
  }
}

#title-area {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.title {
  color: #01579b;
}

.button-div {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
