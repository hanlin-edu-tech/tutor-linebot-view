<template>
  <section id="profile">

    <AccountBinding v-if="currentTab === 'accountBinding' && isParent"></AccountBinding>
    <Coupons v-if="currentTab === 'coupons'"></Coupons>
    <PersonalProfile v-if="currentTab === 'personalProfile'"></PersonalProfile>

    <!-- <br>
    <br>
    <br> -->

    <!-- navbar -->
    <div class="navbar">
      <div class="navbar_in">
        <div class="item">
          <mu-button class="item_button"
            @click="currentTab = 'accountBinding'"
            :class="{selected: currentTab === 'accountBinding'}">
            帳號綁定
          </mu-button>
        </div>
        <div class="item">
          <mu-button class="item_button"
            @click="currentTab = 'coupons'"
            :class="{selected: currentTab === 'coupons'}">
            優惠卷
          </mu-button>
        </div>
        <div class="item">
          <mu-button class="item_button" 
            @click="currentTab = 'personalProfile'"
            :class="{selected: currentTab === 'personalProfile'}">
            個人資料
          </mu-button>
        </div>
      </div>
    </div>


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
        url: `linebot/profile/${this.lineUserId}`
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

<style lang="less" scoped>
.navbar{
  width: 100%;
  // max-width: 1000px;
  margin-left: -5%;
  position:fixed;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.1);
  z-index: 999;
}
  .navbar_in{
    display: flex;
    width: 100%;
  } 
    .item{
      width: 33.3%;
      padding: 10px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
      .mu-raised-button{
        width: 100%;
        background-color: unset;
        border-radius: 5px;
        box-shadow: unset;
        transition: 0.3s ease all;
      }
        .mu-raised-button:active{
          box-shadow: inset 4px 2px #00000050;
        }
      .item_button{
        position: relative;
        width: unset;
        width: 80%;
        height: unset;
        padding-top: 24px;
        color: #a8a8a8;
      }
      .selected {
        background-color: #fd9841;
        color: white;
      }
        /* icon */
        .item_button::before{
          content: "";
          display: block;
          width: 28px;
          height: 28px;
          background-size: cover;
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
        }
        // default樣式
        .item:nth-of-type(1) .item_button::before{
          background-image: url(../asset/icon/link_default.svg);
        }
        .item:nth-of-type(2) .item_button::before{
          background-image: url(../asset/icon/discount_default.svg);
        }
        .item:nth-of-type(3) .item_button::before{
          background-image: url(../asset/icon/account_default.svg);
        }
        // active樣式
        .item:nth-of-type(1) .item_button.selected::before{
          background-image: url(../asset/icon/link_active.svg);
        }
        .item:nth-of-type(2) .item_button.selected::before{
          background-image: url(../asset/icon/discount_active.svg);
        }
        .item:nth-of-type(3) .item_button.selected::before{
          background-image: url(../asset/icon/account_active.svg);
        }
@media screen and(max-width: 425px){
  .navbar{
  margin-left: -7.5%;
  }
}

</style>
