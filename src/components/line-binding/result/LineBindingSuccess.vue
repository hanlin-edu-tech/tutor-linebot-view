<template>
  <div class="success-page">
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
      <mu-row v-if="coupons.length > 0">
        <mu-col span="12" class="coupon">
          <div class="coupon_in">
            <!-- 小標題 -->
            <span>您已獲得{{ coupons.length }}張綁定優惠券：</span>
            <!-- 優惠券清單 -->
            <div class="coupon-list">
              <div class="app-center" v-for="coupon in coupons" :key="coupon['_id']">
                <!-- 優惠券 -->
                <div class="coupon-card" @click="passIdToCouponDetail(coupon['_id'])">
                  <div class="coupon-card-in">
                    <!-- 左側折數 -->
                    <div class="coupon-card-left">
                      <div class="coupon-discount-block">
                        <div class="coupon-discount-block-in">
                          <mu-paper class="coupon-discount" v-html="formatDiscount(coupon.discount)"></mu-paper>
                        </div>
                      </div>
                    </div>
                    <!-- 右側內容 -->
                    <div class="coupon-card-right">
                      <div class="coupon-card-block">
                        <mu-paper>
                          <!-- 優惠標題 -->
                          <div class="coupon_tit">
                            <p> {{ coupon.name }} </p>
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
          <div class="coupon_in">
            <span>熱門活動：</span>
            <!-- 輪播樣式 -->
            <mu-carousel class="big-carousel" hide-indicators interval="9999999">
              <mu-carousel-item v-for="image in courseImages">
                <img :src="image.imgUrl" @click="goPage(image.href)">
              </mu-carousel-item>
            </mu-carousel>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="no-coupon" v-else>
        <h1> 目前沒有優惠券 </h1>
      </mu-row>
    </article>

    <CouponDetail v-if="isClickCouponDetail"
                  @go-back="isClickCouponDetail = false"
                  :coupon="clickedCoupon"
                  :student-enter-year="enterYear">
    </CouponDetail>

    <div class="app-center button-div" v-if="!isClickCouponDetail">
      <mu-button @click="queryProfiles" class="btn-primary btn_style next">查看帳號</mu-button>
    </div>
  </div>

</template>

<script>
import {mapState} from 'vuex'
import CouponDetail from "@/components/coupon/CouponDetail"
import studentService from "@/service/student-service"
import couponService from "@/service/coupon-service"
import utilService from "@/service/util-service"

export default {
  name: 'LineBindingSuccess',
  mixins: [studentService, couponService, utilService],

  data() {
    return {
      lineUserId: this.$route.params['specificLineUser'],
      coupons: [],
      couponCount: 0,
      isClickCouponDetail: false,
      courseImages: [],
      clickedCoupon: {},
      enterYear: 0
    }
  },

  components: {
    CouponDetail
  },

  async created() {
    const studentCard = this.student.studentCard
    try {
      // 處理優惠券
      const coupons = await this.searchCouponListWithStudentCard(studentCard)
      this.couponCount = Object.keys(coupons).length

      for (let i = 0; i < this.couponCount; i++) {
        const coupon = coupons[i]
        if (!this.isDeadLine(coupon.date.disable) && coupon.times > 0) {
          this.coupons.push(coupon)
        }
      }

      const images = await this.getPopularActivityImages()

      for (let image of images) {
        this.courseImages.push(image)
      }

      // 撈學生年級
      const student = await this.searchStudentWithStudentCard(studentCard)
      this.enterYear = student.enterYear
    } catch (error) {
      console.error(error)
    }
  },

  methods: {

    queryProfiles() {
      this.$router.replace(`/profile/${this.lineUserId}/${this.student.studentCard}`)
    },

    goPage(url) {
      window.open(url, '_blank')
    },

    passIdToCouponDetail(id) {
      this.isClickCouponDetail = true
      const couponObj = this.coupons.find(coupon => coupon._id === id)
      this.clickedCoupon = couponObj
    }
  },

  computed: mapState('binding', ['student'])
}
</script>

<style lang="less">
body{
  --blueColor:#0D6CBE;
  --deepBlueColor:#01579b;
  --orangeColor:#FD9841;
  --deepOrangeColor:#F28121;
  --greyColor:#DBDBDB;
  --deepGreyColor:#A8A8A8;
  --whiteColor:#FDFDFD;
  --deepWhiteColor:#F5F5F5;
}
.success-page{
  max-width: 600px;
  margin: auto;
}

