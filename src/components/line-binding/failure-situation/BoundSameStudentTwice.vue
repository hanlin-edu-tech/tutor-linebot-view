<template>
  <mu-col span="12">
    <span class="verify-result font-important-info">該學生帳號已經綁定過，請前去確認</span>
    <br>
    <mu-button @click="queryProfiles" color="lightBlue" round class="color-primary">查看帳號</mu-button>
  </mu-col>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "BoundSameStudentTwice",

  props: ['lineUserId'],

  methods: {
    queryProfiles() {
      this.$router.replace(`/profile/${this.lineUserId}/${this.student.studentCard}`)
    }
  },

  computed: {
    ...mapState('binding', ['student'])
  }
}
</script>

<style scoped>

</style>