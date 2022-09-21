<template>
  <div>
    <article id="line-binding-success" v-if="!isClickCouponDetail">
      <mu-row>
        <mu-col span="11">
          <div class="app-center result result-success">
            <mu-icon left value="check_circle" class="icon-global bind-success-icon"></mu-icon>
            綁定成功!
          </div>
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="12">
          <div class="result-detail">您已成功綁定翰林雲端學院帳號，未來我們將透過 Line
            生活圈發布更多優惠及即時訊息，請一定要密切關注喔！
          </div>
          <br/>
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="12" class="coupon" @click="isClickCouponDetail = true">
          <span>您已獲得{{ couponCount }}張綁定優惠券：</span>
          <div class="app-center" v-for="coupon in coupons" :key="coupon['_id']">
            <div class="coupon-card" @click>
            <span class="coupon-discount-block">
              <mu-paper class="coupon-discount"> {{ coupon.discount }} </mu-paper>
            </span>
              <span class="coupon-card-block">
              <mu-paper>
                {{ coupon.name }} <br>
                日期:{{ coupon.expireDate }} <br>

                優惠折扣碼 <br>
                {{ coupon.code }} <br>
              </mu-paper>
            </span>
              <mu-button color="orange">查看詳情</mu-button>
              <CouponDetail v-if="isClickCouponDetail" @go-back="isClickCouponDetail = false" :coupon="coupon"></CouponDetail>
            </div>
            熱門活動：
          </div>
        </mu-col>
      </mu-row>
      <!--    <DetermineUnsuccessfulStatus :status="status">目前沒有優惠券，敬請期待！</DetermineUnsuccessfulStatus>-->
    </article>

    <mu-carousel hide-indicators interval="9999999">
      <mu-carousel-item v-for="image in courseImages">
        <img :src="image" @click="goCoursePage">
      </mu-carousel-item>
    </mu-carousel>

    <div class="app-center">
      <mu-button @click="queryProfiles" color="orange" class="btn-primary" round>查看帳號</mu-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import DetermineUnsuccessfulStatus from '@/components/layout/DetermineUnsuccessfulStatus'
import CouponDetail from "@/components/line-binding/CouponDetail";
import courseImage1 from "../../../static/img/course1.png"
import courseImage2 from "../../../static/img/course2.png"

export default {
  name: 'LineBindingSuccess',
  data() {
    const vueModel = this
    return {
      lineUserId: vueModel.$route.params['specificLineUser'],
      status: '',
      coupons: [],
      couponCount: 0,
      isClickCouponDetail: false,
      courseImages: [courseImage1, courseImage2]
    }
  },

  components: {
    DetermineUnsuccessfulStatus,
    CouponDetail
  },

  /* 使用 store module 的命名空間：binding，來取得此 module 儲存的 lineBindingStudentCard 物件 */
  computed: mapState('binding', ['lineBindingStudentCard']),

  async created() {
    const studentCard = this.lineBindingStudentCard.studentCard

    try {
      const response = await this.$axios({
        method: 'get',
        // url: `/shop/coupon/list?studentCard=${studentCard}&from=line@`
        url: `https://www.tbbt.com.tw/shop/coupon/list?studentCard=${studentCard}&from=line@`
      })
      const coupons = response.data
      this.status = 'empty'
      this.couponCount = Object.keys(coupons).length
      for (let i = 0; i < this.couponCount; i++) {
        const coupon = coupons[i]
        if (coupon && coupon.code) {
          if (!this.isDeadLine(coupon.date.disable)) {
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
                this.composeDescriptionContent(coupon.description.rules, coupon.description.applicable)

            this.coupons.push(showCoupon)
            this.status = 'success'
          }
        }
      }
    } catch (error) {
      console.error(error)
      this.status = 'failure'
    }
  },

  methods: {
    queryProfiles() {
      const vueModel = this
      vueModel.$router.push(`/profile/${vueModel.lineUserId}/#`)
    },

    composeDescriptionContent(rules, applicable) {
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

    isDeadLine: dateDisable => {
      if (dateDisable) {
        return dayjs(dateDisable).diff(dayjs(), 'days') <= 0
      }
      return false
    },

    goCoursePage() {
      // window.open('https://' + this.host + '/app/member-center/login.html', '_blank')
      window.open('https://www.tbbt.com.tw/app/online-showcase/product-list.html#JS&all&all&all', '_blank')
    }
  }
}
</script>

<style lang="less">
#line-binding-success {
  .coupon {
    color: #01579b;
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

  .bind-success-icon {
    color: orange;
  }

  .coupon-card {
    margin-top: 10px;
    border: 3px solid red;
  }

  .coupon-discount {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    background-color: #2196f3;
    width: 150px;
  }

  .discount-word {
    font-size: 10px;
  }

  .coupon-discount-block {
    display: flex;
    justify-content: left;
    height: 100%;
    width: 100%;
  }

  .coupon-card-block {
    display: flex;
    justify-content: right;

  }

  .img {
    width: 100%;
    height: 100%;
  }
}
</style>
