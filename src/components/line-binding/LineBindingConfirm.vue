<template>
  <article id="line-binding-confirm" class="font-secondary-info" v-if="isInitial">
    <mu-container>
      <mu-row>
        <div>
          <div id="title-area">
            <p class="title">資料確認!</p>
            <span>會員升級綁定</span>
          </div>
          <mu-row>
            <mu-col class="textarea" span="12">
              以下為您輸入的資訊所對應之帳號，請再次確認是否正確！
            </mu-col>
          </mu-row>
          <mu-row>
            <mu-col class="personal-list" span="12">
              <div class="personal-list-in" v-if="student.mobile">
                <mu-icon class="resize" size="18" value="circle" color="#01579b"></mu-icon>
                手機：<span class="font-important-info"> {{ student.mobile }} </span>
              </div>
              <div class="personal-list-in">
                <mu-icon class="resize" size="18" value="circle" color="#01579b"></mu-icon>
                姓名：<span class="font-important-info"> {{ student.name }} </span>
              </div>
              <div class="personal-list-in">
                <mu-icon class="resize" size="18" value="circle" color="#01579b"></mu-icon>
                帳號：<span class="font-important-info"> {{ student.email }} </span>
              </div>
            </mu-col>
          </mu-row>

          <div class="button-div">
            <mu-button @click="goToPreviousStep" class="btn_style back color-primary">上一步</mu-button>
            <mu-button @click="bindingCompleted" class="btn_style next color-primary" v-if="isCompleted">完成
            </mu-button>
          </div>
        </div>
      </mu-row>
    </mu-container>
  </article>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import studentService from "@/service/student-service"

export default {
  name: 'LineBindingConfirm',
  mixins: [studentService],

  props: {
    lineUserId: String
  },

  data() {
    return {
      isBoundStudentTwice: false,
      isCompleted: false,
      isInitial: false
    }
  },

  async created() {
    let studentLoaded = false;
    try {
      // 若沒手機號碼，需在call 一次request 才會取得
      while (!studentLoaded) {
          const student = await this.searchStudentWithStudentCardAndMobile(this.student.studentCard, this.student.mobile)
          this.student.name = student.name
          this.student.email = student.email
          this.student.mobile = student.mobile
          this.isCompleted = true
          studentLoaded = true
      }
      this.isInitial = true
    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    goToPreviousStep() {
      this.student.studentCard = ''
      this.student.mobile = ''
      this.student.email = ''
      this.student.name = ''
      this.handlePrevious()
    },

    async bindingCompleted() {
      const bindingStudentObj = {
        studentCard: this.student.studentCard,
        email: this.student.email,
        name: this.student.name,
        mobile: this.student.mobile,
      }

      bindingStudentObj.authentications = [
        {
          lineUserId: this.lineUserId,
          role: this.student.role
        }
      ]

      try {
        const status = await this.isBindingStudentResult(bindingStudentObj)
        this.$emit('binding-result', status)
      } catch (error) {
        console.error(error)
      }


      if (this.$route.query.redirect && this.$route.query.redirect === 'scheduling') {
          window.location.href = `/app/intelligent-scheduling-system-line/index.html#/account-choice/${this.lineUserId}?redirect=class-schedule-arrangement`
      } else {
          // step +1 改變LineBinding的步驟到第四步讓stepper消失
          this.handleNext()
      }
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
