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

    <div class="button-div">
      <mu-button @click="inputToPrevious" color="lightBlue" round class="color-primary">上一步</mu-button>
      <mu-button @click="nextStep" color="lightBlue900" round v-if="isShowNextToConfirmBtn">下一步</mu-button>
    </div>
  </div>
</template>

<script>
import LineBindingInput from '@/components/line-binding/LineBindingInput'
import {mapActions} from "vuex";

export default {
  name: "BindProcedure",
  components: {
    LineBindingInput
  },
  data() {
    return {
      isShowNextToConfirmBtn: false,
      student: this.$store.state.binding.student
    }
  },
  methods: {
    givenStudentCard(studentCard) {
      if (studentCard) {
        this.isShowNextToConfirmBtn = true
      } else {
        this.isShowNextToConfirmBtn = false
      }
      this.student['mobile'] = ''
      this.student['studentCard'] = studentCard
    },

    givenMobile(mobile) {
      if (mobile) {
        this.student['mobile'] = mobile
        this.isShowNextToConfirmBtn = true
      } else {
        this.isShowNextToConfirmBtn = false
      }
      this.student['studentCard'] = ''
      this.student['mobile'] = mobile
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
      this.student['role'] = ''
      this.student['student'] = ''
      this.student['mobile'] = ''
      this.assignStudentAction(this.student)
    },

    nextStep() {
      this.changeNextConnectorLineColor('orange')
      this.assignStudentAction(this.student)
      this.assignStudentCardsAction(this.student['studentCard'])
      this.handleNext()
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      handlePrevious: 'backwardStepAction',
      resetStepAction: 'resetStepAction'
    }),

    ...mapActions('binding', ['assignBindingAction', 'assignStudentCardsAction', 'assignStudentAction'])
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