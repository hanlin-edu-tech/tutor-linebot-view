<template>
  <section id="coupons">
    <article v-if="status === 'success'">
      <mu-card v-for="coupon of coupons" :key="coupon['_id']">
        <mu-card-title title="我目前擁有的優惠卷如下：" :sub-title="coupon.code"></mu-card-title>
        <mu-card-text>
          <span>折扣：</span>{{coupon.discount}}
          <br /><span>使用期限：</span>{{retrieveExpireDate(coupon.date.disable)}}
          <br /><span>狀態：</span>{{isEnabled(coupon.times, coupon.date.disable)}}
          <br /><span>適用產品：</span><span class="ellipsis">適用所有 e 名師課程</span>
          <span class="collapse color-primary" v-if="coupon['suitable'] === true"
                @click="unfold(coupon, 'suitable', $event)">展開</span>
          <span class="collapse color-primary" v-else-if="coupon['suitable'] === false"
                @click="fold(coupon, 'suitable', $event)">收合</span>
          <span class="collapse color-primary" v-else
                @click="unfold(coupon, 'suitable', $event)">展開</span>
          <br /><span>使用規則：</span>{{"blabla"}}
        </mu-card-text>
      </mu-card>
    </article>
    <div class="center result result-failure" v-else-if="status === 'failure'">
      <mu-icon left value="warning" class="icon-global"></mu-icon>
      {{retrieveFailed}}
    </div>
    <mu-row class="center" v-else>
      <mu-col span="12">
        <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
      </mu-col>
    </mu-row>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-tw'

  export default {
    name: 'Coupons',
    data () {
      return {
        status: String,
        coupons: Object
      }
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `https://www.tbbt.com.tw/Coupon?studentCard=${vueModel.$route.params['studentCard']}`,
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

      unfold (coupon, currentContent, event) {
        let unfoldTarget = event.currentTarget.previousElementSibling
        unfoldTarget.style.overflow = 'visible'
        unfoldTarget.style.whiteSpace = 'normal'
        unfoldTarget.style.display = 'block'
        unfoldTarget.style.width = '70vw'
        this.$set(coupon, currentContent, false)
      },

      fold (coupon, currentContent, event) {
        let unfoldTarget = event.currentTarget.previousElementSibling
        unfoldTarget.removeAttribute('style')
        this.$set(coupon, currentContent, true)
      }
    }
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

      span {
        display: inline-block;
        width: 100px;
        height: 35px;
        vertical-align: middle
      }

      span.ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 45vw;
      }

      span.collapse {
        display: inline-block;
        width: 50px;
        position: absolute;
        right: 0;
      }
    }
  }

</style>
