<template>
  <div>
    <div id="title-area">
      <p class="title">請選擇你的身份!</p>
      <small>- 會員升級綁定 -</small>
    </div>

    <div class="role">
      <img id="studentImage"
           src="../../static/img/student.png"
           @click="checkSelectStatus"
           v-bind:class="{selected: selectedRole === 'student'}">

      <img id="parentImage"
           src="../../static/img/parents.png"
           @click="checkSelectStatus"
           v-bind:class="{selected: selectedRole === 'parent'}">
    </div>

    <div class="button-div">
      <mu-button @click="nextStep" color="orange" round v-if="selectedRole !== ''">下一步</mu-button>
    </div>

  </div>

</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "ChooseRole",
  data() {
    return {
      selectedRole: ''
    }
  },

  methods: {
    checkSelectStatus(event) {
      if (event.target.id === "studentImage")
        this.selectedRole = this.selectedRole === 'student' ? '' : 'student'

      if (event.target.id === "parentImage")
        this.selectedRole = this.selectedRole === 'parent' ? '' : 'parent'
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
      this.handleNext()
      this.assignRoleAction(this.selectedRole)
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      resetStepAction: 'resetStepAction'
    }),

    ...mapActions('binding', ['assignStudentAction', 'assignRoleAction'])
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