#line-binding-success {
  .coupon {
    color: #01579b;
    font-size: 19px;
    font-weight: 500;
    span {
      font-size: 16px;
    }
    span.coupon-code {
      display: inline-block;
      width: 100%;
      background-color: #f9f6c0;
      padding: 2px 7px;
    }
  }

  .coupon_in{
    // margin: 0px 0px 20px;
  }
  .coupon_in:last-of-type{
    margin-top: 36px;
  }
    .coupon_in > span{
      color:var(--blueColor);
      font-weight: bold;
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
// 綁定成功
.result-success{
  position: relative;
  width: 50%;
  max-width: 320px;
  margin: 16px auto auto auto;
  font-size: 20px;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}
  .result-success > i{
    font-size: 24px;
    height: 24px;
    margin-right: 8px;
  }
// 說明文字
.result-detail{
  margin: 8px 0px;
  font-size: 16px;
  color: var(--deepGreyColor);
}
// 優惠券清單
.coupon-list{
  margin: 10px 0px;
  margin-top: 15px;
}
  // 優惠券
  .coupon-card {
    // margin-top: 10px;
    margin: 10px 0px;
    width: 100%;
    // border: 1px solid #333;
  }
    .coupon-card-in{
      display: flex;
    }
      // 左側折數
      .coupon-card-left{
        background-color: var(--blueColor);
        flex:1;
        min-width: 132px;
        max-width: 160px;
        position: relative;
        z-index: 3;
      }
      .coupon-card-left::before,.coupon-card-left::after{
        content:"";
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        position: absolute;
        right: 0;
        transform: translateX(50%);
      }
      .coupon-card-left::before{
        border-top: 10px solid #fafafa;
        top: 0;
      }
      .coupon-card-left::after{
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
        .coupon-discount-block::after{
          content: "";
          width: 50%;
          height: 50%;
          display: block;
          background-image: url(../../../asset/coupon_logo.svg);
          background-size: cover;
          position: absolute;
          bottom: 0;
          right: 0;
          opacity: 0.1;
        }
          .coupon-discount-block-in{
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
            }
            .coupon-discount::after{
              // content: "折";
              display: block;
              margin:0px 0px 8px 4px;
              font-size: 1rem;
            }
      // 右側內容
      .coupon-card-right{
        flex:3;
        // box-shadow: 4px 4px 2px 0px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 2;
      }
      .coupon-card-right::after{
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
        .mu-paper{
          width: 100%;
          padding: 15px;
        }
          // 優惠標題
          .coupon_tit{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 12px;
            color: var(--deepGreyColor);
          }
          .coupon_tit > p{
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            color: var(--blueColor);
            padding-bottom: 4px;
            margin-bottom: 4px;
            position: relative;
          }
          .coupon_tit > p::before{
            content: "";
            display: block;
            width: 60px;
            height: 2px;
            background-color: var(--blueColor);
            position: absolute;
            bottom: 0;
            left: 0;
          }
          // 折扣碼區塊
          .coupon_code{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 12px;
            color: var(--deepGreyColor);
            margin-top: 12px;
          }
            .coupon-code-in{
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              // border: 1px #333 solid;
            }
            .coupon-code-in .code{
              width: 100%;
              height: 32px;
              text-align: left;
              font-size: 14px;
              padding: 0px 4px;
              display: flex;
              align-items: center;
              color: var(--deepGreyColor);
              background-color: var(--deepWhiteColor);
            }
            .coupon-code-in .btn{
              width: 52px;
              height: 32px;
              margin-left: 8px;
              box-shadow: unset;
              border-radius: unset;
            }
@media screen and(max-width: 425px){
.coupon-list{
  margin: -20px 0px;
}
  .coupon-card{
    margin: 32px 0px;
  }
    .coupon-card-in{
      flex-direction:column;
      position: relative;
    }
    .coupon-card-in::after{
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
      .coupon-card-left{
        max-width: unset;
        z-index: 3;
      }
      .coupon-card-left::before,.coupon-card-left::after{
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        top: unset;
        bottom: 0;
        transform: translate(0%,50%);
      }
      .coupon-card-left::before{
        border-left: 8px solid #fafafa;
        left: 0;
        right: unset;
      }
      .coupon-card-left::after{
        border-right: 8px solid #fafafa;
        right: 0;
        left: unset;
      }
      // 右側內容
      .coupon-card-right{
      }
        .coupon-card-right::after{
          // content: unset;
          width: 100%;
          height: calc(100% - 15px);
          bottom: 0;
          top: unset;
        }
}

  .discount-word {
    font-size: 10px;
  }

  .img {
    width: 100%;
    height: 100%;
  }
}

// 新增輪播樣式
.mu-carousel-item{
  img{
    width: 100%;
    height: auto;
  }
}
// 大尺寸輪播(附加.big-carousel)
.mu-carousel.big-carousel .mu-carousel-item{
  border-radius: 10px;
  display: block;
  text-decoration: none;
  padding-top: 30%;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 優惠日期
.coupon_date{
  display: inline-flex;
  align-items: center;
}

.coupon_date > p{
  margin: unset;
}
// 沒有優惠券
.no-coupon{
  color: var(--deepGreyColor);
  font-weight: 600;
  font-size: 1.25rem;
}

</style>
