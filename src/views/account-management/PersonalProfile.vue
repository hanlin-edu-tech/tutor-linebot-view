<template>
  <div>
    {{ findCurrentStudent }}
    <h1> 歡迎來到翰林雲端學院! </h1>
    大頭照: <img :src="currentStudent.defPic">
    <h1>e幣: {{ currentStudent.coins }}</h1>
    <h1>寶石: {{ currentStudent.gems }}</h1>
    <h1>Email: {{ currentStudent.email }}</h1>
    <h1>身份: {{ currentStudent.role === 'parent' ? '家長' : '學生' }}</h1>
    <h1>等級: {{ currentStudent.rank }}</h1>
    <h1>年級: {{ currentStudent.grade }}</h1>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PersonalProfile",
  data() {
    return {
      currentStudent: {}
    }
  },

  computed: {
    getCurrentStudentCard() {
      return this.$route.params.studentCard
    },
    // 用get開頭命名會造成無窮迴圈
    findCurrentStudent() {
      this.students.find(student => {
        if (student.studentCard === this.getCurrentStudentCard) {
          this.currentStudent = student
        }
      })
    },

    ...mapState('profile', ['students'])
  },
}
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
}
</style>