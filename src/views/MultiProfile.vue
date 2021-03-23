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
      <DetermineUnsuccessfulStatus v-show="status === 'failure'" :status="status">{{ retrieveFailed }}
      </DetermineUnsuccessfulStatus>
      <p class="app-center" v-if="isParent">
        <mu-button color="lightBlue900" class="btn-primary" @click="binding">綁定更多帳號</mu-button>
      </p>
    </article>
  </section>
</template>

<script>
  import store from '@/store/store'
  import { mapState } from 'vuex'
  import DetermineUnsuccessfulStatus from '@/components/layout/DetermineUnsuccessfulStatus'
  import TipSubtitle from '@/components/layout/TipSubtitle'

  export default {
    store,
    name: 'MultiProfile',
    components: {
      DetermineUnsuccessfulStatus,
      TipSubtitle
    },

    props: {
      refresh: Boolean
    },

    data () {
      const vueModel = this
      return {
        lineUserId: vueModel.$route.params['specificLineUser'],
        panel: vueModel.$route.params['panel'] ? vueModel.$route.params['panel'] : 'panels',
        menuFunction: vueModel.$route.query['menuFunction'] ? vueModel.$route.query['menuFunction'] : '',
        status: '',
        isParent: vueModel,
        lineBindingStudentCards: Object
      }
    },

    computed: mapState('unifyDesc', ['retrieveFailed']),

    async created () {
      const vueModel = this
      if (vueModel.refresh === true) {
        window.location.reload()
      }

      const response = await vueModel.$axios({
        method: 'get',
        url: `/linebot/profile/${vueModel.lineUserId}`,
      })

      try {
        const jsonData = response.data
        const lineBindingStudentCards = jsonData.content
        if (lineBindingStudentCards.length > 0) {
          for (let i = 0; i < lineBindingStudentCards.length; i++) {
            const lineBindingStudentCard = lineBindingStudentCards[i]
            lineBindingStudentCard.authentications.forEach(authentication => {
              if (authentication.lineUserId === vueModel.lineUserId && authentication.role === 'student') {
                vueModel.isParent = false
              }
            })

            if (lineBindingStudentCards.length === 1) {
              const isMultiLineBindingStudentCard = false
              vueModel.determineRouteFunction(
                vueModel.menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard)
            }
          }

          vueModel.lineBindingStudentCards = lineBindingStudentCards
          vueModel.status = 'success'
        } else {
          vueModel.status = 'empty'
        }
      } catch (error) {
        console.error(error)
        vueModel.status = 'failure'
      }
    },

    methods: Object.assign(
      {
        binding () {
          const vueModel = this
          vueModel.$router.replace(`/lineBinding/${vueModel.lineUserId}`)
        },

        determineRouteFunction (menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard) {
          const vueModel = this
          vueModel.routeProfile(lineBindingStudentCard, isMultiLineBindingStudentCard)
        },

        retrieveSpecificInfo (lineBindingStudentCard) {
          const vueModel = this
          /* 取回特定 profile，表示一定是綁定多筆帳號 */
          const isMultiLineBindingStudentCard = true
          const menuFunction = vueModel.menuFunction
          vueModel.determineRouteFunction(menuFunction, lineBindingStudentCard, isMultiLineBindingStudentCard)
        },

        routeProfile (lineBindingStudentCard, isMultiLineBindingStudentCard) {
          const vueModel = this
          vueModel.$router.replace(
            {
              name: 'Profile',
              params: {
                specificLineUser: vueModel.lineUserId,
                studentCard: lineBindingStudentCard.studentCard,
                panel: vueModel.panel,
                lineBindingStudentCard: lineBindingStudentCard,
                isMultiLineBindingStudentCard: isMultiLineBindingStudentCard
              }
            }
          )
        }
      }
    )
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
