<template>
  <div @click="student.role = ''">
    <div id="title-area">
      <p class="title">請選擇你的身份!</p>
      <span>會員升級綁定</span>
    </div>

    <!-- 選擇身份 -->
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
    nextStep() {
      this.handleNext()
    },

    ...mapActions('step', {
      handleNext: 'forwardStepAction',
      resetStepAction: 'resetStepAction'
    })

  },
  computed: mapState('binding', ['student'])
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

.title {
  color: #01579b;
}

</style>