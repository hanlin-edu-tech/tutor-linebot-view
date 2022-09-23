<template>
  <div>
    <!-- 標題 -->
    <div id="title-area">
      <p class="title">請選擇你的身份!</p>
      <span>會員升級綁定</span>
    </div>

    <!-- 選擇身份 -->
    <div class="role">
      <div class="role_in">
        <!-- 學生 -->
        <div class="student" id="studentImage"
              v-bind:class="{selected: student.role === 'student'}"
              @click="student.role = student.role === 'student' ? '' : 'student'">
          <img src="../../asset/student.svg">
          <!-- 小標 -->
          <span>我是學生</span>
        </div>
        <!-- 家長 -->
        <div class="parents" id="parentImage"
              v-bind:class="{selected: student.role === 'parent'}"
              @click="student.role = student.role === 'parent' ? '' : 'parent'">
          <img src="../../asset/parents.svg">
          <!-- 小標 -->
          <span>我是家長</span>
        </div>
      </div>
    </div>

    <!-- 按鈕區塊 -->
    <div class="button-div">
      <mu-button class="btn_style next" @click="nextStep" v-if="student.role !== ''">下一步</mu-button>
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
      this.changeNextConnectorLineColor('orange')
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
/* 選擇身份 */
.role {
  display: flex;
  justify-content: center;
}
  .role_in{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
    .student,.parents{
      width: calc(50% - 5px);
      border-radius: 5px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
      padding: 16px 8px;
      background-color: #fff;
      box-shadow: 0 0 15px rgba(0,0,0,0.05);
    }
      /* 被點擊時 */
      .selected {
      border: 1px solid orange;
      }
      .student > img,.parents > img{
        width: 75%;
        height: auto;
        max-width: 100%;
        margin: auto;
      }
      /* 小標 */
      .student > span,.parents > span{
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        color: #0D6CBE;
      }

/* 按鈕區塊 */
.button-div {
  display: flex;
  justify-content: center;
}
.connector-line {
  border-color: orange;
}
</style>