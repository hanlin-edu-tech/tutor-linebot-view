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

    <div v-if="isQueryMultipleStudent">
      <mu-select @change="checkSelected"
                 v-model="selected">
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

    <!--錯誤顯示-->
    <div v-if="errorMsg">
      <h2> 錯誤顯示： {{ errorMsg }}</h2>
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
      students: [],
      selected: '',
      // 帳號不存在或重複綁定的錯誤提示
      errorMsg: '',
      isNextButtonInitial: false
    }
  },
  methods: {
    givenStudentCard(resultObj) {
      // 隱藏錯誤訊息
      this.errorMsg = ''
      // 選擇用學號綁定 清空手機號碼
      this.student.mobile = ''
      // 先觸發手機查詢到多位學生後，又切回選擇學號，需把該select 移除
      this.isQueryMultipleStudent = false

      switch (resultObj.status) {
        case 'StudentCardNotExist':
          this.setErrorMsg('該學號不存在')
          break
        case 'BoundSameStudentTwice':
          this.setErrorMsg('已經綁定過該學號')
          break
        case 'invalid':
          this.setErrorMsg('學號輸入錯誤')
          break
        case 'Pass':
          this.isShowNextToConfirmBtn = true
          this.student.studentCard = resultObj.studentCard
      }
    },

    givenMobile(resultObj) {
      // 隱藏錯誤訊息
      this.errorMsg = ''
      // 輸入手機號碼時，學號選單不應該存在
      this.isQueryMultipleStudent = false
      this.student.studentCard = ''

      switch (resultObj.status) {
        case 'StudentCardNotExist':
          this.setErrorMsg('查無該手機號碼')
          break
        case 'invalid':
          this.setErrorMsg('手機號碼輸入錯誤')
          break
        case 'Pass':
          this.isQueryMultipleStudent = true
          //顯示在select選單中的資料
          this.students = resultObj.students
          // 存該手機號碼
          this.student.mobile = resultObj.mobile
          break
      }
    },

    goToPreviousStep() {
      this.handlePrevious()
      this.student.role = ''
      this.student.studentCard = ''
      this.student.mobile = ''
    },

    nextStep() {
      // 有選擇學號後 進行下一步，例如手機查詢到多位學生，確保select選單有選擇帳號
      if (this.student.studentCard) {
        this.handleNext()
      }
    },

    checkSelected() {
      // select只要觸發change 代表有選到學號，才判斷該學號是否有重複綁定
      if (this.isBoundSameStudentTwice()) {
        this.setErrorMsg('該學號已經綁定過囉')
      } else {
        this.errorMsg = ''
        // 在select選單中 選擇了學號
        this.student.studentCard = this.selected
        this.isShowNextToConfirmBtn = true
      }
    },

    isBoundSameStudentTwice() {
      // LineBinding created時 就會先取得該line id 下的所有學號
      if (this.student.studentCards.length > 0) {
        for (let i = 0; i < this.student.studentCards.length; i++) {
          /*
           * 綁定同學號兩次
           */
          if (this.student.studentCards[i] === this.selected) {
            return true
          }
        }
      }
      return false
    },

    setErrorMsg(text) {
      this.errorMsg = text
      this.isShowNextToConfirmBtn = false
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