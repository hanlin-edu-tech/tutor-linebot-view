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
        </p>
        <img src="../../asset/icon/copy.svg" alt="icon">
      </div>
    </div>

    <!-- 資訊欄 -->
    <ul class="discount_detail">
      <!-- 折扣 -->
      <li>
        <span>折扣:</span>
        <p v-html="formatDiscount(coupon.discount)"></p>
      </li>
      <!-- 日期 -->
      <li>
        <span>日期:</span>
        <p>{{ formatDate(coupon.date.disable) }}</p>
      </li>
      <!-- 狀態 -->
      <li>
        <span>狀態:</span>
        <p>{{ computeRemainingDate > 10 ? '可使用' : '即將失效'  }}</p>
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
    <div v-if="sortedCouponArray.length > 0">
      <span class="carouselarea"> 推薦課程: </span>
      <mu-carousel class="big-carousel" hide-indicators interval="9999999">
        <mu-carousel-item v-for="coupon in sortedCouponArray">
          <img v-if="coupon.imageUrl" :src="coupon.imageUrl" @click="goCoursePage(coupon.id)">
        </mu-carousel-item>
      </mu-carousel>
    </div>

    <!-- 複製提示 -->
    <div class="notice-ui"><!-- 沒有navbar時加.noNavbar -->
      <span class="notice" v-if="isCopyToClipboard"> 已複製到剪貼簿(示範用) </span>
    </div>

  </div>

</template>

<script>
import dayjs from "dayjs"

export default {
  name: "CouponDetail",
  props: {
    coupon: {
      type: Object,
      required: true
    },
    studentEnterYear: {
      required: true
    }
  },

  data() {
    return {
      isCopyToClipboard: false,
      sortedCouponArray: [],
      imgHeight: 0,
      host: window.location.host
    };
  },

  created() {
    const day = new Date()
    const year = day.getFullYear()
    // 小一入學年
    const elementarySchoolYear =  year - 1911
    // 國一入學年
    const juniorHighSchoolYear =  elementarySchoolYear - 6
    // 高一入學年
    const seniorHighSchoolYear =  juniorHighSchoolYear - 3

    const seniorHighSchoolGraduate = seniorHighSchoolYear - 3

    let sorted = []
    switch (true) {
      //小學
      case (this.studentEnterYear <= elementarySchoolYear && this.studentEnterYear > juniorHighSchoolYear):
        sorted = this.coupon.applicableProductSets.filter(item =>
            item.enterYear <= elementarySchoolYear && item.enterYear > juniorHighSchoolYear)
        break
      //國中
      case (this.studentEnterYear <= juniorHighSchoolYear && this.studentEnterYear > seniorHighSchoolYear):
        sorted = this.coupon.applicableProductSets.filter(item =>
            item.enterYear <= juniorHighSchoolYear && item.enterYear > seniorHighSchoolYear)
        break
      //高中
      case (this.studentEnterYear <= seniorHighSchoolYear && this.studentEnterYear > seniorHighSchoolGraduate):
        sorted = this.coupon.applicableProductSets.filter(item =>
            item.enterYear <= seniorHighSchoolYear && item.enterYear > seniorHighSchoolGraduate)
        break
      //其他 值為 -1
      default:
        sorted = this.coupon.applicableProductSets
        break
    }

    sorted.forEach(item => {
      this.sortedCouponArray.push(item)
    })
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
        return discount + '<span>元</span>'
      }

      const len = discount.toString().split('.')[1].length

      switch (len) {
        case 1:
          discount *= 10
          break
        case 2:
          discount *= 100
          break
        case 3:
          discount *= 1000
          break
      }
      return discount + '<span>折</span>'
    },

    formatDate(day) {
      if (day) {
        return dayjs(day).format('YYYY/MM/DD')
      } else {
        return '無期限'
      }
    },

    // 待確定還會再更改
    goCoursePage(id) {
      window.open(`https://${this.host}/app/online-showcase/product-info.html?id=${id}`, '_blank')
    }
    
  },

  computed: {
    computeRemainingDate() {
      const now = dayjs().locale('zh-tw')
      if (this.coupon.date.disable) {
        return dayjs(this.coupon.date.disable).diff(now, 'day')
      }
    },
  },
}
</script>

<style lang="less" scoped>
// 優惠券內頁
.coupon-in-page{
  position: relative;
  height: 100vh;
  max-width: 600px;
  margin: auto;
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
  margin: 6px 0px 32px;
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
      min-width: 32px;
    }
    ul.discount_detail > li p{
      margin: 0;
      font-weight: bold;
      margin-left: 8px;
    }
// 推薦課程輪播標題
span.carouselarea{
  font-size: 16px;
  font-weight: 500;
  color: var(--deepGreyColor);
}

</style>