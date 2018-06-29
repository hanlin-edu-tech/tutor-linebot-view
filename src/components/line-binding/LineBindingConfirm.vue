<template>
  <div id="line-binding-confirm" class="font-secondary-info">
    <mu-container>
      <mu-row class="center">
        <mu-col span="12">
          <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="12">
          以下為您輸入的學號所對應之 E-Mail，請再次確認是否正確！
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="12">
          學號：<span class="font-important-info">{{studentCard}}</span>
          <br />
          帳號：
          <span class="info">{{content}}</span>
        </mu-col>
      </mu-row>
    </mu-container>
  </div>
</template>

<script>
  export default {
    name: 'LineBindingConfirm',
    data () {
      return {
        content: '',
      }
    },

    props: {
      studentCard: String
    },

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `https://www.tbbt.com.tw/linebot/lineBinding/${this.studentCard}`,
        })
        .then(response => {
          let jsonData = response.data
          vueModel.content = jsonData.content

          // 查詢成功，即 vueModel.content = email
          if (jsonData.message.indexOf('success') > 0) {
            vueModel.$emit('is-show-completed-btn', vueModel.content)
          }
        })
        .catch(() => {
          vueModel.content = 'email 查詢失敗，請稍候再試'
        })
    },

    mounted () {
      document.querySelector('.mu-circular-progress').remove()
    }
  }
</script>

<style lang="less">
  #line-binding-confirm .container {
    font-size: 1.4em;
  }

  #line-binding-confirm {
    span {
      font-weight: 500;
    }

    .info {
      font-size: 1.1em;
      word-break: break-all;
    }
  }
</style>
