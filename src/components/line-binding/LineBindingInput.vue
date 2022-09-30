<template xmlns:v="http://www.w3.org/1999/html">
  <article id="line-binding-input">
    <mu-select label="選擇學號或手機" v-model="choice" full-width @change="changeSelectField">
      <mu-option v-for="key in Object.keys(options)" :key="key" :label="options[key]" :value="key"></mu-option>
    </mu-select>
    <span class="choice-account font-secondary-info">小提醒：若您尚未領取翰林雲端學院學生證，請登入認證取得學號</span>
    <div v-show="choice === 'studentCard'">
      <mu-text-field v-model="studentCard" type="text" placeholder="請輸入學號" action-icon="edit"
                     @keyup="emitGivenStudentCard" full-width max-length="7"></mu-text-field>
      <a :href="'https://'+host+'/app/member-center/login.html'">
        <div id="student-card-query" class="student-card-query" style="display: none;"></div>
      </a>

      <span class="color-primary how-to-get-student-card" @click="openDialog">如何獲得學號？</span>

      <!-- popup -->
      <mu-dialog width="360" :open.sync="isDialogOpen">
        <mu-carousel hide-controls interval="9999999" :active="active" @change="changeActiveImage">
          <mu-carousel-item v-for="image in carouselImages">
            <img :src="image">
          </mu-carousel-item>
          <!-- 按鈕 -->
          <div class="button-in-dialog" :style="popupheight">
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
    <!-- 請輸入手機 -->
    <div class="write_area" v-show="choice === 'mobile'">
      <!-- 小標 -->
      <div class="subtitle">
        <span>請輸入手機</span>
      </div>
      <mu-text-field v-model="mobile" type="text" placeholder="" action-icon="edit"
                     @keyup="emitGivenMobile" :error-text="errorText" full-width max-length="10">
      </mu-text-field>
    </div>
  </article>
</template>

<script>
import carouselImage1 from '../../static/img/memberLogin.png'
import carouselImage2 from '../../static/img/notice.png'

