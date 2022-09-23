<template>
  <div>
    <div id="title-area">
      <p class="title">請選擇你的身份!</p>
      <small>- 會員升級綁定 -</small>
    </div>

    <div class="role">
      <img id="studentImage"
           src="../../static/img/student.png"
           @click.stop="student.role = student.role === 'student' ? '' : 'student'"
           v-bind:class="{selected: student.role === 'student'}">

      <img id="parentImage"
           src="../../static/img/parents.png"
           @click.stop="student.role = student.role === 'parent' ? '' : 'parent'"
           v-bind:class="{selected: student.role === 'parent'}">
    </div>

    <div class="button-div">
      <mu-button @click="nextStep" color="orange" round v-if="student.role !== ''">下一步</mu-button>
    </div>

  </div>

</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "ChooseRole",

  methods: {
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
      this.handleNext()
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      resetStepAction: 'resetStepAction'
    })

  },
  computed: {
    ...mapState('binding', {
      student: state => state.student
    }),
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
</style>