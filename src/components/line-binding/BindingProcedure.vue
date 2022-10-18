<template>
  <div>
    <!-- 標題 -->
    <div id="title-area">
      <p class="title">請輸入欲綁定的學號!</p>
      <span>會員升級綁定</span>
    </div>
    
    <div class="input-area">
      <p style="margin-bottom: 0px;">
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

      <!--學號錯誤顯示-->
      <div class="error-bar student-id" v-if="studentCardErrorMsg">
        <span> *{{ studentCardErrorMsg }}</span>
      </div>

      <!--手機錯誤顯示-->
      <div class="error-bar phone" v-if="mobileErrorMsg">
        <span> *{{ mobileErrorMsg }}</span>
      </div>
    </div>

    <!-- 按鈕區塊 -->
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
import {mapActions, mapGetters, mapState} from "vuex"

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
      studentCardErrorMsg: '',
      mobileErrorMsg: ''
    }
  },
  methods: {
    givenStudentCard(resultObj) {
      // 隱藏錯誤訊息
      this.setStudentCardErrorMsg('')
      // 選擇用學號綁定 清空手機號碼
      this.student.mobile = ''
      // 先觸發手機查詢到多位學生後，又切回選擇學號，需把該select 移除
      this.isQueryMultipleStudent = false

      switch (resultObj.status) {
        case 'StudentCardNotExist':
          this.setStudentCardErrorMsg('該學號不存在')
          break
        case 'BoundSameStudentTwice':
          this.setStudentCardErrorMsg('已經綁定過該學號')
          break
        case 'invalid':
          this.setStudentCardErrorMsg('學號輸入錯誤')
          break
        case 'Pass':
          this.isShowNextToConfirmBtn = true
          this.student.studentCard = resultObj.studentCard
      }
    },

    givenMobile(resultObj) {
      // 隱藏錯誤訊息
      this.setMobileErrorMsg('')
      // 輸入手機號碼時，學號選單不應該存在
      this.isQueryMultipleStudent = false
      this.student.studentCard = ''
      this.selected = ''

      switch (resultObj.status) {
        case 'StudentCardNotExistWithMobile':
          this.setMobileErrorMsg('查無該手機號碼')
          break
        case 'invalid':
          this.setMobileErrorMsg('手機號碼格式錯誤')
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
      // 在select選單中 選擇了學號
      this.student.studentCard = this.selected
      // select只要觸發change 代表有選到學號，才判斷該學號是否有重複綁定
      if (this.isBoundSameStudentTwice) {
        this.setMobileErrorMsg('該學號已經綁定過囉')
      } else {
        this.setMobileErrorMsg('')
        this.isShowNextToConfirmBtn = true
      }
    },

    setStudentCardErrorMsg(text) {
      this.mobileErrorMsg = ''
      this.studentCardErrorMsg = text
      this.isShowNextToConfirmBtn = false
    },

    setMobileErrorMsg(text) {
      this.studentCardErrorMsg = ''
      this.mobileErrorMsg = text
      this.isShowNextToConfirmBtn = false
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      handlePrevious: 'backwardStepAction'
    }),

  },

  computed: {
    ...mapState('binding', ['student']),
    ...mapGetters('binding', ['isBoundSameStudentTwice'])
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

.input-area{
  position: relative;
}
  .error-bar{
    font-size: 12px;
    position: absolute;
    bottom: 0px;
    color: #D20000;
  }
  .error-bar.student-id{
    bottom: 8px;
  }
  .error-bar.phone{
    bottom: -1px;
  }
</style>