<template>
  <div>
    <h1> 請選擇您要登入的帳號! </h1>
    <div>
      <div v-for="student in students" :class="{'login-student': getCurrentStudentCard === student.studentCard}">
        <router-link
            :to="`/profile/${lineUserId}/${student.studentCard}`">
          <img :src="student.defPic"> <br>
          Email: {{ student.email }} <br>
          學號: {{ student.studentCard }} <br>
          優惠卷數量: {{ calculateCouponsCount(student) }}
        <br><br><br>
        </router-link>
      </div>
    </div>

    <br>
    <br>
    <br>
    <mu-button @click="goToLineBindingPage"
               v-if=""
               color="orange"
               round
               large> 綁定更多帳號</mu-button>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "AccountBinding",

  data() {
    return {
      lineUserId: this.$route.params.specificLineUser
    }
  },

  async created() {
    for (let i = 0; i < this.students.length; i++) {
      const studentCard = this.students[i].studentCard
      const response = await this.$axios({
        method: 'get',
        url: `/shop/coupon/list?studentCard=${studentCard}`
      })
      this.$set(this.students[i], 'coupons', response.data)
    }
  },

  methods: {
    calculateCouponsCount(student) {
      if (student.coupons) {
        return student.coupons.length
      }
    },

    goToLineBindingPage() {
      // 0 的原因是 line binding的create階段 若有綁定過會進行下一步的動作，因此回到0 即可
      this.resetStepAction()
      this.$router.replace(`/lineBinding/${this.lineUserId}`)
    },
    ...mapActions('step', ['resetStepAction'])
  },

  computed: {
    // 每次url變動都會重新抓取
    getCurrentStudentCard() {
      return this.$route.params.studentCard
    },

    ...mapState('profile', ['students'])
  }

}
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
}

.login-student {
  border: 2px solid orange;
}

a {
  color: black;
}

div {
  width: 300px;
}
</style>