<template>
  <div>
    <div id="title-area">
      <p class="title">請選擇你的身份!</p>
      <small>- 會員升級綁定 -</small>
    </div>

    <div class="role">
      <img id="studentImage"
           :src="studentImage"
           @click="checkSelectStatus"
           v-bind:class="{selected: student.role === 'student'}">

      <img id="parentImage"
           :src="parentImage"
           @click="checkSelectStatus"
           v-bind:class="{selected: student.role === 'parent'}">
    </div>

    <div class="button-div">
      <mu-button @click="nextStep" color="orange" round v-if="student.role !== undefined">下一步</mu-button>
    </div>

  </div>

</template>

<script>
import studentImage from '../../static/img/student.png'
import parentImage from '../../static/img/parents.png'
import {mapActions} from 'vuex'

export default {
  name: "ChooseRole",

  data() {
    return {
      student: {},
      studentImage: studentImage,
      parentImage: parentImage
    }
  },

  methods: {
    checkSelectStatus(event) {
      // 不能直接reassign field
      const obj = {}

      if (event.target.id === "studentImage")
        obj.role = this.student.role === 'student' ? undefined : 'student'

      if (event.target.id === "parentImage")
        obj.role = this.student.role === 'parent' ? undefined : 'parent'

      this.student = obj
    },

    // 更改當前步驟到下個步驟間的 connector line color
    changeNextConnectorLineColor(color) {
      // 取得目前步驟的 label
      const activeStepLabel = document.querySelector('span[class="mu-step-label active"]')
      // 取得parent node
      const parentNode = activeStepLabel.parentNode
      // 取得下個 sibling node
      const stepConnector = parentNode.nextSibling
      // 取得第一個child node
      const connectorLine = stepConnector.childNodes[0]
      // 更改顏色
      connectorLine.style.borderColor = color
    },

    nextStep() {
      this.changeNextConnectorLineColor('orange')
      this.assignStudentAction(this.student)
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

.role {
  display: flex;
  justify-content: center;
}

img {
  width: 100px;
  height: 100px;
  margin-left: 20px;
  margin-right: 20px;
}

.selected {
  border: 5px solid orange;
}

.button-div {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.title {
  color: #01579b;
}

.connector-line {
  border-color: orange;
}
</style>