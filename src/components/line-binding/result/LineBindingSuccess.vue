<template>
  <article id="line-binding-success">
    <mu-row>
      <mu-col span="11">
        <div class="app-center result result-success">
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
        <p class="app-center coupon" v-show="status === 'success'">
          您已獲得 1 張 {{discount}} 折優惠券：
          <br /><span class="coupon-code">{{code}}</span>
          <br />使用期限：<span>{{expireDate}}</span>
        </p>
        <p class="app-center" v-show="status !== 'success'">
          <DetermineUnsuccessfulStatus :status="status">目前沒有優惠券，敬請期待！</DetermineUnsuccessfulStatus>
        </p>
      </mu-col>
    </mu-row>
    <p class="app-center" style="margin-top: -25px;">
      <mu-button color="lightBlue900" class="btn-primary" @click="queryProfiles">查詢帳號</mu-button>
    </p>
    <mu-row>
      <mu-col span="12">
        <div class="app-center attention">
          ※ 優惠券使用注意事項：
          <div class="ellipsis app-left">
            <br />【如何使用優惠碼】
            <br />1. 至翰林雲端學院官網 → 課程購買 → 選購上學期課程。
            <br />2. 點選「加入購物車」→「立即結帳」至 Step1 確認課程頁面。
            <span id="attention-detail" style="display: none;">
              <br />3. 於粉紅色區塊輸入以上優惠碼即可享有優惠。
              <br />4. 點選下一步並將相關資訊填寫完整後，即完成訂單。
              <br />
              <br />【其他注意事項】
              <br />1. 此優惠碼不適用翰林雲端學院下學期 e 名師課程（全學年課程除外）。
              <br />2. 此優惠碼使用期限至 2018 年 7 月 31日，逾期視同放棄資格，恕不補發。
              <br />3. 此優惠碼不得與其他優惠碼一併使用。
              <br />4. 若有任何問題請撥打 0800-0088-11 或透過官方 Line 帳號與客服聯繫。
              <br />
              <br />【我的優惠適用產品】
              <br />翰林雲端學院國小上學期 e 名師課程
              <br />國中上學期 e 名師課程
              <br />會考 e 名師課程
              <br />高中上學期 e 名師課程
              <br />學測 e 名師課程
              <br />指考 e 名師課程
            </span>
            <span class="collapse color-primary" v-if="!isShowAttention"
                  @click="unfold($event)">查閱</span>
            <span class="collapse color-primary" v-else
                  @click="fold($event)">收合</span>
          </div>
        </div>
      </mu-col>
    </mu-row>
  </article>
</template>

<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-tw'
  import DetermineUnsuccessfulStatus from '../../layout/DetermineUnsuccessfulStatus'
  import SuitableProduct from './SuitableProduct'

  export default {
    name: 'LineBindingSuccess',
    data () {
      return {
        lineUserId: this.$route.params['specificLineUser'],
        discount: 0,
        code: '',
        expireDate: '',
        status: '',
        isShowAttention: false
      }
    },

    components: {
      SuitableProduct,
      DetermineUnsuccessfulStatus
    },

    /* 使用 store module 的命名空間：binding，來取得此 module 儲存的 lineBindingStudentCard 物件 */
    computed: mapState('binding', ['lineBindingStudentCard']),

    created () {
      let vueModel = this
      let studentCard = vueModel.lineBindingStudentCard.studentCard
      vueModel
        .axios({
          method: 'get',
          url: `/Coupon?studentCard=${studentCard}&name=Line@綁定優惠`
        })
        .then(response => {
          let coupons = response.data
          let coupon = coupons[0]
          vueModel.status = 'empty'
          if (coupon && coupon.code) {
            if (!vueModel.isDeadLine(coupon.date.disable)) {
              let discountRegularExp = /^\d\.\d{2}/
              vueModel.code = coupon.code
              vueModel.discount = discountRegularExp.test(coupon.discount.toString()) ? coupon.discount * 100 : coupon.discount * 10
              vueModel.expireDate =
                coupon.date.disable ? dayjs(coupon.date.disable).locale('zh-tw').format('YYYY/MM/DD') : '無截止效期'

              vueModel.status = 'success'
            }
          }
        })
        .catch(error => {
          console.error(error)
          vueModel.status = 'failure'
        })

      vueModel.mappingUserRichmenu(vueModel.lineUserId)
    },

    methods: {
      queryProfiles () {
        this.$router.push(`/profile/${this.lineUserId}/#`)
      },

      mappingUserRichmenu (lineUserId) {
        this
          .axios({
            method: 'post',
            url: `https://us-central1-tutor-204108.cloudfunctions.net/mappingUserRichmenu`,
            data: {
              lineUserId: lineUserId
            }
          })
          .catch(console.error)
      },

      unfold (event) {
        let unfoldTarget = event.currentTarget.parentNode
        document.getElementById('attention-detail').style.display = ''
        unfoldTarget.style.overflow = 'visible'
        unfoldTarget.style.whiteSpace = 'normal'
        unfoldTarget.style.display = 'block'
        unfoldTarget.style.width = '90vw'
        this.isShowAttention = true
      },

      fold (event) {
        let unfoldTarget = event.currentTarget.parentNode
        document.getElementById('attention-detail').style.display = 'none'
        unfoldTarget.removeAttribute('style')
        this.isShowAttention = false
      },

      isDeadLine: dateDisable => dayjs(dateDisable).diff(dayjs(), 'days') <= 0
    }
  }
</script>

<style lang="less">
  #line-binding-success {
    .coupon {
      color: #7f393b;
      font-size: 1.4em;
      font-weight: 500;

      span {
        font-size: 1.2em;
      }

      span.coupon-code {
        display: inline-block;
        width: 100%;
        background-color: #f9f6c0;
        padding: 2px 7px;
      }
    }

    .attention {
      font-size: 20px;

      .mu-item {
        height: 70px;
      }
    }
  }
</style>
