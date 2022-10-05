<template>
  <div>
    <!-- 標題 -->
    <div id="title-area">
      <p class="title">請輸入欲綁定的學號!</p>
      <span>會員升級綁定</span>
    </div>

    <p>
      <LineBindingInput @given-student-card="givenStudentCard"
                        @given-mobile="givenMobile"></LineBindingInput>
    </p>

    <!-- 輸入手機號碼但查詢不到學號 -->
    <h1 v-if="isStudentCardNotExists"> 該手機號碼查無任何學號，請重新再試 </h1>
    <div v-else>
      <mu-select v-if="isQueryMultipleStudent"
                 @change="checkSelected"
                 v-model="selected"
                 :error-text="errorText">
        <mu-option disabled value="" label="請選擇帳號"></mu-option>
        <mu-option v-for="student in students"
                   :key="student.studentCard"
                   :value="student.studentCard"
                   :label="student.email"></mu-option>
      </mu-select>
    </div>
    <div class="button-div">
      <mu-button @click="goToPreviousStep" class="color-primary btn_style back" v-if="!isAlreadyBinding">
        上一步
      </mu-button>
      <mu-button @click="nextStep" class="btn_style next" v-if="isShowNextToConfirmBtn">下一步</mu-button>
    </div>
  </div>
</template>

<script>
import LineBindingInput from '@/components/line-binding/LineBindingInput'
import {mapActions, mapState} from "vuex";

export default {
  name: "BindingProcedure",
  components: {
    LineBindingInput
  },

  props: ['isAlreadyBinding'],

  data() {
    return {
      isShowNextToConfirmBtn: false,
      isQueryMultipleStudent: false,
      isStudentCardNotExists: false,
      students: [],
      selected: '',
      errorText: ''
    }
  },
  methods: {
    givenStudentCard(studentCard) {
      this.isShowNextToConfirmBtn = !!studentCard;
      this.student.mobile = ''
      this.student.studentCard = studentCard
      // 先觸發手機查詢到多位學生後，又切回選擇學號，需把該select 移除
      this.isQueryMultipleStudent = false
    },

    givenMobile(mobile) {
      // 若手機不符合格式，移除下一步的Button
      this.isShowNextToConfirmBtn = !!mobile
      // 輸入手機號碼時，學號選單不應該存在
      this.isQueryMultipleStudent = false
      // 在輸入手機號碼時，隱藏學號找不到的訊息
      this.isStudentCardNotExists = false
      this.student.studentCard = ''
      this.student.mobile = mobile
    },

    goToPreviousStep() {
      this.isShowNextToInputBtn = false
      this.handlePrevious()
      this.student.role = ''
      this.student.studentCard = ''
      this.student.mobile = ''
    },

    nextStep() {
      this.checkStudentsCardWithMobile()

      // 有選擇學號後 進行下一步，例如手機查詢到多位學生，確保select選單有選擇帳號
      if (this.student.studentCard) {
        this.handleNext()
      }
    },

    checkStudentsCardWithMobile() {
      // 還沒選擇學號 且 有輸入手機號碼，用手機號碼查詢學生是否有多位的情況
      if (!this.student.studentCard && this.student.mobile) {
        this.$axios(
            {
              method: 'get',
              url: `/linebot/lineBinding/students-by-mobile?mobile=${this.student.mobile}`,
            }
        ).then(
            response => {
              if (response.data.content) {
                this.students = response.data.content
                if (this.students.length > 1) {
                  // 跳出select 選單
                  this.isQueryMultipleStudent = true
                  // reset select選單為 default
                  this.selected = ''
                  this.errorText = '請選擇欲綁定的一位學生帳號'
                  this.isStudentCardNotExists = false
                }
              } else {
                this.isStudentCardNotExists = true
              }
            }
        ).catch(error => {
          console.error(error)
          this.isStudentCardNotExists = true
        })
      }
    },

    checkSelected() {
      // 選擇學號，只有一開始會有default 未選擇的情況，因此才不用if else
      // select只要觸發change 代表有選到學號，即可將errorText 清空
      this.student.studentCard = this.selected
      this.errorText = ''
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      handlePrevious: 'backwardStepAction'
    }),

  },

  computed: mapState('binding', ['student'])
}
</script>

<style scoped>
#title-area {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.button-div {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.title {
  color: #01579b;
}



</style>