<template>
  <!-- 帳號綁定頁面 -->
  <div class="account_page">
    <!-- 標題區 -->
    <div class="account_title">
      <h1> 請選擇您要登入的帳號! </h1>
    </div>

    <!-- 帳號清單 -->
    <div class="account_list">
      <div class="account_list_in">
        <!-- 帳號 -->
        <div class="account_item"
              v-for="student in students"
              :class="{'login-student': getCurrentStudentCard === student.studentCard}">
          <router-link
              :to="`/profile/${lineUserId}/${student.studentCard}`">
            <!-- 圖片 -->
            <div class="item_img">
              <img :src="student.defPic">
            </div>
            <!-- 內容 -->
            <div class="item_content">
              <div class="content_item">
                <!-- <span>Email:</span> -->
                {{ student.email }}
              </div>
              <div class="content_item">
                <span>學號:</span>{{ student.studentCard }}
              </div>
            </div>
            <!-- 優惠券數量 -->
            <div class="item_count">
              <span>
                {{ calculateCouponsCount(student) }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 按鈕區塊 -->
    <div class="button-div">
      <mu-button @click="goToLineBindingPage"
                v-if=""
                class="btn_style next">
        綁定更多帳號
      </mu-button>
    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import dayjs from "dayjs";

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
      let count = 0
      if (student.coupons) {
        const now = dayjs()
        for (let coupon of student.coupons) {
          if (coupon.date.disable) {
            if (dayjs(coupon.date.disable).isAfter(now)) {
              count++
            }
          }
        }
      }
      return count
    },

    goToLineBindingPage() {
      // 0 的原因是 line binding的create階段 若有綁定過會進行下一步的動作，因此回到0 即可
      this.resetStepAction()
      this.assignContinueBindingAction(true)
      this.$router.replace(`/lineBinding/${this.lineUserId}`)
    },
    ...mapActions('step', ['resetStepAction']),
    ...mapActions('binding', ['assignContinueBindingAction'])
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

<style lang="less" scoped>
/* 帳號綁定頁面 */
.account_page{

}
  /* 標題區 */
  .account_title{
    position: relative;
    margin: 16px 0px;
    h1{
      margin: auto;
      text-align: center;
      padding: 0px 32px;
      font-size: 20px;
      color: #0D6CBE;
    }
  }
  // 帳號清單
  .account_list{
    width: 100%;
  }
    .account_list_in{
      display: flex;
      flex-direction: column;
      margin: -8px 0px;
    }
      // 帳號
      .account_item{
        position: relative;
        border-radius: 5px;
        margin: 8px 0px;
        padding: 14px 52px 14px 12px;
        box-sizing: border-box;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
        // 圖片
        a{
          display: flex;
          align-items: center;
          .item_img{
            width: 60px;
            min-width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 12px;
            img{
              width: 100%;
              max-width: 100%;
              height: auto;
            }
            @media (max-width: 425px){
              margin-right: unset;
            }
          }
          // 內容
          .item_content{
            display: flex;
            flex-direction: column;
            .content_item{
              font-weight: bold;
              span{

              }
            }
            // 帳號樣式
            .content_item:first-of-type{
              font-size: 16px;
              color: #0D6CBE;
              span{
              }
            }
            // 學號,手機樣式
            .content_item:last-of-type{
              font-size: 12px;
              font-weight: 500;
              color: #A8A8A8;
              span{
              }
            }
            @media (max-width: 425px){
                margin-top: 12px;
            }
          }
          // 優惠數量
          .item_count{
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            background-color: #fd9841;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            span{
              color: #fff;
              font-weight: bold;
            }
            @media (max-width: 425px){
              right: calc(50% - 24px);
              top: calc(60px - 8px);
              transform: translateX(50%);
            }
          }
          @media (max-width: 425px){
            flex-direction: column;
          }
        }
        @media (max-width: 425px){
          padding: 14px 12px;
        }
      }
      // active當前帳號樣式
      .login-student {
        border: 2px solid orange;
        box-shadow: unset;
      }

  // 按鈕區塊
  .button-div{
    display: flex;
    justify-content: center;
    margin-top: 28px;
    .btn_style{
      width: 148px;
    }
    .next{
    }
  }

</style>