<template>
  <div>
    {{ findCurrentStudent }}
    <h1> 歡迎來到翰林雲端學院! </h1>
    大頭照: <img :src="currentStudent.defPic">
    <h1>e幣: {{ currentStudent.coins }}</h1>
    <h1>寶石: {{ currentStudent.gems }}</h1>
    <h1>Email: {{ currentStudent.email }}</h1>
    <h1>學號: {{ currentStudent.studentCard }}</h1>
    <h1>身份: 學生</h1>
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