<template>
  <div class="coupon_page" v-if="isInitial">
    <div v-if="!isClickCouponDetail">
      <!-- 標題區 -->
      <div class="account_title">
        <h1> 優惠券專區 </h1>
      </div>

      <!-- 頁籤 -->
      <div class="coupon_status">
        <mu-button @click="select = 'available'"
                   :class="{selected: select === 'available'}"
                   round>可使用
        </mu-button>

        <mu-button @click="select = 'invalid'"
                   :class="{selected: select === 'invalid'}"
                   round>已失效
        </mu-button>
      </div>

      <!-- 可使用coupon -->
      <div v-if="select === 'available'">
        <!-- 優惠券清單 -->
        <div v-if="greatThanEqualZeroDay.length > 0">
          <div class="coupon-list">
            <div v-for="coupon in greatThanEqualZeroDay" :key="coupon['_id']">
              <div class="coupon-card"
                   @click="passIdToCouponDetail(coupon['_id'])">
                <div class="coupon-card-in">
                  <!-- 左側折數 -->
                  <div class="coupon-card-left">
                    <div class="coupon-discount-block">
                      <div class="coupon-discount-block-in">
                        <mu-paper class="coupon-discount" v-html="formatDiscount(coupon.discount)"></mu-paper>
                      </div>
                    </div>
                  </div>
                  <!-- 右側折數 -->
                  <div class="coupon-card-right">
                    <div class="coupon-card-block" :class="{'close-deadline': coupon.diffDay <= 10}">
                      <mu-paper>
                        <!-- 優惠標題 -->
                        <div class="coupon_tit">
                          <p> 新手綁定優惠方案 </p>
                          <!-- 日期 -->
                          <div class="coupon_date">
                            <p>日期:</p>{{ formatDate(coupon.date.enable) }}
                            <p>~</p>{{ formatDate(coupon.date.disable) }}
                          </div>
                        </div>
                        <!-- 折扣碼區塊 -->
                        <div class="coupon_code">
                          優惠折扣碼
                          <div class="coupon-code-in">
                            <div class="code">
                              {{ coupon.code }}
                            </div>
                            <mu-button class="btn" color="orange">查看詳情</mu-button>
                          </div>
                        </div>
                      </mu-paper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-coupon" v-else>
          目前無優惠券
        </div>
      </div>

      <!-- 不可使用coupon -->
      <div v-else-if="select === 'invalid'">
        <!-- 優惠券清單 -->
        <div v-if="invalidCoupon.length > 0">
          <div class="coupon-list">
            <div v-for="coupon in invalidCoupon" :key="coupon['_id']">
              <div class="coupon-card disable"
                   @click="passIdToCouponDetail(coupon['_id'])">
                <div class="coupon-card-in">
                  <!-- 左側折數 -->
                  <div class="coupon-card-left">
                    <div class="coupon-discount-block">
                      <div class="coupon-discount-block-in">
                        <mu-paper class="coupon-discount" v-html="formatDiscount(coupon.discount)"></mu-paper>
                      </div>
                    </div>
                  </div>
                  <!-- 右側折數 -->
                  <div class="coupon-card-right">
                    <div class="coupon-card-block">
                      <mu-paper>
                        <!-- 優惠標題 -->
                        <div class="coupon_tit">
                          <p> 新手綁定優惠方案 </p>
                          <!-- 日期 -->
                          <div class="coupon_date">
                            <p>日期:</p>{{ formatDate(coupon.date.enable) }}
                            <p>~</p>{{ formatDate(coupon.date.disable) }}
                          </div>
                        </div>
                        <!-- 折扣碼區塊 -->
                        <div class="coupon_code">
                          優惠折扣碼
                          <div class="coupon-code-in">
                            <div class="code">
                              {{ coupon.code }}
                            </div>
                            <mu-button class="btn" color="orange">查看詳情</mu-button>
                          </div>
                        </div>
                      </mu-paper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-coupon" v-else>
          目前無優惠券
        </div>
      </div>
    </div>
    <CouponDetail v-if="isClickCouponDetail"
                  @go-back="isClickCouponDetail = false"
                  :coupon="clickedCoupon"
                  :student-enter-year="enterYear">
    </CouponDetail>
  </div>
