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
        <br />
      </mu-col>
    </mu-row>
    <mu-row v-show="status === 'success'">
      <mu-col span="12" class="coupon">
        <span>您已獲得 {{ couponCount }} 張綁定優惠券：</span>
        <div class="app-center" v-for="coupon in coupons" :key="coupon['_id']">
          <br /><span>{{ coupon.name }}</span>
          <br /><span class="coupon-code">{{ coupon.code }}</span>
          <br />使用期限：<span>{{ coupon.expireDate }}</span>
          <p></p>
          <div class="app-left attention" v-html="coupon.description">
            {{ coupon.description }}
          </div>
          <span class="collapse color-primary" v-if="!coupon.isShowDescription"
                @click="unfold($event, coupon)">查閱</span>
          <span class="collapse color-primary" v-else
                @click="fold($event, coupon)">收合</span>
        </div>
        <br />
        <div class="app-left how-to-use-coupon">
          ※ 【如何使用優惠碼】：
          <div class="ellipsis">
            <br />1. 至翰林雲端學院官網 → 課程購買 → 選購上學期課程。
            <br />2. 點選「加入購物車」→「立即結帳」至 Step1 確認課程頁面。
            <br />3. 於粉紅色區塊輸入以上優惠碼即可享有優惠。
            <br />4. 點選下一步並將相關資訊填寫完整後，即完成訂單。
          </div>
        </div>
      </mu-col>
    </mu-row>
    <DetermineUnsuccessfulStatus :status="status">目前沒有優惠券，敬請期待！</DetermineUnsuccessfulStatus>
    <div class="app-center">
      <mu-button color="lightBlue900" class="btn-primary" @click="queryProfiles">查詢帳號</mu-button>
    </div>
  </article>
</template>

<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import 'dayjs/locale/zh-tw'
  import DetermineUnsuccessfulStatus from '@/components/layout/DetermineUnsuccessfulStatus'

  export default {
    name: 'LineBindingSuccess',
    data () {
      const vueModel = this
      return {
        lineUserId: vueModel.$route.params['specificLineUser'],
        status: '',
        coupons: [],
        couponCount: 0
      }
    },

    components: {
      DetermineUnsuccessfulStatus
    },

    /* 使用 store module 的命名空間：binding，來取得此 module 儲存的 lineBindingStudentCard 物件 */
    computed: mapState('binding', ['lineBindingStudentCard']),

    async created () {
      const vueModel = this
      const studentCard = vueModel.lineBindingStudentCard.studentCard

      try {
        const response = await vueModel.$axios({
          method: 'get',
          url: `/Coupon?studentCard=${studentCard}&from=line@`
        })
        const coupons = response.data
        vueModel.status = 'empty'
        vueModel.couponCount = Object.keys(coupons).length
        for (let i = 0; i < vueModel.couponCount; i++) {
          const coupon = coupons[i]
          if (coupon && coupon.code) {
            if (!vueModel.isDeadLine(coupon.date.disable)) {
              const discountRegularExp = /^\d\.\d{2}/
              const showCoupon = {
                name: coupon.name,
                code: coupon.code,
                discount:
                  discountRegularExp.test(coupon.discount.toString()) ? coupon.discount * 100 : coupon.discount * 10,
                expireDate:
                  coupon.date.disable ? dayjs(coupon.date.disable).locale('zh-tw').format('YYYY/MM/DD') : '無截止效期',
                isShowDescription: false
              }
              showCoupon['description'] =
                vueModel.composeDescriptionContent(coupon.description.rules, coupon.description.applicable)

              vueModel.coupons.push(showCoupon)
              vueModel.status = 'success'
              vueModel.mappingUserRichmenu(vueModel.lineUserId)
            }
          }
        }
      } catch (error) {
        console.error(error)
        vueModel.status = 'failure'
      }
    },

    methods: {
      queryProfiles () {
        const vueModel = this
        vueModel.$router.push(`/profile/${vueModel.lineUserId}/#`)
      },

      async mappingUserRichmenu (lineUserId) {
        const vueModel = this
        try {
          await vueModel.$axios(
            {
              method: 'post',
              url: `https://asia-northeast1-tutor-204108.cloudfunctions.net/mappingUserRichmenu`,
              data: {
                lineUserId: lineUserId
              }
            }
          )
        } catch (error) {
          console.error(error)
        }
      },

      composeDescriptionContent (rules, applicable) {
        let content = '【適用產品】<br/>'
        content += '<div name="description" class="ellipsis app-left">'

        if (applicable) {
          content += applicable
        } else {
          content += '全'
        }

        if (rules) {
          let rulesDetail = ''
          let rulesList = rules.split('<br>')

          content += '<br /><br />'
          content += '※ 優惠券使用注意事項：<br />'
          if (rulesList.length > 0) {
            rulesDetail += `${rulesList[0]}<br/>`
            rulesDetail += '<span name="detail" style="display: none; font-size: 16px;">'
            for (let i = 1; i < rulesList.length; i++) {
              rulesDetail += `${rulesList[i]}<br/>`
            }
            content += rulesDetail
          }
        }

        content += '</span>'
        content += '</div>'
        return content
      },

      unfold (event, coupon) {
        const parentNode = event.currentTarget.parentNode
        const unfoldTarget = parentNode.querySelectorAll('div[name=description]')[0]
        parentNode.querySelectorAll('span[name=detail]')[0].style.display = ''
        unfoldTarget.style.overflow = 'visible'
        unfoldTarget.style.whiteSpace = 'normal'
        unfoldTarget.style.display = 'block'
        unfoldTarget.style.width = '90vw'
        coupon.isShowDescription = true
      },

      fold (event, coupon) {
        const parentNode = event.currentTarget.parentNode
        const unfoldTarget = parentNode.querySelectorAll('div[name=description]')[0]
        parentNode.querySelectorAll('span[name=detail]')[0].style.display = 'none'
        unfoldTarget.removeAttribute('style')
        coupon.isShowDescription = false
      },

      isDeadLine: dateDisable => {
        if (dateDisable) {
          return dayjs(dateDisable).diff(dayjs(), 'days') <= 0
        }
        return false
      }
    }
  }
</script>

<style lang="less">
  #line-binding-success {
    .coupon {
      color: #7f393b;
      font-size: 19px;
      font-weight: 500;

      span {
        font-size: 19px;
      }

      span.coupon-code {
        display: inline-block;
        width: 100%;
        background-color: #f9f6c0;
        padding: 2px 7px;
      }
    }

    .attention {
      font-size: 18px;
    }

    .how-to-use-coupon {
      color: black;
      font-weight: 500;
      font-size: 18px;
    }
  }
</style>
