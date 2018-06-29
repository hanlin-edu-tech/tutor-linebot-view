<template>
  <article id="profile-detail">
    <mu-container>
      <mu-list v-if="status === 'success'">
        <mu-list-item class="email">
          <mu-list-item-action>
            <mu-icon value="person_pin"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>
            <span>帳號：{{profile.email}}</span>
          </mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="school"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>學號：{{profile.studentCard}}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="supervisor_account"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>身分：{{profile.role}}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="bubble_chart"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>年級：{{profile.grade}}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-title>帳號資產：
          </mu-list-item-title>
        </mu-list-item>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="grade"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title><span>e 幣：{{10000}}</span></mu-list-item-title>
        </mu-list-item>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="stars"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title><span>寶石：{{10000}}</span></mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
      </mu-list>
      <div class="center result result-failure" v-else-if="status === 'failure'">
        <mu-icon left value="warning" class="icon-global"></mu-icon>
        {{retrieveFailed}}
      </div>
      <mu-row class="center" v-else>
        <mu-col span="12">
          <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
        </mu-col>
      </mu-row>
    </mu-container>
  </article>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ProfileDetail',
    data () {
      return {
        status: String,
        profile: Object
      }
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      let vueModel = this
      let lineUserId = vueModel.$route.params['specificLineUser']
      let studentCard = vueModel.$route.params['studentCard']
      vueModel
        .axios({
          method: 'get',
          url: `https://www.tbbt.com.tw/linebot/profile/${lineUserId}?studentCard=${studentCard}`,
        })
        .then(response => {
          let jsonData = response.data
          vueModel.profile = jsonData.content
          vueModel.status = 'success'
        })
        .catch((error) => {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    mounted () {
      document.querySelectorAll('#profile .mu-item-title')
        .forEach(itemTitle => {
          itemTitle.style.wordBreak = 'break-all'
        })
    }
  }
</script>

<style lang="less">
  #profile-detail {
    .mu-divider {
      margin-top: 0;
    }

    .mu-icon {
      margin-left: -13px;
      font-size: 28px;
      font-weight: 500;
    }

    .mu-list {
      height: 65vh;
    }

    .mu-item-action {
      min-width: 30px;
    }

    .mu-item-title {
      font-size: 1.3em;
      font-weight: 500;
      overflow: visible;
      white-space: normal;
      height: unset;

      span {
        display: inline-block;
        word-break: break-all;
        width: 230px;
      }
    }

    .email {
      height: 52px;
    }

    .general {
      height: 45px;
    }
  }
</style>
