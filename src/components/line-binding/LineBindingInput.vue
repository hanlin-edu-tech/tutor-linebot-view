<template xmlns:v="http://www.w3.org/1999/html">
  <article id="line-binding-input">
    <mu-select label="選擇學號或手機" v-model="choice" full-width>
      <mu-option v-for="key in Object.keys(options)" :key="key" :label="options[key]" :value="key"></mu-option>
    </mu-select>
    <span class="choice-account font-secondary-info">小提醒：若您尚未領取翰林雲端學院學生證，請登入認證取得學號</span>
    <div v-show="choice === 'studentCard'">
      <mu-text-field v-model="studentCard" type="text" placeholder="請輸入學號" action-icon="edit"
                     @keyup="emitGivenStudentCard" full-width max-length="8"></mu-text-field>
      <a :href="'https://'+host+'/app/member-center/login.html'">
        <div id="student-card-query" class="student-card-query" style="display: none;"></div>
      </a>
      <span class="color-primary how-to-get-student-card" @click="openDialog">如何獲得學號？</span>
      <mu-dialog width="360" :open.sync="isDialogOpen">
        <mu-carousel hide-controls interval="9999999" :active="active" @change="changeActiveImage">
          <mu-carousel-item v-for="image in carouselImages">
            <img src="image">
          </mu-carousel-item>
          <div class="button-in-dialog">
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
    <div v-show="choice === 'mobile'">
      <mu-text-field v-model="mobile" type="text" placeholder="請輸入學生證註冊手機號碼" action-icon="phone"
                     @keyup="emitGivenMobile" :error-text="errorText" full-width max-length="10"></mu-text-field>
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
      carouselImages: [carouselImage1, carouselImage2]
    }
  },
  methods: {
    emitGivenStudentCard() {
      const vueModel = this
      vueModel.$emit('given-student-card', vueModel.studentCard)
    },

    emitGivenMobile() {
      const vueModel = this
      if (isNaN(vueModel.mobile)) {
        vueModel.errorText = '請輸入手機 10 碼數字'
      } else {
        vueModel.$emit('given-mobile', vueModel.mobile)
      }
    },

    unfoldStudentCardQuery(event) {
      event.currentTarget.style.display = 'none'
      document.getElementById('student-card-query').style.display = ''
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
      // window.open('https://' + this.host + '/app/member-center/login.html', '_blank')
      window.open('https://www.tbbt.com.tw/app/member-center/login.html', '_blank')
    },

    // 當輪播圖片切換，像是點擊圓點時
    changeActiveImage(index) {
      this.active = index
    }
  }
}
</script>

<style lang="less">
#line-binding-input {
  .mu-input-label {
    font-size: 24px;
  }

  .mu-select-input {
    font-size: 19px;
    color: #01579b;
  }

  .choice-account {
    position: relative;
    top: -20px;
    font-size: 15px;
  }

  .mu-input {
    font-size: 20px;

    input[type="text"]::-webkit-input-placeholder {
      font-size: 18px
    }

    .mu-input-help {
      font-size: 15px;
    }
  }

  .student-card-query {
    height: 700px;
    width: 240px;
    background-image: url('~@/static/img/student-card-query.png');
    background-size: cover;
  }

  .how-to-get-student-card {
    text-decoration: underline;
    font-size: 18px;
    font-weight: 500;
    margin-left: 990px;
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

</style>