</template>

<script>
import CouponDetail from "@/components/coupon/CouponDetail"
import couponService from "@/service/coupon-service"
import studentService from "@/service/student-service"
import {mapState} from "vuex";

export default {
  name: "Coupons",
  mixins: [couponService, studentService],
  components: {CouponDetail},

  data() {
    return {
      select: 'available',
      isClickCouponDetail: false,
      isInitial: false,
      clickedCoupon: {}, // 點擊該coupon 查看詳細資訊
      coupons: [], // 所有coupon
      greatThanEqualZeroDay: {}, // 大於等於0天的coupon
      invalidCoupon: [], // 過期失效的coupon
      currentStudent: {}, // 當前使用的學生
      couponsCount: 0, // coupon 數量
      enterYear: 0 // 年級
    }
  },

  async created() {
    const currentStudentCard = this.getCurrentStudentCard
    const coupons = await this.searchCouponListWithStudentCard(currentStudentCard)
    this.coupons = coupons

    // 沒有if判斷 console會報錯
    if (typeof this.coupons === 'object') {
      this.couponsCount = Object.keys(this.coupons).length
    }
    // 撈學生年級
    const student = await this.searchStudentWithStudentCard(currentStudentCard)
    this.enterYear = student.enterYear

    const greatThanEqualZeroDayArray = []
    // 先分兩類 有效跟過期
    for (let coupon of this.coupons) {
      const isGreatThanEqualZeroDay = !this.isDeadLine(coupon.date.disable)
      const hasTimes = coupon.times > 0
      // 使用次數大於0 以及 大於0天的情況放在該array
      if (isGreatThanEqualZeroDay && hasTimes) {
        coupon.diffDay = this.computeRemainingDate(coupon.date.disable)
        greatThanEqualZeroDayArray.push(coupon)
      } else { //剩餘放在已失效 包括 使用完 次數為0
        this.invalidCoupon.push(coupon)
      }
    }
    this.greatThanEqualZeroDay = greatThanEqualZeroDayArray.sort((couponA, couponB) => {
      return this.computeRemainingDate(couponA.date.disable) - this.computeRemainingDate(couponB.date.disable)
    })

    this.isInitial = true
  },

  methods: {
    passIdToCouponDetail(id) {
      this.isClickCouponDetail = true
      const clickedCoupon = this.coupons.find(coupon => coupon._id === id)
      this.clickedCoupon = clickedCoupon
    }

  },

  computed: {
    getCurrentStudentCard() {
      return this.$route.params.studentCard
    },
    ...mapState('common', ['students'])
  }
}
</script>

<style lang="less" scoped>
.coupon_page {

}

// 標題
.account_title {
  position: relative;
  margin: 16px 0px;

  h1 {
    margin: auto;
    text-align: center;
    padding: 0px 32px;
    font-size: 20px;
    color: #0D6CBE;
  }
}

// 頁籤
.coupon_status {
  display: flex;
  margin: 0px 0px 16px 0px;
  justify-content: center;
}

.coupon_status > button {
  box-shadow: unset;
  background-color: #DBDBDB;
  color: #fff;
  margin: 0px 4px;
}

/*調整顏色的部分*/
.selected {
  background-color: #0D6CBE !important;
}


// 優惠券清單
.coupon-list {
  margin: 10px auto;
  max-width: 600px;
}

// 優惠券
.coupon-card {
  // margin-top: 10px;
  margin: 10px 0px;
  width: 100%;
  // border: 1px solid #333;
}

