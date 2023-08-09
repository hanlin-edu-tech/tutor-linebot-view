<template>
  <article id="line-binding-input">
    <mu-select label="選擇學號或手機" v-model="choice" full-width @change="changeSelectField">
      <mu-option v-for="key in Object.keys(options)" :key="key" :label="options[key]" :value="key"></mu-option>
    </mu-select>
    <span class="choice-account font-secondary-info">小提醒：若您尚未領取翰林雲端學院學生證，請登入認證取得學號</span>

    <!-- 學號輸入框 -->
    <div class="write_area" v-show="choice === 'studentCard'">
      <!-- 小標 -->
      <div class="subtitle">
        <span>請輸入學號</span>
      </div>
      <mu-text-field v-model="studentCard" type="text" placeholder="點擊以輸入學號" action-icon="edit"
                     @keyup="emitGivenStudentCard" full-width max-length="7"></mu-text-field>
      <a :href="'https://'+host+'/app/member-center/login.html'"></a>

      <span class="color-primary how-to-get-student-card" @click="openDialog">如何獲得學號？</span>

      <!-- popup -->
      <mu-dialog :open="isDialogOpen">
        <!-- muse-ui輪播(學號取得教學)-->
        <mu-carousel class="student-id" hide-controls interval="9999999" :active="active" @change="changeActiveImage"
                     :style="popupHeight">
          <mu-carousel-item class="carousel_img"
                            ref="imageHeight"
                            v-for="image in carouselImages">
            <div class="carousel_img_in">
              <img :src=image @load="imageLoaded">
            </div>
          </mu-carousel-item>
          <!-- 按鈕區塊 -->
          <div class="button-in-dialog" :style="popupHeight">
            <mu-button @click="closeDialog" color="lightBlue">取消</mu-button>
            <mu-button @click="nextActiveImage"
                       color="orange"
                       class="next-step-in-dialog"
                       v-if="active < (carouselImages.length -1)">下一步
            </mu-button>

            <mu-button @click="goLoginPage"
                       color="orange"
                       class="next-step-in-dialog"
                       v-if="active === (carouselImages.length - 1)">查看學號
            </mu-button>
          </div>
        </mu-carousel>
      </mu-dialog>
    </div>

    <!-- 手機輸入框 -->
    <div class="write_area phone" v-show="choice === 'mobile'">
      <!-- 小標 -->
      <div class="subtitle">
        <span>請輸入手機</span>
      </div>
      <mu-text-field v-model="mobile" type="text" placeholder="點擊以輸入手機" action-icon="edit"
                     @keyup="emitGivenMobile" full-width max-length="10">
      </mu-text-field>
    </div>
  </article>
</template>

<script>
// 如何獲得學號modal中的圖片
import stepImage1 from '../../asset/carousel/carousel-step-1.png'
import stepImage2 from '../../asset/carousel/carousel-step-2.png'
import stepImage3 from '../../asset/carousel/carousel-step-3.png'
import stepImage4 from '../../asset/carousel/carousel-step-4.png'
import stepImage5 from '../../asset/carousel/carousel-step-5.png'
import {mapGetters, mapState} from "vuex"
import studentService from "@/service/student-service"

