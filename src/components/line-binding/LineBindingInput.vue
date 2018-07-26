<template>
  <article id="line-binding-input">
    <mu-select label="選擇學號或手機" v-model="choice" full-width>
      <mu-option v-for="key in Object.keys(options)" :key="key" :label="options[key]" :value="key"></mu-option>
    </mu-select>
    <span class="tip font-secondary-info">小提醒：若您未曾於翰林雲端學院購買課程，請登入認證後以學號登入</span>
    <div v-show="choice === 'studentCard'">
      <mu-text-field v-model="studentCard" type="text" placeholder="請輸入學號" action-icon="edit"
                     @change="givenStudentCard" full-width></mu-text-field>
      <a href="https://www.ehanlin.com.tw/Users/login.html">
        <div id="student-card-query" class="student-card-query" style="display: none;"></div>
      </a>
      <span class="color-primary how-to-get-student-card" @click="unfoldStudentCardQuery($event)">如何獲得學號？</span>
    </div>
    <div v-show="choice === 'mobile'">
      <mu-text-field v-model="mobile" type="text" placeholder="請輸入手機號碼" action-icon="phone"
                     @change="givenMobile" @keyup="verify" :error-text="errorText" full-width></mu-text-field>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'LineBindingInput',
    data () {
      return {
        choice: '',
        options: {
          studentCard: '學號',
          mobile: '手機'
        },
        studentCard: '',
        mobile: '',
        errorText: ''
      }
    },
    methods: {
      givenStudentCard () {
        this.$emit('retrieve-student-card', this.studentCard)
      },

      givenMobile () {
        this.$emit('retrieve-mobile', this.mobile)
      },

      verify () {
        if (isNaN(this.mobile)) {
          this.errorText = '請輸入手機 10 碼數字'
        }
      },

      unfoldStudentCardQuery (event) {
        event.currentTarget.style.display = 'none'
        document.getElementById('student-card-query').style.display = ''
      }
    }
  }
</script>

<style lang="less">
  #line-binding-input {
    .mu-select-input {
      font-size: 18px;
      color: #01579b;
    }

    .tip {
      position: relative;
      top: -20px;
      font-size: 13px;
    }

    .mu-input {
      font-size: 1.5em;
    }

    .student-card-query {
      height: 700px;
      width: 240px;
      background-image: url("../../img/student-card-query.png");
      background-size: cover;
    }

    .how-to-get-student-card {
      text-decoration: underline;
      font-size: 18px;
      font-weight: 500;
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

</style>
