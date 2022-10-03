<template>
  <article id="line-binding-confirm" class="font-secondary-info">
    <mu-container>
      <mu-row v-if="isStudentCardNotExist">
        <StudentCardNotExist></StudentCardNotExist>
      </mu-row>
      <mu-row v-else-if="isBoundSameStudentTwice()">
        <BoundSameStudentTwice :line-user-id="lineUserId"></BoundSameStudentTwice>
      </mu-row>
      <mu-row v-else>
        <div>
          <div>
            <div id="title-area">
              <p class="title">資料確認!</p>
              <span>會員升級綁定</span>
            </div>
            <mu-row>
              <mu-col class="textarea" span="12">
                以下為您輸入的資訊所對應之 E-Mail，請再次確認是否正確！
              </mu-col>
            </mu-row>
            <mu-row>
              <mu-col class="personal-list" span="12">
                <div class="personal-list-in">
                  <mu-icon class="resize" size="18" value="circle" color="#01579b"></mu-icon>
                  學號：<span class="font-important-info"> {{ student.studentCard }} </span>
                </div>
                <div class="personal-list-in">
                  <mu-icon class="resize" size="18" value="circle" color="#01579b"></mu-icon>
                  帳號：{{ retrieveEmail() }}<span class="font-important-info"> {{ student.email }} </span>
                </div>
              </mu-col>
            </mu-row>

            <div class="button-div">
              <mu-button @click="goToPreviousStep" class="btn_style back color-primary">上一步</mu-button>
              <mu-button @click="bindingCompleted" class="btn_style next color-primary" v-if="isCompleted">完成
              </mu-button>
            </div>
          </div>
        </div>
      </mu-row>
    </mu-container>
  </article>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import BoundSameStudentTwice from "@/components/line-binding/failure-situation/BoundSameStudentTwice";
import StudentCardNotExist from "@/components/line-binding/failure-situation/StudentCardNotExist";

export default {
  name: 'LineBindingConfirm',
  components: {StudentCardNotExist, BoundSameStudentTwice},
  props: {
    lineUserId: String
  },

  data() {
    return {
      isBoundStudentTwice: false,
      isCompleted: false,
      isStudentCardNotExist: false
    }
  },

  async created() {
    // 檢查該學號是否存在
    try {
      const response = await this.$axios({
        method: 'get',
        url: `/linebot/lineBinding/user?studentCard=${this.student.studentCard}`
      })

      this.isStudentCardNotExist = response.data.message.indexOf('failure') > 0
    } catch (error) {
      console.error(error)
      this.isStudentCardNotExist = true
    }
  },

  methods: {
    isBoundSameStudentTwice() {
      // LineBinding created時 就會先取得該line id 下的所有學號
      if (this.student.studentCards.length > 0) {
        for (let i = 0; i < this.student.studentCards.length; i++) {
          /*
           * 綁定同學號兩次
           */
          if (this.student.studentCards[i] === this.student.studentCard) {
            return true
          }
        }
      }
      return false
    },

    retrieveEmail() {
      this.$axios(
          {
            method: 'get',
            url: `/linebot/lineBinding/user?studentCard=${this.student.studentCard}&mobile=${this.student.mobile}`,
          }
      ).then(
          response => {
            const jsonData = response.data

            if (jsonData.message.indexOf('success') > 0) {
              const specificUser = jsonData.content
              this.student.email = specificUser.email
              this.student.studentCard = specificUser.studentCard
              this.student.mobile = specificUser.mobile
              this.student.name = specificUser.name
            }
          }
      ).catch(error => {
        console.error(error)
      })
    },

    goToPreviousStep() {
      this.student.studentCard = ''
      this.student.mobile = ''
      this.handlePrevious()
    },

    bindingCompleted() {
      // step +1 改變LineBinding的步驟
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
}

// 資料確認說明
.textarea {
  font-size: 16px;
  color: #A8A8A8;
}

// 個人資訊表
.personal-list {
  margin: 16px 0px;
  font-size: 16px;
}

.personal-list-in {
  margin: 10px 0px;
  position: relative;
}

// 裝飾線
.personal-list-in::after {
  content: "";
  display: block;
  width: 1px;
  height: 10px;
  background-color: #DBDBDB;
  position: absolute;
  left: 6px;
  bottom: -6px;
}

.personal-list-in:last-of-type:after {
  content: unset;
}

// 符號
.mu-icon.resize {
  font-size: 14px !important;
  width: 14px !important;
  height: 14px !important;
  margin-right: 4px;
}

// 文字
.font-important-info {
  font-size: 16px;
  font-weight: bold !important;
}
</style>
