<template>
  <section id="profile" v-if="isInitial">

    <AccountBinding v-if="currentTab === 'accountBinding'" @reset-to-coupons="currentTab = 'coupons'"></AccountBinding>
    <Coupons v-if="currentTab === 'coupons'"></Coupons>
    <PersonalProfile v-if="currentTab === 'personalProfile'"></PersonalProfile>

    <!-- navbar -->
    <div class="navbar">
      <div class="navbar_in">
        <!-- 身分為學生時加disable樣式 -->
        <div class="item" :class="{disable: isStudent}">
          <mu-button class="item_button"
                     @click="isStudent ? null : currentTab = 'accountBinding'"
                     :class="{selected: currentTab === 'accountBinding'}">
            帳號一覽
          </mu-button>
        </div>
        <div class="item">
          <mu-button class="item_button"
                     @click="currentTab = 'coupons'"
                     :class="{selected: currentTab === 'coupons'}">
            優惠券
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
import AccountBinding from "@/components/account-management/AccountBinding"
import Coupons from "@/components/account-management/Coupons"
import PersonalProfile from "@/components/account-management/PersonalProfile"
import {mapState} from "vuex"
import dayjs from "dayjs"
import couponService from "@/service/coupon-service"

export default {
  name: 'Profile',
  mixins: [couponService],
  components: {Coupons, AccountBinding, PersonalProfile},

  data() {
    return {
      currentTab: 'coupons',
      lineUserId: this.$route.params.specificLineUser,
      currentStudentCard: this.$route.params.studentCard,
      isStudent: false,
      // 讓身份是學生時，帳號一覽上的css做出的遮罩效果，在畫面一宣染就遮住的同步動作
      isInitial: false
    }
  },

  async created() {
    try {
      await this.$store.dispatch('common/initStudentsWithLineUser', this.lineUserId)
      let currentStudentExists = false


      for (let i = 0; i < this.students.length; i++) {
        const studentCard = this.students[i].studentCard
        const coupons = await this.searchCouponListWithStudentCard(studentCard)
        await this.$set(this.students[i], 'coupons', coupons)
      }

      if (this.students.length > 0) {
        // 按照 createTime 排序，確保取的是一開始綁定的身份
        const sortedStudents = this.students
            .sort((studentA, studentB) => dayjs(studentA.createTime).diff(dayjs(studentB.createTime), 'second'))
        this.isStudent = sortedStudents[0].authentications[0].role.toLowerCase() !== 'parent'
      } else {
        await this.$router.replace(`/lineBinding/${this.lineUserId}`)
      }

      for (let student of this.students) {
        if (student.studentCard === this.currentStudentCard) {
          currentStudentExists = true
          break
        }
      }

      if (!currentStudentExists) {
        alert('學生卡號不在學生清單中，請選擇欲查詢的帳號')
        this.currentTab = 'accountBinding'
      }

      this.isInitial = true
    } catch (error) {
      console.error(error)
    }
  },

  computed: {
    ...mapState('common', ['students'])
  }

}
</script>

<style lang="less" scoped>
.navbar {
  width: 100%;
  // max-width: 1000px;
  // margin-left: -5%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.navbar_in {
  display: flex;
  width: 100%;
  padding: 0px 12px;
}

.item {
  width: 33.3%;
  padding: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mu-raised-button {
  width: 100%;
  background-color: unset;
  border-radius: 5px;
  box-shadow: unset;
  transition: 0.3s ease all;
}

.mu-raised-button:active {
  box-shadow: inset 4px 2px #00000050;
}

.item_button {
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
.item_button::before {
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
.item:nth-of-type(1) .item_button::before {
  background-image: url(../asset/icon/link_default.svg);
}

.item:nth-of-type(2) .item_button::before {
  background-image: url(../asset/icon/discount_default.svg);
}

.item:nth-of-type(3) .item_button::before {
  background-image: url(../asset/icon/account_default.svg);
}

// active樣式
.item:nth-of-type(1) .item_button.selected::before {
  background-image: url(../asset/icon/link_active.svg);
}

.item:nth-of-type(2) .item_button.selected::before {
  background-image: url(../asset/icon/discount_active.svg);
}

.item:nth-of-type(3) .item_button.selected::before {
  background-image: url(../asset/icon/account_active.svg);
}

@media screen and(max-width: 640px) {
  .navbar {
    margin-left: -5%;
    left: unset;
  }
}

@media screen and(max-width: 425px) {
  .navbar {
    margin-left: -7.5%;
  }
}

// 身份為學生時
.item.disable > button {
  pointer-events: none;
  background-color: #DBDBDB !important;
  color: #a8a8a8 !important;
}

.item.disable .item_button::before {
  background-image: url(../asset/icon/link_default.svg) !important;
}

.item.disable > button:active {
  box-shadow: none !important;
}

</style>
