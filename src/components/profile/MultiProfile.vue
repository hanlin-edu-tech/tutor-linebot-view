<template>
  <section>
    <TipSubtitle>
      <mu-icon class="icon-padding-right" value="contacts"></mu-icon>
      請點選您欲查看的帳號
    </TipSubtitle>
    <article id="multi-profile">
      <mu-row class="layout-main-content" v-show="status === 'success'"
              v-for="lineBindingStudentCard in lineBindingStudentCards" :key="lineBindingStudentCard.studentCard"
              @click="retrieveSpecificInfo(lineBindingStudentCard)">
        <mu-alert>
          <mu-col span="11">
            <span>{{ lineBindingStudentCard.name }}</span>
            <span>{{ lineBindingStudentCard.email }}</span>
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
        <DetermineUnsuccessfulStatus :status="status">{{ retrieveFailed }}</DetermineUnsuccessfulStatus>
      </div>
      <p class="app-center" v-if="isParent">
        <mu-button color="lightBlue900" class="btn-primary" @click="binding">綁定更多帳號</mu-button>
      </p>
    </article>
  </section>
</template>

<script>
  import store from '../../store/store'
  import { mapState } from 'vuex'
  import DetermineUnsuccessfulStatus from '../layout/DetermineUnsuccessfulStatus'
  import TipSubtitle from '../layout/TipSubtitle'

  export default {
    name: 'MultiProfile',
    components: {
      DetermineUnsuccessfulStatus,
      TipSubtitle
    },

    props: {
      refresh: Boolean
    },

    data () {
      return {
        lineUserId: this.$route.params['specificLineUser'],
        panel: this.$route.params['panel'] ? this.$route.params['panel'] : 'panels',
        menuFunction: this.$route.query['menuFunction'] ? this.$route.query['menuFunction'] : '',
        status: '',
        isParent: true,
        lineBindingStudentCards: Object
      }
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    created () {
      if (this.refresh === true) {
        window.location.reload()
      }

      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/profile/${ vueModel.lineUserId }`,
        })
        .then(response => {
          let jsonData = response.data
          let lineBindingStudentCards = jsonData.content
          if (lineBindingStudentCards.length > 0) {
            for (let i = 0; i < lineBindingStudentCards.length; i++) {
              let lineBindingStudentCard = lineBindingStudentCards[i]
              lineBindingStudentCard.authentications.forEach(authentication => {
                if (authentication.lineUserId === vueModel.lineUserId && authentication.role === 'student') {
                  vueModel.isParent = false
                }
              })

              if (lineBindingStudentCards.length === 1) {
                let isMultiLineBindingStudentCard = false
                vueModel.determineRouteFunction(
                  vueModel.menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard)
              }
            }

            vueModel.lineBindingStudentCards = lineBindingStudentCards
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
          this.$router.replace(`/lineBinding/${ this.lineUserId }`)
        },

        determineRouteFunction (menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard) {
          switch (menuFunction) {
            case 'parentsOnline': {
              this.$router.replace({
                name: 'ParentsOnline',
                params: {
                  specificLineUser: this.lineUserId,
                  studentCard: lineBindingStudentCard.studentCard,
                  lineBindingStudentCard: lineBindingStudentCard,
                  isMultiLineBindingStudentCard: isMultiLineBindingStudentCard
                }
              })
              break
            }
            default : {
              this.routeProfile(lineBindingStudentCard, isMultiLineBindingStudentCard)
            }
          }
        },

        retrieveSpecificInfo (lineBindingStudentCard) {
          /* 取回特定 profile，表示一定是綁定多筆帳號 */
          let isMultiLineBindingStudentCard = true
          let menuFunction = this.menuFunction
          this.determineRouteFunction(menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard)
        },

        routeProfile (lineBindingStudentCard, isMultiLineBindingStudentCard) {
          this.$router.replace({
            name: 'Profile',
            params: {
              specificLineUser: this.lineUserId,
              studentCard: lineBindingStudentCard.studentCard,
              panel: this.panel,
              lineBindingStudentCard: lineBindingStudentCard,
              isMultiLineBindingStudentCard: isMultiLineBindingStudentCard
            }
          })
        }
      }
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
