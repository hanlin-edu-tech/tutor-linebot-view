<template>
  <div>
    <div v-if="!isClickCouponDetail">
      <h1> 優惠卷專區 </h1>
      <mu-button @click="select = 'available'"
                 :class="{selected: select === 'available'}"
                 round>可使用
      </mu-button>

      <mu-button @click="select = 'invalid'"
                 :class="{selected: select === 'invalid'}"
                 round>已失效
      </mu-button>

      <div v-if="couponsCount === 0"> 目前無優惠券</div>

      <div v-else-if="select === 'available'">
        <div v-for="coupon in greatThanEqualZeroDay" :key="coupon['_id']">
          <div :class="{'close-deadline': coupon.diffDay <= 10}"
               @click="passIdToCouponDetail(coupon['_id'])">
            <h1> 折扣: {{ formatDiscount(coupon.discount) }} </h1>
            <h1> 新手綁定優惠方案: </h1> <br>
            <h1> 開始日期: {{ formatDate(coupon.date.enable) }} </h1>
            <h1> 結束日期: {{ formatDate(coupon.date.disable) }} </h1>

            <h1> 優惠折扣碼 </h1>
            <h1> {{ coupon.code }} </h1>
            <mu-button color="orange">查看詳情</mu-button>
          </div>
        </div>
      </div>

      <div v-else-if="select === 'invalid'">
        <div v-for="coupon in invalidCoupon" :key="coupon['_id']">
          <div>
            <h1>折扣: {{ formatDiscount(coupon.discount) }} </h1>
            <span>
                <h1> 新手綁定優惠方案 </h1> <br>
              <h1> 開始日期: {{ formatDate(coupon.date.enable) }} </h1>
              <h1> 結束日期: {{ formatDate(coupon.date.disable) }} </h1>

                <h1> 優惠折扣碼 </h1>
              <h1> {{ coupon.code }} </h1>
            </span>
            <mu-button color="orange">查看詳情</mu-button>
          </div>
        </div>
      </div>
    </div>

    <CouponDetail v-if="isClickCouponDetail"
                  @go-back="isClickCouponDetail = false"
                  :coupon="clickedCoupon">
    </CouponDetail>
  </div>
</template>

<script>
import CouponDetail from "@/components/profile/CouponDetail";
import dayjs from "dayjs";

export default {
  name: "Coupons",

  components: {CouponDetail},

  data() {
    return {
      select: 'available',
      isClickCouponDetail: false,
      clickedCoupon: {}, // 點擊該coupon 查看詳細資訊
      coupons: [], // 所有coupon
      greatThanEqualZeroDay: {}, // 大於等於0天的coupon
      invalidCoupon: [], // 過期失效的coupon
      currentStudent: {}, // 當前使用的學生
      couponsCount: 0 // coupon array長度
    }
  },

  async created() {
    const currentStudentCard = this.getCurrentStudentCard
    try {
      const response = await this.$axios({
        method: 'get',
        url: `/shop/coupon/list?studentCard=${currentStudentCard}`
      })

      this.coupons = response.data
      // 沒有if判斷 console會報錯
      if (typeof this.coupons === 'object') {
        this.couponsCount = Object.keys(this.coupons).length
      }
    } catch (error) {
      console.error(error)
    }

    const greatThanEqualZeroDayArray = []
    const now = dayjs().locale('zh-tw')
    // 先分兩類 有效跟過期
    for (let coupon of this.coupons) {
      const isGreatThanEqualZeroDay = this.calculateDateDiff(coupon.date.disable, now) >= 0
      const lessThanZeroDay = this.calculateDateDiff(coupon.date.disable, now) < 0
      if (isGreatThanEqualZeroDay) {
        coupon.diffDay = this.calculateDateDiff(coupon.date.disable, now)
        greatThanEqualZeroDayArray.push(coupon)
      }
      if (lessThanZeroDay) {
        this.invalidCoupon.push(coupon)
      }
    }
    this.greatThanEqualZeroDay = greatThanEqualZeroDayArray.sort((couponA, couponB) => {
      return this.calculateDateDiff(couponA.date.disable, now) - this.calculateDateDiff(couponB.date.disable, now)
    })

  },

  methods: {
    passIdToCouponDetail(id) {
      this.isClickCouponDetail = true
      const clickedCoupon = this.coupons.find(coupon => coupon._id === id)
      this.clickedCoupon = clickedCoupon
    },

    formatDiscount(discount) {
      if (Number.isInteger(discount)) {
        return discount + '元'
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
      return discount + '折'
    },

    formatDate(day) {
      if (day) {
        return dayjs(day).format('YYYY-MM-DD')
      } else {
        return '無期限'
      }
    },

    calculateDateDiff(start, end) {
      return dayjs(start).diff(dayjs(end), 'day')
    }
  },

  computed: {
    getCurrentStudentCard() {
      return this.$route.params.studentCard
    }
  }
}
</script>

<style scoped>
/*調整顏色的部分*/
.selected {
  background-color: #01579b;
  color: white;
}

.close-deadline {
  border: 3px solid red;
}
</style>