<template>
  <article id="line-binding-success">
    <mu-row class="center">
      <mu-col span="12">
        <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="11">
        <div class="center result result-success">
          <mu-icon left value="check_circle" class="icon-global"></mu-icon>
          綁定成功
        </div>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <div class="result-detail">您已成功綁定翰林雲端學院帳號，未來我們將透過 Line 生活圈發布更多優惠及即時訊息，請一定要密切關注喔！</div>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <p class="center coupon" v-if="isRetrieveCoupon">
          您已獲得 1 張 {{discount}} 折優惠券：
          <br /><span class="coupon-code">{{code}}</span>
          <br />使用期限：<span>{{expireDate}}</span>
        </p>
        <p v-else>
          無此優惠卷
        </p>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <p class="center attention">
          ※ 優惠券使用注意事項
        </p>
      </mu-col>
    </mu-row>
  </article>
</template>

<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-tw'

  export default {
    name: 'LineBindingSuccess',
    data () {
      return {
        lineUserId: this.$route.params['specificLineUser'],
        isRetrieveCoupon: false
      }
    },

    /* 使用 store module 的命名空間：binding，來取得此 module 儲存的 lineBindingStudentCard 物件 */
    computed: mapState('binding', ['lineBindingStudentCard']),

    created () {
      let vueModel = this
      let studentCard = vueModel.lineBindingStudentCard.studentCard
      vueModel
        .axios({
          method: 'get',
          url: `https://www.tbbt.com.tw/Coupon?studentCard=${studentCard}&name=Line@綁定優惠`,
        })
        .then(response => {
          let coupons = response.data
          let coupon = coupons[0]
          if (coupon.code) {
            vueModel.isRetrieveCoupon = true
            vueModel.code = coupon.code
            vueModel.discount = coupon.discount
            vueModel.expireDate = dayjs(coupon.date.disable).locale('zh-tw').format('YYYY/MM/DD')
          }
        })
        .catch(function (error) {
          console.error(error)
          document.querySelector('#line-binding-success .mu-circular-progress').remove()
        })
    },

    mounted () {
      document.querySelector('.mu-circular-progress').remove()
    }
  }
</script>

<style lang="less">
  #line-binding-success {
    .coupon {
      color: #7f393b;
      font-size: 1.5em;
      font-weight: 500;

      span {
        font-size: 1.2em;
      }

      span.coupon-code {
        display: inline-block;
        width: 90vw;
        background-color: #f9f6c0;
        padding: 2px 7px;
      }
    }
  }
</style>