export default {
  name: 'LineBindingInput',
  mixins: [studentService],

  data() {
    return {
      host: window.location.hostname,
      choice: '',
      options: {
        studentCard: '學號',
        mobile: '手機'
      },
      studentCard: '',
      mobile: '',
      isDialogOpen: false,
      active: 0,
      carouselImages: [stepImage1,stepImage2,stepImage3,stepImage4,stepImage5],
      imageHeight: 0,
      studentResultObj: {
        status: '',
        studentCard: ''
      },
      mobileResultObj: {
        status: '',
        mobile: ''
      }
    }
  },

  methods: {
    async emitGivenStudentCard() {
      const studentCardRegex = /[0-9A-Z]{7}/

      const result = studentCardRegex.test(this.studentCard)
      if (result) {
        this.student.studentCard = this.studentCard
        const isStudentCardExist = await this.isStudentCardExist()

        if (this.isBoundSameStudentTwice) {
          this.studentResultObj.status = 'BoundSameStudentTwice'
        } else if (!isStudentCardExist) {
          this.studentResultObj.status = 'StudentCardNotExist'
        } else {
          this.studentResultObj.status = 'Pass'
        }
      } else {
        this.studentResultObj.status = 'invalid'
      }
      this.studentResultObj.studentCard = this.studentCard
      this.$emit('given-student-card', this.studentResultObj)
    },

    async emitGivenMobile() {
      const mobileRegex = /^09[0-9]{8}$/
      const result = mobileRegex.test(this.mobile)

      if (result) {
        const students = await this.getStudentsWithMobile()

        if (students && students.length > 0) {
          this.mobileResultObj.students = students
          this.mobileResultObj.status = 'Pass'
          this.mobileResultObj.mobile = this.mobile
        } else {
          this.mobileResultObj.status = 'StudentCardNotExistWithMobile'
        }
      } else {
        // binding procedure中 下一步button出現後，若重新輸入要再將該button移除
        this.mobileResultObj.status = 'invalid'
        this.mobileResultObj.mobile = this.mobile
      }
      this.$emit('given-mobile', this.mobileResultObj)
    },

    async getStudentsWithMobile() {
      const students = await this.searchStudentsWithMobile(this.mobile)
      return students
    },

    async isStudentCardExist() {
      // 檢查該學號是否存在
      const result = await this.searchStudentWithStudentCard(this.studentCard)
      return result !== 'student not found';
    },

    imageLoaded() {
      this.imageHeight = this.$refs.imageHeight[0].$el.clientHeight
    },

    // 點擊如何獲得學號
    openDialog() {
      this.active = 0
      this.isDialogOpen = true
    },

    // 點擊取消Button
    closeDialog() {
      this.isDialogOpen = false
    },

    // 點擊下一步Button
    nextActiveImage() {
      this.active++
    },

    // 最後一張圖片時，下一步Button變成查看學號Button，點擊後前往登入頁面
    goLoginPage() {
      window.open('https://' + this.host + '/app/member-center/login.html', '_blank')
    },

    // 當輪播圖片切換，像是點擊圓點時
    changeActiveImage(index) {
      this.active = index
    },

    async changeSelectField() {
      // select 選單更換成學號 要清掉 手機號碼查詢到多位學生的select 選單
      if (this.choice === 'studentCard') {
        await this.emitGivenStudentCard()
        this.$emit('check-student-card-behavior', this.studentResultObj)
      } else if (this.choice === 'mobile') { // select 選單更換成手機 傳回手機號碼，如果該組手機號碼又有多位學生，則在觸發select選單
        await this.emitGivenMobile()
        this.$emit('check-mobile-behavior', this.mobileResultObj)
      }
    }
  },

  computed: {
    ...mapState('binding', ['student']),
    ...mapGetters('binding', ['isBoundSameStudentTwice']),
    popupHeight() {
      return {
        '--height': this.imageHeight + 'px'
      }
    }
  }
}
</script>

<style lang="less">
#line-binding-input {
  .mu-input-label {
    // font-size: 24px;
    font-size: 1.25rem;
    font-weight: 500;
    color: #A8A8A8;
  }

  .mu-input {
    padding: 2px 0px;
    min-height: unset;
    border-bottom: 1px #DBDBDB solid;
    margin-bottom: 12px;
  }

  .mu-input.has-label {
    padding: 36px 0px 12px;
  }

  .mu-input.full-width.has-label {
    border: unset;
  }

  .mu-select {
    background-color: #fff;
    border-radius: 5px;
  }

  .mu-select-input {
    padding: 0px 8px;
    font-size: 16px;
    color: #01579b;
  }

  .mu-select-action {
    color: #01579b !important;
  }

  .mu-input-line {
    display: none;
  }

  .mu-input-focus-line.focus {
    display: none;
  }

  .choice-account {
    position: relative;
    top: -20px;
    font-size: 12px;
    color: #bdbdbd;
    text-decoration: underline;
  }

  .mu-input {
    font-size: 20px;

    input[type="text"]::-webkit-input-placeholder {
      font-size: 18px
    }

    .mu-input-help {
      // font-size: 12px;
      display: none;
    }
  }

  .how-to-get-student-card {
    display: block;
    text-decoration: underline;
    font-size: 14px;
    font-weight: 500;
    max-width: 100px;
    margin-left: auto;
    // text-align: right;
    // margin-left: 990px;
  }

  .how-to-get-student-card:hover {
    cursor: pointer;
  }
}

.mu-option.is-selected .mu-item {
  color: #01579b;

  .mu-item-title {
    font-size: 18px;
  }
}

.mu-option .mu-item {
  .mu-item-title {
    font-size: 18px;
  }
}

//------------------------------------------------------------------//
// Dialog的 下一步Button
.next-step-in-dialog {
  margin-left: 120px;
}

