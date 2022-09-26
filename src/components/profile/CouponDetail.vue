<template>
  <div>
    <mu-icon value="arrow_back" size="36" @click="$emit('go-back')"></mu-icon>
    <h1> 新手綁定優惠方案 </h1>
    <br>

    <h1> 優惠卷: </h1>
    <div>
      <h1 @click="copyToClipboard"> 折扣碼: <span ref="couponCode"> {{ coupon.code }} </span>
        <mu-icon size="30" value="description"></mu-icon>
      </h1>
      <h1 v-if="isCopyToClipboard" style="color: orange"> 已複製到剪貼簿(示範用) </h1>
    </div>
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

  data() {
    return {
      isCopyToClipboard: false
    };
  },

  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.$refs.couponCode.textContent)
      this.isCopyToClipboard = true
      setTimeout(function() {
        this.isCopyToClipboard = false
      }.bind(this),1000)

    },
  },

  computed: {
    computeRemainingDate() {
      return dayjs(this.coupon.expireDate).diff(dayjs(), 'days')
    }
  }
}
</script>

<style scoped>
</style>