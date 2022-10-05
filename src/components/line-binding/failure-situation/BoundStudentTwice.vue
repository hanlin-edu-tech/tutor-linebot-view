<template>
  <mu-col span="12">
    <span class="verify-result font-important-info">一個雲端學院帳號僅能提供一位學生綁定，請回上一步重新輸入</span>
    <mu-button @click="goToPreviousStep" color="lightBlue" round class="color-primary">上一步</mu-button>
  </mu-col>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "BoundStudentTwice",
  methods: {
    goToPreviousStep() {
      this.student.studentCard = ''
      this.student.mobile = ''
      this.handlePrevious()
    },
    ...mapActions('step', {
      handlePrevious: 'backwardStepAction'
    })
  }
}
</script>

<style scoped>

</style>