// 無法點擊樣式
.coupon-card.disable {
  pointer-events: none;
  filter: grayscale(1);
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

.coupon-card.disable::before {
  content: "已失效";
  position: absolute;
  color: #fff;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 0 0 10px #00000050;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  min-width: 144px;
}

.coupon-card.disable::after {
  content: "";
  width: 100%;
  height: 100%;
  background-color: #DBDBDB;
  position: absolute;
  top: 0;
  opacity: 0.6;
  z-index: 2;
}

.coupon-card-in {
  display: flex;
}

// 左側折數
.coupon-card-left {
  background-color: #0D6CBE;
  flex: 1;
  min-width: 132px;
  max-width: 160px;
  position: relative;
  z-index: 3;
}

.coupon-card-left::before, .coupon-card-left::after {
  content: "";
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  position: absolute;
  right: 0;
  transform: translateX(50%);
}

.coupon-card-left::before {
  border-top: 10px solid #fafafa;
  top: 0;
}

.coupon-card-left::after {
  border-bottom: 10px solid #fafafa;
  bottom: 0;
}

.coupon-discount-block {
  display: flex;
  align-content: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.coupon-discount-block::after {
  content: "";
  width: 50%;
  height: 50%;
  display: block;
  background-image: url(../../asset/coupon_logo.svg);
  background-size: cover;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.1;
}

.coupon-discount-block-in {
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon-discount {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  width: 150px;
  background-color: unset;

  span {
    font-size: 1rem;
  }
}

.coupon-discount::after {
  // content: "折";
  display: block;
  margin: 0px 0px 8px 4px;
  font-size: 1rem;
}

// 右側內容
.coupon-card-right {
  flex: 3;
  // box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.coupon-card-right::after {
  content: "";
  width: calc(100% - 15px);
  height: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.1);
  z-index: -1;
}

.coupon-card-block {
  display: flex;
}

// 即將過期
.close-deadline {
  // border: 3px solid red;
  position: relative;
}

.close-deadline::after {
  position: absolute;
  top: -4px;
  right: 20px;
  content: "即將失效";
  width: 84px;
  height: 28px;
  background-color: #D20000;
  font-size: 12px;
  color: #fff;
  z-index: 2;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0 0 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mu-paper {
  width: 100%;
  padding: 15px;
}

// 優惠標題
.coupon_tit {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  color: #A8A8A8;
}

.coupon_tit > p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #0D6CBE;
  padding-bottom: 4px;
  margin-bottom: 4px;
  position: relative;
}

.coupon_tit > p::before {
  content: "";
  display: block;
  width: 60px;
  height: 2px;
  background-color: #0D6CBE;
  position: absolute;
  bottom: 0;
  left: 0;
}

// 優惠日期
.coupon_date {
  display: inline-flex;
  align-items: center;
}

.coupon_date > p {
  margin: unset;
}

// 折扣碼區塊
.coupon_code {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  color: #A8A8A8;
  margin-top: 12px;
}

.coupon-code-in {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  // border: 1px #333 solid;
}

.coupon-code-in .code {
  width: 100%;
  height: 32px;
  text-align: left;
  font-size: 14px;
  padding: 0px 4px;
  display: flex;
  align-items: center;
  color: #A8A8A8;
  background-color: #F5F5F5;
}

.coupon-code-in .btn {
  width: 52px;
  height: 32px;
  margin-left: 8px;
  box-shadow: unset;
  border-radius: unset;
}
// 沒有優惠券
.no-coupon{
  color: var(--deepGreyColor);
  font-weight: 600;
  font-size: 1.25rem;
}
@media screen and(max-width: 425px) {
    .coupon-list {
      margin: -20px 0px;
    }

    .coupon-card {
      margin: 32px 0px;
    }

    .coupon-card-in {
      flex-direction: column;
      position: relative;
    }

    .coupon-card-in::after {
      // border: 1px #333 solid;
      // content: "";
      // width: 100%;
      // height: 80px;
      // position: absolute;
      // top: 0;
      // right: 0;
      // box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.1);
    }

    // 左側折數
    .coupon-card-left {
      max-width: unset;
      z-index: 3;
    }

    .coupon-card-left::before, .coupon-card-left::after {
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      top: unset;
      bottom: 0;
      transform: translate(0%, 50%);
    }

    .coupon-card-left::before {
      border-left: 8px solid #fafafa;
      left: 0;
      right: unset;
    }

    .coupon-card-left::after {
      border-right: 8px solid #fafafa;
      right: 0;
      left: unset;
    }

    // 右側內容
    .coupon-card-right {
    }

    .coupon-card-right::after {
      // content: unset;
      width: 100%;
      height: calc(100% - 15px);
      bottom: 0;
      top: unset;
    }

    .close-deadline::after {
      width: 84px;
      height: 28px;
      top: 16px;
      right: -6px;
      border-radius: 5px 0px 0px 5px;
    }
  }
</style>