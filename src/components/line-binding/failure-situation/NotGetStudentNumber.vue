<template>
  <mu-row>
    <mu-col span="12">
      <span class="verify-result font-important-info">
        您尚未取得學號，請至翰林雲端學院，若仍無法登入，請洽雲端客服。
      </span>
      <mu-button @click="goToPreviousStep" color="lightBlue" round class="color-primary">上一步</mu-button>
    </mu-col>
  </mu-row>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "NotGetStudentNumber",
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