<template>
  <section id="coupons">
    <mu-card v-show="status === 'success'" v-for="coupon of coupons" :key="coupon['_id']">
      <mu-card-title title="我目前擁有的優惠卷如下：" :sub-title="coupon.code"></mu-card-title>
      <mu-card-text>
        <div><span class="coupon-field-width">折扣：</span>{{coupon.discount * 100}} 折</div>
        <div><span class="coupon-field-width">使用期限：</span>{{retrieveExpireDate(coupon.date.disable)}}</div>
        <div><span class="coupon-field-width">狀態：</span>{{isEnabled(coupon.times, coupon.date.disable)}}</div>
        <div><span class="coupon-field-width">適用產品：</span></div>
        <div class="ellipsis">
          翰林雲端學院國小上學期 e 名師課程
          <span id="master-detail" style="display: none">
            <br />國中上學期 e 名師課程
            <br />會考 e 名師課程
            <br />高中上學期 e 名師課程
            <br />學測 e 名師課程
            <br />指考 e 名師課程
          </span>
          <span class="collapse color-primary" v-if="!coupon['isShowSuitable']"
                @click="unfold(coupon, 'isShowSuitable', '#master-detail', $event)">展開</span>
          <span class="collapse color-primary" v-else
                @click="fold(coupon, 'isShowSuitable', '#master-detail', $event)">收合</span>
        </div>
        <div><span class="coupon-field-width">使用規則：</span></div>
        <div class="ellipsis">
          1. 此優惠碼不適用翰林雲端學院下學期 e 名師課程 (全學年課程除外)。
          <span id="rule-detail" style="display: none">
            <br />2. 此優惠碼使用期限至 2018 年 7月 31 日，逾期視同放棄資格，恕不補發。
            <br />3. 此優惠碼不得與其他優惠碼一併使用。
            <br />4. 若有任何問題請撥打 0800-0088-11 或透過官方 Line 帳號與客服聯繫。
            <br />
          </span>
          <span class="collapse color-primary" v-if="!coupon['isShowRule']"
                @click="unfold(coupon, 'isShowRule', '#rule-detail', $event)">展開</span>
          <span class="collapse color-primary" v-else
                @click="fold(coupon, 'isShowRule', '#rule-detail', $event)">收合</span>
          <br />
        </div>
      </mu-card-text>
    </mu-card>
    <div class="app-center" v-show="status !== 'success'">
      <DetermineUnsuccessfulStatus :status="status">{{retrieveFailed}}</DetermineUnsuccessfulStatus>
    </div>
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
        coupons: {}
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
          vueModel.coupons = response.data
          vueModel.status = 'success'
        })
        .catch(function (error) {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    methods: {
      retrieveExpireDate: dateDisable => dayjs(dateDisable).locale('zh-tw').format('YYYY/MM/DD'),
      isDeadLine: dateDisable => dayjs(dateDisable).diff(dayjs(), 'days') < 0,
      isEnabled (times, dateDisable) {
        return times > 0 && !this.isDeadLine(dateDisable) ? '可使用' : '已失效'
      },

      /* 展開內容 */
      unfold (coupon, currentContent, detailId, event) {
        let unfoldTarget = event.currentTarget.parentNode
        unfoldTarget.querySelector(detailId).style.display = ''
        unfoldTarget.style.overflow = 'visible'
        unfoldTarget.style.whiteSpace = 'normal'
        unfoldTarget.style.display = 'block'
        unfoldTarget.style.width = '88vw'
        this.$set(coupon, currentContent, true)
      },

      /* 收合內容 */
      fold (coupon, currentContent, detailId, event) {
        let unfoldTarget = event.currentTarget.parentNode
        unfoldTarget.querySelector(detailId).style.display = 'none'
        unfoldTarget.removeAttribute('style')
        this.$set(coupon, currentContent, false)
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

      #master-detail, #rule-detail {
        font-size: 16px;
      }
    }
  }

</style>