div[class*="mu-dialog"] img {
  width: 320px;
  height: 270px;
}

.mu-popover {
  border-radius: 5px;
  margin-top: 40px;
}

.mu-list {
  padding: 0;
  border-radius: 5px;
}

.mu-option {
}

.mu-item-title {
  font-size: 16px !important;
}

// 填寫區塊
.write_area {
  margin: 12px 0px;
}
.write_area.phone{
  padding: 12px 0px;
  margin: 0;
}

// 小標
.subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #A8A8A8;
}

.mu-text-field-input {
  font-size: 16px;
}

input::placeholder {
  transform: scale(0.8);
  transform-origin: center left;
  color: #DBDBDB;
}

.mu-input__focus {
  // color: #fafafa;
}

//輪播區塊
.mu-dialog {
  width: 90% !important;
  max-width: 600px;
  border-radius: 5px;
}

.mu-dialog-body {
  padding: 14px 12px;
}

.mu-carousel {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.mu-carousel.student-id {
  height: unset;
}

// 輪播點-位置
.mu-carousel-indicators {
  width: unset;
  height: unset;
  margin: 0;
  position: absolute;
  left: 50%;
  right: unset;
  top: unset;
  bottom: calc(8px + 56px);
  display: flex;
  justify-content: center;
  transform: translateX(-50%)
}

// 輪播點-大小
.mu-icon-button {
  width: 10px;
  height: 10px;
  padding: 0px;
  margin: 0px 10px;
}

// 輪播點-顏色
.mu-button-wrapper .mu-carousel-indicator-icon {
  background-color: #DBDBDB;
}

// 輪播點-顏色active
.mu-carousel-indicator-button__active .mu-carousel-indicator-icon {
  background-color: #FD9841;
}

// 輪播圖
.mu-carousel-item.carousel_img {
  position: absolute;
}

.carousel_img {
  width: unset;
  height: unset;
  overflow: unset;
}

.carousel_img_in {
  display: block;
  padding-top: 60%;
  position: relative;
}

.carousel_img_in > img {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  object-fit: cover;
}

// 按鈕
.button-in-dialog {
  width: 100%;
  margin: unset;
  margin-top: calc(var(--height) + 20px);
  display: flex;
  justify-content: space-between;
}

.button-in-dialog > button.mu-raised-button {
  margin: unset;
  box-shadow: unset;
  border-radius: 2px;
  font-weight: 500;
  width: calc(50% - 5px);
}

.button-in-dialog > button:first-of-type {
  background-color: #0D6CBE !important;
}

.button-in-dialog > button:first-of-type:active {
  background-color: #065DA7 !important;
}

.button-in-dialog > button:last-of-type {
  background-color: #FD9841 !important;
}

.button-in-dialog > button:last-of-type:active {
  background-color: #F28121 !important;
}

// 大尺寸輪播圖樣式(附加.big-carousel)
.mu-carousel.big-carousel {
  overflow: unset;
  margin-top: 15px;
  border-radius: 10px;
  height: unset;
  padding-top: 55%;
  // 修正位置-上方
  .mu-carousel-button.mu-icon-button {
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    font-size: 60px;
  }

  // 修正位置-左方
  .mu-carousel-button.mu-icon-button.mu-carousel-button__left {
    left: 0px;
    transform: translate(-50%, 0%);
  }

  .mu-carousel-button__left::after {
    content: "";
    display: block;
    width: 20px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url(../../asset/icon/arrow_shadow.svg);
    background-size: cover;
    opacity: 0.25;
    filter: blur(4px);
    z-index: -1;
  }

  // 修正位置-右方
  .mu-carousel-button.mu-icon-button.mu-carousel-button__right {
    right: 0px;
    transform: translate(50%, 0%);
  }

  .mu-carousel-button__right::after {
    content: "";
    display: block;
    width: 20px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    background-image: url(../../asset/icon/arrow_shadow.svg);
    background-size: cover;
    opacity: 0.25;
    filter: blur(4px);
    z-index: -1;
  }

  // 輪播箭頭樣式
  .mu-button-wrapper {
    position: relative;
  }

  .mu-ripple-wrapper {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  }
}

// 新增輪播樣式
.mu-carousel-item {
  img {
    width: 100%;
    height: auto;
  }
}

// 大尺寸輪播(附加.big-carousel)
.mu-carousel.big-carousel .mu-carousel-item {
  border-radius: 10px;
  display: block;
  text-decoration: none;
  // padding-top: 45%;
  position: absolute;
  top: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
