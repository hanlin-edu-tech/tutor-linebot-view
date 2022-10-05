<template>
  <div class="coupon-in-page">
    <!-- 標題區 -->
    <div class="titarea">
      <mu-icon value="arrow_back" size="36" @click="$emit('go-back')"></mu-icon>
      <h1> 新手綁定優惠方案 </h1>
    </div>
    <!-- 優惠碼 -->
    <div class="couponarea">
      <span> 優惠卷: </span>
      <div class="coupon_code" @click="copyToClipboard">
        <p> 
          <!-- 折扣碼:  -->
          <span ref="couponCode"> {{ coupon.code }} </span>
          <!-- <mu-icon size="30" value="description"></mu-icon> -->
        </p>
        <img src="../../asset/icon/copy.svg" alt="icon">
        <!-- 提示 -->
        <!-- <span class="notice" v-if="isCopyToClipboard" style="color: orange"> 已複製到剪貼簿(示範用) </span> -->
      </div>
    </div>
    
    <!-- 資訊欄 -->
    <ul class="discount_detail">
      <!-- 折扣 -->
      <li>
        <span>折扣:</span>
        <p>{{ formatDiscount(coupon.discount) }}折</p>
      </li>
      <!-- 日期 -->
      <li>
        <span>日期:</span>
        <p>{{ coupon.expireDate }}</p>
      </li>
      <!-- 狀態 -->
      <li>
        <span>狀態:</span>
        <p>{{ coupon.isAvailable == 'undefined' ? this.coupon.isAvailable : "不可使用" }}</p>
      </li>
      <!-- 剩餘日期 -->
      <li>
        <span>剩餘日期:</span>
        <p>{{ computeRemainingDate }}天</p>
      </li>
      <!-- 適用產品 -->
      <li>
        <span>適用產品:</span>
        <p>{{ coupon.description.applicable }}</p>
      </li>
    </ul>

    <!-- 推薦課程輪播 -->
    <span class="carouselarea"> 推薦課程: </span>
    <mu-carousel class="big-carousel big-carousel" hide-indicators interval="9999999">
      <mu-carousel-item v-for="image in courseImages">
        <img :src="image" @click="goCoursePage">
      </mu-carousel-item>
    </mu-carousel>

    <!-- 複製提示 -->
    <div class="notice-ui"><!-- 沒有navbar時加.noNavbar -->
      <span class="notice" v-if="isCopyToClipboard"> 已複製到剪貼簿(示範用) </span>
    </div>

    <!-- <h1> 優惠卷名稱: {{ coupon.name }} </h1>
    <h3> 使用規則 </h3>
    <div>
      <p v-for="rule in this.coupon.description.rules.split('<br>')">
        {{ rule }}
      </p>
    </div> -->
  </div>

</template>

<script>
import dayjs from "dayjs"
import courseImage1 from "../../static/img/course1.png"
import courseImage2 from "../../static/img/course2.png"

export default {
  name: "CouponDetail",
  props: {
    coupon: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isCopyToClipboard: false,
      courseImages: [courseImage1, courseImage2]
    };
  },

  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.$refs.couponCode.textContent)
      this.isCopyToClipboard = true
      setTimeout(function () {
        this.isCopyToClipboard = false
      }.bind(this), 1000)
    },

    formatDiscount(discount) {
      if (Number.isInteger(discount)) {
        return discount
      }

      const len = discount.toString().split('.')[1].length

      switch (len) {
        case 1:
          return discount * 10
        case 2:
          return discount * 100
        case 3:
          return discount * 1000
        default:
          return discount
      }
    },

    goCoursePage() {
      window.open('https://' + this.host + '/app/member-center/login.html', '_blank')
    },
  },

  computed: {
    computeRemainingDate() {
      const now = dayjs().locale('zh-tw')
      // 優惠卷的截止日期 會有兩種存法
      if (this.coupon.expireDate) {
        return dayjs(this.coupon.expireDate).diff(now, 'days')
      }
      if (this.coupon.date.disable) {
        return dayjs(this.coupon.date.disable).diff(now, 'days')
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 優惠券內頁
.coupon-in-page{
  position: relative;
  height: 100vh;
}
// 標題區
.titarea{
  position: relative;
  margin: 16px 0px;
}
  .titarea > i{
    position: absolute;
    color: var(--deepGreyColor);
    left: 0;
    top: 50%;
    font-size: 20px!important;
    width: 24px!important;
    height: 24px!important;
    border: 2px var(--deepGreyColor) solid;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
  }
  .titarea h1{
    margin: auto;
    text-align: center;
    padding: 0px 32px;
    font-size: 20px;
    color: var(--blueColor);
  }

// 優惠碼
.couponarea{
  position: relative;
}
  .couponarea > span{
    font-size: 16px;
    font-weight: 500;
    color: var(--deepGreyColor);
  }
  .coupon_code{
    margin: 12px 0px;
    display: flex;
    justify-content: space-between;
  }
    .coupon_code > p{
      margin: 0;
      width: calc(100% - 40px);
      height: 36px;
      background-color: var(--whiteColor);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .coupon_code > img{
      width: 36px;
      height: 36px;
      padding: 6px;
      background-color: var(--deepGreyColor);
      border-radius: 4px;
    }
    // 折扣碼
    .coupon_code > p span{
      color: var(--orangeColor);
      font-weight: bold;
      font-size: 14px;
    }
    .coupon_code > p i{
      width: 36px;
      height: 36px;
      color: var(--deepWhiteColor);
      font-size: 24px;
      background-color: var(--deepGreyColor);
    }
    // 複製提示
    .notice-ui{
      min-width: 182px;
      position: absolute;
      top: calc(85% - 80px);
      left: 50%;
      transform: translateX(-50%);
      background-color: #fff;
      border-radius: 50px;
      opacity: 0.8;
    }
    // 沒有navbar
    .notice-ui.noNavbar{
      top: 85%;
    }
      span.notice{
        display: block;
        padding: 8px 16px;
        color: #333;
      }
// 資訊欄
ul.discount_detail{
  list-style: none;
  padding: 0;
  margin: 6px 0px;
}
  ul.discount_detail > li{
    display: flex;
    padding: 12px 0px;
    color: var(--deepGreyColor);
    font-size: 14px;
    padding-left: 20px;
    position: relative;
  }
  // 藍點
  ul.discount_detail > li::before{
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--blueColor);
    border-radius: 50%;
  }
  // 延伸線
  ul.discount_detail > li::after{
    content: "";
    width: 1px;
    height: 16px;
    position: absolute;
    left: 4px;
    bottom: 0;
    transform: translateY(50%);
    background-color: var(--greyColor);
  }
  ul.discount_detail > li:last-of-type::after{
    content: unset;
  }
    ul.discount_detail > li span{
    }
    ul.discount_detail > li p{
      margin: 0;
      font-weight: bold;
      margin-left: 4px;
    }
// 推薦課程輪播標題
span.carouselarea{
  font-size: 16px;
  font-weight: 500;
  color: var(--deepGreyColor);
}
</style>