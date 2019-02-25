<template>
  <section id="coupons">
    <mu-card v-show="status === 'success'" v-for="coupon of coupons" :key="coupon['_id']">
      <mu-card-title title="我目前擁有的優惠卷如下：" :sub-title="coupon.code"></mu-card-title>
      <mu-card-text>
        <div>
          <span class="coupon-field-width">折扣：</span>
          {{ coupon.discount }} 折
        </div>
        <div><span class="coupon-field-width">使用期限：</span>{{ coupon.expireDate }}</div>
        <div><span class="coupon-field-width">狀態：</span>{{ coupon.isAvailable }}</div>
        <div><span class="coupon-field-width">適用產品：</span></div>
        <div class="ellipsis">
          {{ coupon.description['applicable'] }}
          <span id="applicable-detail" style="display: none;"></span>
          <span class="collapse color-primary" style="display: none" v-if="!coupon['isShowApplicable']"
                @click="unfold(coupon, 'isShowApplicable', '#applicable-detail', $event)">展開</span>
          <span class="collapse color-primary" style="display: none" v-else
                @click="fold(coupon, 'isShowApplicable', '#applicable-detail', $event)">收合</span>
        </div>
        <div><span class="coupon-field-width">使用規則：</span></div>
        <div class="ellipsis">
          {{ retrieveRules(coupon.description['rules']) }}
          <span id="rules-detail" style="display: none;">
          </span>
          <span class="collapse color-primary" v-if="!coupon['isShowRules']"
                @click="unfold(coupon, 'isShowRules', '#rules-detail', $event)">展開</span>
          <span class="collapse color-primary" v-else
                @click="fold(coupon, 'isShowRules', '#rules-detail', $event)">收合</span>
          <br />
        </div>
      </mu-card-text>
    </mu-card>
    <DetermineUnsuccessfulStatus :status="status">{{ retrieveFailed }}</DetermineUnsuccessfulStatus>
  </section>
</template>

<script>
  import store from '../../store/store'
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-tw'
  import DetermineUnsuccessfulStatus from '../layout/DetermineUnsuccessfulStatus'

  export default {
    name: 'Coupons',
    data () {
      return {
        status: '',
        empty: '目前沒有優惠券，敬請期待！',
        coupons: [],
        rulesDetail: '',
      }
    },

    components: {
      DetermineUnsuccessfulStatus
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/Coupon?studentCard=${vueModel.$route.params['studentCard']}`
        })
        .then(response => {
          let showCoupons = [], coupons = response.data
          for (let i = 0; i < Object.keys(coupons).length; i++) {
            let coupon = coupons[i]
            // 取回效期尚未截止之優惠卷
            if (!this.determineDeadline(coupon.date)) {
              coupon.discount = this.retrieveDiscount(coupon.discount)
              coupon.expireDate = this.retrieveExpireDate(coupon.date)
              coupon.isAvailable = coupon.times > 0 ? '可使用' : '無法再使用'
              showCoupons.push(coupon)
            }
          }

          vueModel.coupons = showCoupons
          vueModel.status = 'success'
        })
        .catch(error => {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    methods: {
      retrieveDiscount: discount => {
        let discountRegularExp = /^\d\.\d{2}/
        return discountRegularExp.test(discount.toString()) ? discount * 100 : discount * 10
      },

      retrieveExpireDate: couponDate => {
        if (couponDate) {
          let dateDisable = couponDate.disable
          if (dateDisable)
            return dayjs(dateDisable).locale('zh-tw').format('YYYY/MM/DD')
        }
        return '無截止效期'
      },

      determineDeadline (couponDate) {
        let isDeadLine = false
        if (couponDate) {
          let dateDisable = couponDate.disable
          if (dateDisable) {
            isDeadLine = (dayjs(dateDisable).diff(dayjs(), 'days') < 0)
          }
        }
        return isDeadLine
      },

      retrieveRules (rulesContent) {
        let rules = rulesContent.split('<br>')
        let firstRule = rules[0]
        let rulesDetail = ''
        for (let i = 1; i < rules.length; i++) {
          rulesDetail += `<br/>${rules[i]}`
        }
        rulesDetail += '<br/>'
        this.rulesDetail = rulesDetail
        return firstRule
      },

      /* 展開內容 */
      unfold (coupon, isShowCurrentContent, detailId, event) {
        let unfoldTarget = event.currentTarget.parentNode
        unfoldTarget.querySelector(detailId).style.display = ''
        unfoldTarget.style.overflow = 'visible'
        unfoldTarget.style.whiteSpace = 'normal'
        unfoldTarget.style.display = 'block'
        unfoldTarget.style.width = '88vw'

        if (isShowCurrentContent === 'isShowRules') {
          if (!unfoldTarget.querySelector(detailId).innerHTML) {
            unfoldTarget.querySelector(detailId).innerHTML = this.rulesDetail
          }
        }

        this.$set(coupon, isShowCurrentContent, true)
      },

      /* 收合內容 */
      fold (coupon, isShowCurrentContent, detailId, event) {
        let unfoldTarget = event.currentTarget.parentNode
        unfoldTarget.querySelector(detailId).style.display = 'none'
        unfoldTarget.removeAttribute('style')
        this.$set(coupon, isShowCurrentContent, false)
      }
    },

    store
  }
</script>

<style lang="less">
  #coupons {
    font-weight: 500;

    .mu-card-title {
      font-size: 1.4em;
      margin-top: -10px;
      color: #7f393b;
    }

    .mu-card-sub-title {
      text-align: center;
      font-size: 1.5em;
      color: #7f393b;
      background-color: #f9f6c0;
      padding: 2px 7px;
    }

    .mu-card-text {
      margin-top: -20px;
      font-size: 19px;

      span.coupon-field-width {
        display: inline-block;
        height: 30px;
        width: 100px;
        font-size: 19px;
      }

      #master-detail, #rules-detail {
        font-size: 16px;
      }
    }
  }
</style>
