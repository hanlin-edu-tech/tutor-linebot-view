<template>
  <section id="profile">

    <AccountBinding v-if="currentTab === 'accountBinding'"></AccountBinding>
    <Coupons v-if="currentTab === 'coupons'"></Coupons>
    <PersonalProfile v-if="currentTab === 'personalProfile'"></PersonalProfile>

    <br>
    <br>
    <br>

    <mu-button
        @click="currentTab = 'accountBinding'"
        :class="{selected: currentTab === 'accountBinding'}"
        v-if="isParent">帳號綁定
    </mu-button>

    <mu-button
        @click="currentTab = 'coupons'"
        :class="{selected: currentTab === 'coupons'}">優惠卷
    </mu-button>

    <mu-button @click="currentTab = 'personalProfile'"
               :class="{selected: currentTab === 'personalProfile'}">個人資料
    </mu-button>

  </section>
</template>

<script>
import AccountBinding from "@/views/account-management/AccountBinding"
import Coupons from "./account-management/Coupons"
import PersonalProfile from "@/views/account-management/PersonalProfile"
import {mapActions, mapState} from "vuex";

export default {
  name: 'Profile',
  components: {Coupons, AccountBinding, PersonalProfile},

  data() {
    return {
      currentTab: 'coupons',
      lineUserId: this.$route.params.specificLineUser,
      currentStudentCard: this.$route.params.studentCard,
      isParent: false
    }
  },

  async created() {
    try {
      const response = await this.$axios({
        method: 'get',
        url: `/linebot/profile/${this.lineUserId}`
      })

      const students = response.data.content
      if (students.length !== 0) {
        this.assignStudents(students)
        this.isParent = students[0].authentications[0].role.toLowerCase() === 'parent'
      }
    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    ...mapActions('profile', ['assignStudents'])
  },

  computed: {
    ...mapState('profile', ['students'])
  }

}
</script>

<style scoped>
.selected {
  background-color: orange;
  color: white;
}
</style>
