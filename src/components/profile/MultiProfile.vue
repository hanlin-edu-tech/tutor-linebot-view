<template>
  <section id="multi-profile">
    <mu-row>
      <mu-alert class="tip font-secondary-info">
        <mu-col span="12">
          <span>家長/老師您好，<br />請點選您欲查看的帳號：</span>
        </mu-col>
      </mu-alert>
    </mu-row>
    <article v-if="status === 'success'">
      <mu-row class="layout-main-content"
              v-for="(email, studentCard) in studentCardEmailMapping" :key="studentCard"
              @click="retrieveSpecificProfile(studentCard)">
        <mu-alert>
          <mu-col span="11">
            <span>{{studentCard}}</span>
            <span>{{email}}</span>
          </mu-col>
          <mu-col span="1">
            <mu-icon value="keyboard_arrow_right" class="icon-forward-detail"></mu-icon>
          </mu-col>
        </mu-alert>
      </mu-row>
    </article>
    <div class="center result result-failure" v-else-if="status === 'failure'">
      <mu-icon left value="warning" class="icon-global"></mu-icon>
      {{retrieveFailed}}
    </div>
    <mu-row class="center" v-else>
      <mu-col span="12">
        <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
      </mu-col>
    </mu-row>
  </section>

</template>

<script>
  export default {
    name: 'MultiProfile',
    data () {
      return {
        status: String,
        studentCardEmailMapping: Object,
        lineUserId: ''
      }
    },

    created () {
      let vueModel = this
      vueModel.lineUserId = vueModel.$route.params['specificLineUser']
      vueModel
        .axios({
          method: 'get',
          url: `https://www.tbbt.com.tw/linebot/profile/${vueModel.lineUserId}`,
        })
        .then(response => {
          let jsonData = response.data
          vueModel.studentCardEmailMapping = jsonData.content
          vueModel.status = 'success'
        })
        .catch(error => {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    methods: {
      retrieveSpecificProfile (studentCard) {
        this.$router.push(`/profile/${this.lineUserId}/${studentCard}`)
      }
    }
  }
</script>

<style lang="less">
  #multi-profile {
    .icon-forward-detail {
      font-size: 45px;
      font-weight: 600;
    }

    .mu-alert {
      padding: 0 30px 0 10px;
      min-height: 100px;
      color: rgba(0, 0, 0, .87);
      background-color: rgb(176, 245, 191);
      font-size: 1.3em;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .tip {
      padding: 0 3px;
      margin-top: -10px;
      min-height: 60px;
      background-color: #FAFAFA;
      font-size: 1.1em;
      font-weight: 500;
    }

    span {
      display: inline-block;
      word-break: break-all;
      line-height: 30px;

      &:first-child {
        font-size: 1.3em;
      }
    }
  }
</style>