export default {
  name: 'LineBindingInput',
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
      errorText: '',
      isDialogOpen: false,
      active: 0,
      carouselImages: [carouselImage1, carouselImage2],
      marginHeight:0,
    }
  },
  computed:{
    popupheight(){
      console.log(this.marginHeight, "end")
      return {
        '--height':  this.marginHeight + 12 + 'px'
      }
    },
  },
  updated(){
    if (this.$refs.imageHeight){
      this.width = this.$refs.imageHeight[0].$el.clientWidth
      this.height = this.$refs.imageHeight[0].$el.clientHeight

      this.marginCaculate()
    }

  },
  methods: {
    emitGivenStudentCard() {
      const vueModel = this
      vueModel.$emit('given-student-card', vueModel.studentCard)
    },

    emitGivenMobile() {
      const mobileRegex = /^09[0-9]{8}$/
      const result = mobileRegex.test(this.mobile)
      if (result) {
        this.errorText = ''
        this.$emit('given-mobile', this.mobile)
      } else {
        this.errorText = '請輸入正確的手機號碼'
      }
    },

    // 點擊如何獲得學號
    openDialog() {
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

    changeSelectField() {
      // select 選單更換成學號 要清掉 手機號碼查詢到多位學生的select 選單
      if (this.choice === 'studentCard') {
        this.$emit('given-student-card','')
      }
      // select 選單更換成手機 傳回手機號碼，如果該組手機號碼又有多位學生，則在觸發select選單
      if (this.choice === 'mobile') {
        this.$emit('given-mobile',this.mobile)
      }
    },

    // 按鈕margin高度運算
    marginCaculate(){
      let height = 0
      if(this.$refs.imageHeight){
        height = this.$refs.imageHeight[0].$el.clientHeight
      }
      this.marginHeight = height
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
  .mu-input{
   padding: 4px 0px;
   min-height: unset;
   border-bottom: 1px #DBDBDB solid;
   margin-bottom: 12px;
  }
  .mu-input.has-label {
    padding: 36px 0px 12px;
  }
  .mu-input.full-width.has-label{
    border:unset;
  }
  .mu-select{
    background-color: #fff;
    border-radius: 5px;
  }

  .mu-select-input {
    padding: 0px 8px;
    font-size: 16px;
    color: #01579b;
  }

  .mu-input-line{
    display: none;
  }
  .mu-input-focus-line.focus{
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

  .student-card-query {
    height: 700px;
    width: 240px;
    background-image: url('~@/static/img/student-card-query.png');
    background-size: cover;
  }

  .how-to-get-student-card {
    display: block;
    text-decoration: underline;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
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

// Dialog的 下一步Button
.next-step-in-dialog {
  margin-left: 120px;
}

div[class*="mu-dialog"] img {
  width: 320px;
  height: 270px;
}

.button-in-dialog {
  display: flex;
  justify-content: center;
  margin-top: 260px;
}

.mu-carousel {
  height: 300px;
}

div[class*="mu-carousel-indicators"] {
  height: 50px;
  width: 100px;
  display: flex;
  justify-content: space-between;
  left: 110px;
  top: 250px;
}

// dialog 下的 圓點
.mu-button-wrapper .mu-carousel-indicator-icon {
  background-color: darkgray;
}

// dialog 的 圖片
.mu-carousel-item {
  height: 250px;
}

.mu-popover{
  border-radius: 5px;
  margin-top: 40px;
}
  .mu-list {
    padding: 0;
    border-radius: 5px;
  }
    .mu-option{
    }
    .mu-item-title{
      font-size: 16px!important;
    }

// 填寫區塊
.write_area{
  margin: 12px 0px;
}
// 小標
.subtitle{
  font-size: 15px;
  font-weight: 500;
  color: #A8A8A8;
}
.mu-text-field-input{
  font-size: 16px;
}
  //
  .mu-dialog{
    width: 90%!important;
    max-width:600px;
    border-radius: 5px;
  }
    .mu-dialog-body{

    }
      .mu-carousel{
        // overflow: unset;
        position: relative;
        height: unset;
      }
      // 輪播圖
      .mu-carousel-item.carousel_img{
        position: relative;
        position: absolute;
      }
      .carousel_img{
        width: unset;
        height: unset;
        overflow: unset;
      }
        .carousel_img_in{
          display: block;
          padding-top:60%;
          position: relative;
        }
        .carousel_img_in > img{
          width: 100%!important;
          height: 100%!important;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          object-fit: cover;
        }
          // 輪播點
          .mu-carousel-indicators{
            margin: 0!important;
            display: flex!important;
            justify-content: center!important;
            left: 50%!important;
            top: unset!important;
            bottom: calc(0px + 44px)!important;
            width: unset!important;
            height: 36px!important;
            transform:translateX(-50%)
            // width: unset!important;
            // height: unset!important;
            // position: absolute;
            // bottom: 0;
          }
            .mu-carousel-indicator-button{
              width: 10px;
              height: 10px;
            }
            .mu-button-wrapper .mu-carousel-indicator-icon {
              background-color: darkgray;
            }
            // active
            .mu-carousel-indicator-button__active .mu-carousel-indicator-icon{
              background-color: #ededed;
            }
          // 按鈕
          .button-in-dialog{
            width: 100%;
            margin: unset;
            margin-top: 20px;
            margin-top: var(--height);
            // margin-top: 360px;
            // position: absolute;
            // bottom: 0;
            display: flex;
            justify-content: space-between;
          }
            .button-in-dialog > button.mu-raised-button{
              margin: unset;
              box-shadow: unset;
              border-radius: 2px;
              font-weight: 500;
              width: calc(50% - 5px);
            }
            .button-in-dialog > button:first-of-type{
              background-color: #0D6CBE!important;
            }
              .button-in-dialog > button:first-of-type:active{
                background-color: #065DA7!important;
              }
            .button-in-dialog > button:last-of-type{
              background-color: #FD9841!important;
            }
              .button-in-dialog > button:last-of-type:active{
                background-color: #F28121!important;
              }
</style>
