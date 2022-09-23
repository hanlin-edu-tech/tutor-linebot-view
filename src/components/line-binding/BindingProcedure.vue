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
    
    <!-- 按鈕區塊 -->
    <div class="button-div">
      <mu-button class="color-primary btn_style back" @click="inputToPrevious">上一步</mu-button>
      <mu-button class="btn_style next" @click="nextStep" v-if="isShowNextToConfirmBtn">下一步</mu-button>
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
  data() {
    return {
      isShowNextToConfirmBtn: false
    }
  },
  methods: {
    givenStudentCard(studentCard) {
      this.isShowNextToConfirmBtn = !!studentCard;
      this.student.mobile = ''
      this.student.studentCard = studentCard
    },

    givenMobile(mobile) {
      this.isShowNextToConfirmBtn = !!mobile;
      this.student.studentCard = ''
      this.student.mobile = mobile
    },

    // 恢復當當前步驟到上個步驟間的 connector line color
    changePreviousConnectorLineColor(color) {
      const activeStepLabel = document.querySelector('span[class="mu-step-label active"]')
      const parentNode = activeStepLabel.parentNode
      const stepConnector = parentNode.previousSibling
      const connectorLine = stepConnector.childNodes[0]
      connectorLine.style.borderColor = color
    },

    // 更改當前步驟到下個步驟間的 connector line color
    changeNextConnectorLineColor(color) {
      const activeStepLabel = document.querySelector('span[class="mu-step-label active"]')
      const parentNode = activeStepLabel.parentNode
      const stepConnector = parentNode.nextSibling
      const connectorLine = stepConnector.childNodes[0]
      connectorLine.style.borderColor = color
    },

    inputToPrevious() {
      this.changePreviousConnectorLineColor('#bdbdbd')
      this.isShowNextToInputBtn = false
      this.handlePrevious()
      this.student.role = ''
      this.student.studentCard = ''
      this.student.mobile = ''
    },

    nextStep() {
      this.changeNextConnectorLineColor('orange')
      this.handleNext()
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
}

.title {
  color: #01579b;
}



</style>