<template>
  <section id="multi-profile">
    <mu-row>
      <mu-alert class="choice-account font-secondary-info">
        <mu-col span="12">
          <span>請點選您欲查看的帳號：</span>
        </mu-col>
      </mu-alert>
    </mu-row>
    <mu-row class="layout-main-content" v-show="status === 'success'"
            v-for="(authentication, studentCard) in studentCardAuthenticationMapping" :key="studentCard"
            @click="retrieveSpecificProfile(studentCard)">
      <mu-alert>
        <mu-col span="11">
          <span>{{authentication.userName}}</span>
          <span>{{authentication.email}}</span>
        </mu-col>
        <mu-col span="1">
          <mu-icon value="keyboard_arrow_right" class="icon-forward-detail"></mu-icon>
        </mu-col>
      </mu-alert>
    </mu-row>
    <mu-row class="app-center" v-show="status === 'empty'">
      <mu-alert>
        <mu-col span="12">
          <span>您尚未綁定任何帳號喔！</span>
        </mu-col>
      </mu-alert>
    </mu-row>
    <!-- 異常狀況 -->
    <div class="app-center" v-show="(status !== 'success' && status !== 'empty')">
      <DetermineUnsuccessfulStatus :status="status">{{retrieveFailed}}</DetermineUnsuccessfulStatus>
    </div>
    <p class="app-center" v-if="isParent">
      <mu-button color="lightBlue900" class="btn-primary" @click="binding">綁定更多帳號</mu-button>
    </p>
  </section>
</template>

<script>
  import store from '../../store/store'
  import { mapState, mapActions } from 'vuex'
  import DetermineUnsuccessfulStatus from '../layout/DetermineUnsuccessfulStatus'

  export default {
    name: 'MultiProfile',
    components: {
      DetermineUnsuccessfulStatus
    },

    data () {
      return {
        lineUserId: this.$route.params['specificLineUser'],
        panel: this.$route.params['panel'],
        status: '',
        isParent: true,
        studentCardAuthenticationMapping: Object
      }
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/profile/${vueModel.lineUserId}`,
        })
        .then(response => {
          let jsonData = response.data
          let studentCardAuthenticationMapping = jsonData.content
          vueModel.studentCardAuthenticationMapping = studentCardAuthenticationMapping

          if (Object.keys(studentCardAuthenticationMapping).length) {
            for (let studentCard in studentCardAuthenticationMapping) {
              let authentication = studentCardAuthenticationMapping[studentCard]
              if (authentication.role === 'student') {
                vueModel.isParent = false
              }
            }

            vueModel.status = 'success'
          } else {
            vueModel.status = 'empty'
          }
        })
        .catch(error => {
          console.error(error)
          vueModel.status = 'failure'
        })
    },

    methods: Object.assign(
      {
        binding () {
          this.$router.replace(`/lineBinding/${this.lineUserId}`)
        },

        retrieveSpecificProfile (studentCard) {
          this.$router.replace(`/profile/${this.lineUserId}/${studentCard}/${this.panel}`)
        }
      },

      mapActions('step', {
        resetStepAction: 'resetStepAction'
      }),
    ),

    store
  }
</script>

<style lang="less">
  #multi-profile {
    .icon-forward-detail {
      font-size: 47px;
      font-weight: 600;
    }

    .mu-alert {
      padding: 0 30px 0 10px;
      min-height: 100px;
      color: rgba(0, 0, 0, .87);
      background-color: rgb(176, 245, 191);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .choice-account {
      padding: 0 3px;
      margin-top: -10px;
      min-height: 60px;
      background-color: #FAFAFA;
      font-size: 20px;
      font-weight: 500;
    }

    span {
      display: inline-block;
      word-break: break-all;
      line-height: 30px;

      &:first-child {
        font-size: 20px;
      }
    }
  }
</style>
