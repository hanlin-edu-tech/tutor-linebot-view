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
      <mu-button @click="inputToPrevious" color="lightBlue" round class="color-primary" v-if="!isAlreadyBinding">上一步</mu-button>
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

    inputToPrevious() {
      this.isShowNextToInputBtn = false
      this.handlePrevious()
      this.student.role = ''
      this.student.studentCard = ''
      this.student.mobile = ''
    },

    nextStep() {
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
  margin-top: 20px;
}

.title {
  color: #01579b;
}

</style>