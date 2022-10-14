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
        <p>{{ computeRemainingDate(coupon.date.disable) > 10 ? '可使用' : '即將失效' }}</p>
      </li>
      <!-- 剩餘日期 -->
      <li>
        <span>剩餘日期:</span>
        <p>{{ computeRemainingDate(coupon.date.disable) }}天</p>
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
import couponService from "@/service/coupon-service";

export default {
  name: "CouponDetail",
  mixins: [couponService],

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
    const grade = this.mappingToGrade(this.studentEnterYear)
    this.recommendCourseWithGrade(grade)
  },

  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.$refs.couponCode.textContent)
      this.isCopyToClipboard = true
      setTimeout(function () {
        this.isCopyToClipboard = false
      }.bind(this), 1000)
    },

    mappingToGrade(enterYearString) {
      // 先將入學年 轉換為 較符合現實年級，較好做邏輯的計算
      const enterYear = parseInt(enterYearString)
      if (enterYear === -1) {
        return enterYear
      }

      const day = new Date()
      const year = day.getFullYear()
      const elementarySchoolFirstGrade = year - 1911

      const gradeList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

      return gradeList[elementarySchoolFirstGrade - enterYear]
    },

    recommendCourseWithGrade(grade) {
      // 優惠券顯示規則是 小學生 就撈小學 不用細分年級，國中高中以此類推
      // 但要額外處理 小六 國三 高三這種 即將畢業的年級，例如小六 超過 6月 就升為國一 因此要額外處理


      // 轉換適用產品中的年級
      const products = this.coupon.applicableProductSets.map(
          item => ({id: item.id, imageUrl: item.imageUrl,  enterYear: this.mappingToGrade(item.enterYear)})
      )

      const day = new Date()
      const graduatePadding = day.getMonth() > 6 ? 1 : 0
      const padding = day.getMonth() > 6 ? 3 : 0

      let sorted = []

      // 小一 ~ 小五 只撈國小課程 國一 ~ 國二 只撈國中課程 高一 ~ 高三 只撈高中課程(目前只有到高中課程，也沒大學課程，因此統一撈高中課程)
      if (products.length > 0) {
        switch (true) {
          case (grade >= 1 && grade <= 5):
            sorted = products.filter(item => (item.enterYear >= 1) && (item.enterYear <= 5))
            break
          case (grade === 6):
            sorted = products.filter(item => (item.enterYear >= grade + graduatePadding) && (item.enterYear <= grade + padding))
            break
          case (grade >= 7 && grade <= 8):
            sorted = products.filter(item => (item.enterYear >= 7) && (item.enterYear <= 9))
            break
          case (grade === 9):
            sorted = products.filter(item => (item.enterYear >= grade + graduatePadding) && (item.enterYear <= grade + padding))
            break
          case (grade >= 10 && grade <= 12):
            sorted = products.filter(item => (item.enterYear >= 10) && (item.enterYear <= 12))
            break
        }
      }

      // 隨機取五樣
      if (sorted.length >= 5) {
        for (let i = 0; i < sorted.length; i++) {
          const random = Math.floor(Math.random() * 5)
          const randomItem = sorted[random]
          this.sortedCouponArray.push(randomItem)
        }
      } else {
        this.sortedCouponArray = sorted
      }

    },

    // 待確定還會再更改
    goCoursePage(id) {
      window.open(`https://${this.host}/app/online-showcase/product-info.html?id=${id}`, '_blank')
    }

  }

}
</script>

<style lang="less" scoped>
// 優惠券內頁
.coupon-in-page {
  position: relative;
  height: 100vh;
  max-width: 600px;
  margin: auto;
}

// 標題區
.titarea {
  position: relative;
  margin: 16px 0px;
}

.titarea > i {
  position: absolute;
  color: var(--deepGreyColor);
  left: 0;
  top: 50%;
  font-size: 20px !important;
  width: 24px !important;
  height: 24px !important;
  border: 2px var(--deepGreyColor) solid;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
}

.titarea h1 {
  margin: auto;
  text-align: center;
  padding: 0px 32px;
  font-size: 20px;
  color: var(--blueColor);
}

// 優惠碼
.couponarea {
  position: relative;
}

.couponarea > span {
  font-size: 16px;
  font-weight: 500;
  color: var(--deepGreyColor);
}

.coupon_code {
  margin: 12px 0px;
  display: flex;
  justify-content: space-between;
}

.coupon_code > p {
  margin: 0;
  width: calc(100% - 40px);
  height: 36px;
  background-color: var(--whiteColor);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon_code > img {
  width: 36px;
  height: 36px;
  padding: 6px;
  background-color: var(--deepGreyColor);
  border-radius: 4px;
}

// 折扣碼
.coupon_code > p span {
  color: var(--orangeColor);
  font-weight: bold;
  font-size: 14px;
}

.coupon_code > p i {
  width: 36px;
  height: 36px;
  color: var(--deepWhiteColor);
  font-size: 24px;
  background-color: var(--deepGreyColor);
}

// 複製提示
.notice-ui {
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
.notice-ui.noNavbar {
  top: 85%;
}

span.notice {
  display: block;
  padding: 8px 16px;
  color: #333;
}

// 資訊欄
ul.discount_detail {
  list-style: none;
  padding: 0;
  margin: 6px 0px 32px;
}

ul.discount_detail > li {
  display: flex;
  padding: 12px 0px;
  color: var(--deepGreyColor);
  font-size: 14px;
  padding-left: 20px;
  position: relative;
}

// 藍點
ul.discount_detail > li::before {
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
ul.discount_detail > li::after {
  content: "";
  width: 1px;
  height: 16px;
  position: absolute;
  left: 4px;
  bottom: 0;
  transform: translateY(50%);
  background-color: var(--greyColor);
}

ul.discount_detail > li:last-of-type::after {
  content: unset;
}

ul.discount_detail > li span {
  min-width: 32px;
}

ul.discount_detail > li p {
  margin: 0;
  font-weight: bold;
  margin-left: 8px;
}

// 推薦課程輪播標題
span.carouselarea {
  font-size: 16px;
  font-weight: 500;
  color: var(--deepGreyColor);
}

</style>