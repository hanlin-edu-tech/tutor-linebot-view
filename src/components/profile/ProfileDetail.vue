<template>
  <article id="profile-detail">
    <mu-container>
      <mu-list v-show="status === 'success'">
        <mu-list-item class="email">
          <mu-list-item-action>
            <mu-icon value="person_pin"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>
            <span>帳號：
              <br />{{profile.email}}
            </span>
          </mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider-height2"></mu-divider>
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
          <mu-list-item-title>身分：{{role}}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="bubble_chart"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>年級：{{profile.grade}}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <!--
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
       -->
      </mu-list>
      <div class="app-center" v-show="status !== 'success'">
        <DetermineUnsuccessfulStatus :status="status">{{retrieveFailed}}</DetermineUnsuccessfulStatus>
      </div>
    </mu-container>
  </article>
</template>

<script>
  import store from '../../store/store'
  import { mapState } from 'vuex'
  import DetermineUnsuccessfulStatus from '../layout/DetermineUnsuccessfulStatus'

  export default {
    name: 'ProfileDetail',
    data () {
      return {
        lineUserId: this.$route.params['specificLineUser'],
        studentCard: this.$route.params['studentCard'],
        role: '',
        status: '',
        profile: {}
      }
    },

    components: {
      DetermineUnsuccessfulStatus
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/profile/${vueModel.lineUserId}?studentCard=${vueModel.studentCard}`,
        })
        .then(response => {
          let profile = response.data.content
          vueModel.profile = profile
          if(profile.role === 'parent') {
            vueModel.role = '家長'
            vueModel.$emit('is-parent')
          } else {
            vueModel.role = '學生'
          }

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
    },

    store
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
      height: 50vh;
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
      height: 60px;
    }

    .general {
      height: 45px;
    }
  }
</style>
