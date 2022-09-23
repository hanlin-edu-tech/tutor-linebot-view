<template>
  <div>
    <mu-icon value="arrow_back" size="36" @click="$emit('go-back')"></mu-icon>
    <h1> 新手綁定優惠方案 </h1>
    <br>

    <h1> 優惠卷: </h1>
    <h1> 折扣碼: {{ coupon.code }} </h1>
    <h1> 折扣: {{ coupon.discount }}折 </h1>
    <h1> 日期: {{ coupon.expireDate }} </h1>
    <h1> 狀態: {{ coupon.isAvailable == 'undefined' ? this.coupon.isAvailable : "不可使用" }} </h1>
    <h1> 剩餘日期: {{ computeRemainingDate }}天 </h1>
    <h1> 試用產品: {{ coupon.description.applicable }} </h1><br><br>
    <h1> 推薦課程: </h1>

    <br>
    <br>
    <br>

    <h1> 優惠卷名稱: {{ coupon.name }} </h1>

    <h3> 使用規則 </h3>
    <div>
      <p v-for="rule in this.coupon.description.rules.split('<br>')">
        {{ rule }}
      </p>
    </div>
    <br>
    <br>
    <br>


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