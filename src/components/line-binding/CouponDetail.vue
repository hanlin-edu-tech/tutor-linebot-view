<template>
  <div>
    <mu-icon value="arrow_back" size="36" @click="$emit('go-back')"></mu-icon>
    <br>
    <span class="pre-line">{{ description }}</span>
  </div>

</template>

<script>
import dayjs from "dayjs";

export default {
  name: "CouponDetail",
  props: {
    coupon: {
      type: Object,
      required: true
    }
  },

  computed: {
    description() {
      return `
        優惠卷:
        折扣: ${this.coupon.discount}
        日期: ${this.coupon.expireDate}
        狀態: ${this.coupon.isAvailable}
        剩餘日期: ${this.computeRemainingDate} 天
        試用產品: ${this.coupon.description['applicable']}

        推薦課程:`
    },
    computeRemainingDate() {
      return dayjs(this.coupon.expireDate).diff(dayjs(), 'days')
    }
  }
}
</script>

<style scoped>

.pre-line {
  white-space: pre-line;
}
</style>