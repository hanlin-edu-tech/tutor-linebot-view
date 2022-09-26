<template>
  <div>
    <div id="title-area">
      <p class="title">請輸入欲綁定的學號：</p>
      <small>- 會員升級綁定 -</small>
    </div>

    <p>
      <LineBindingInput @given-student-card="givenStudentCard"
                        @given-mobile="givenMobile"></LineBindingInput>
    </p>

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

    <div class="button-div">
      <mu-button @click="goToPreviousStep" color="lightBlue" round class="color-primary" v-if="!isAlreadyBinding">上一步</mu-button>
      <mu-button @click="nextStep" color="lightBlue900" round v-if="isShowNextToConfirmBtn">下一步</mu-button>
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

  props:['isAlreadyBinding'],

  data() {
    return {
      isShowNextToConfirmBtn: false,
      isQueryMultipleStudent: false,
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
      this.isShowNextToConfirmBtn = !!mobile;
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
      this.checkStudentsCountWithMobile()

      // 有選擇學號後 進行下一步，例如手機查詢到多位學生，確保select選單有選擇帳號
      if (this.student.studentCard) {
        this.handleNext()
      }
    },

    checkStudentsCountWithMobile() {
      // 還沒選擇學號 且 有輸入手機號碼，用手機號碼查詢學生是否有多位的情況
      if (!this.student.studentCard && this.student.mobile) {
        this.$axios(
            {
              method: 'get',
              url: `/linebot/lineBinding/students-by-mobile?mobile=${this.student.mobile}`,
            }
        ).then(
            response => {
              this.students = response.data.content
              if (this.students.length > 1) {
                // 跳出select 選單
                this.isQueryMultipleStudent = true
                // reset select選單為 default
                this.selected = ''
                this.errorText = '請選擇欲綁定的一位學生帳號'
              }
            }
        ).catch(error => {
          console.error(error)
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

  computed: {
    ...mapState('binding', {
      student: state => state.student
    })
  }
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