<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep" orientation="vertical">
      <mu-step v-if="!isBound">
        <mu-step-label>
          請選擇你的身份
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingAuthentication @retrieve-role="retrieveRole"></LineBindingAuthentication>
          </p>
          <mu-button @click="handleNext" color="lightBlue900" v-if="isShowSecondBtn">下一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          請輸入您欲綁定的學號：
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingInput @retrieve-student-card="retrieveStudentCard"
                              @retrieve-mobile="retrieveMobile"></LineBindingInput>
          </p>
          <mu-button @click="handleNext" color="lightBlue900">下一步</mu-button>
          <mu-button flat class="color-primary" v-if="!isBound" @click="handlePrevious">上一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          資料確認
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingConfirm :role="role" :studentCard="studentCard" :mobile="mobile" :lineUserId="lineUserId"
                                @is-show-completed-btn="isRetrieveEmail"
                                @is-show-query-profiles-btn="isBindingSameStudentCard"></LineBindingConfirm>
          </p>
          <mu-button color="lightBlue900" @click="completedLineBinding" v-if="isShowCompletedBtn">完成</mu-button>
          <mu-button flat class="color-primary" @click="handlePrevious">上一步</mu-button>
          <mu-button color="lightBlue900" @click="queryProfiles" v-if="isShowQueryProfilesBtn">帳號查詢</mu-button>
        </mu-step-content>
      </mu-step>
    </mu-stepper>
    <p v-if="isCompleted">
      <LineBindingResult></LineBindingResult>
    </p>
  </section>
</template>

<script>
  import LineBindingAuthentication from './LineBindingAuthentication'
  import LineBindingInput from './LineBindingInput'
  import LineBindingConfirm from './LineBindingConfirm'
  import LineBindingResult from './LineBindingResult'
  import store from '../../store/store'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'LineBinding',
    components: {
      LineBindingAuthentication,
      LineBindingInput,
      LineBindingConfirm,
      LineBindingResult
    },

    data () {
      return {
        role: '',
        studentCard: '',
        mobile: '',
        email: '',
        userName: '',
        messageResult: '',
        /* 成功取得 role，才顯示通往輸入學號的下一步 button */
        isShowSecondBtn: false,
        /* 如果成功取得 email，才顯示完成的 button */
        isShowCompletedBtn: false,
        /* 如果家長綁定了同一個學號，才顯示帳號查詢之 button */
        isShowQueryProfilesBtn: false,
        lineUserId: this.$route.params['specificLineUser'],
        isBound: Boolean
      }
    },

    created () {
      this.resetStepAction()
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/profile/${vueModel.lineUserId}`,
        })
        .then(response => {
          let jsonData = response.data
          let studentCardAuthenticationMapping = jsonData.content
          if (Object.keys(studentCardAuthenticationMapping).length) {
            vueModel.assignStudentCardAuthenticationMappingAction(studentCardAuthenticationMapping)

            for (let studentCard in studentCardAuthenticationMapping) {
              let authentication = studentCardAuthenticationMapping[studentCard]
              /*
               * 只有家長才能綁定其他帳號，
               * 如果家長先前已有綁定過學號，則不需要選擇身份
               */
              if (authentication.role === 'parent') {
                vueModel.isBound = true
                vueModel.retrieveRole('parent')
                return
              }
            }
          }
          vueModel.isBound = false
        })
        .catch(error => {
          console.error(error)
          vueModel.isBound = false
        })
    },

    mounted () {
      document.querySelector('#line-binding .mu-stepper').style.height = `${window.innerHeight * 0.45}px`
    },

    computed: Object.assign(
      {
        isCompleted () {
          let isNotBound = this.bindingStep > 2
          let isBound = (this.isBound && this.bindingStep > 1)

          return isNotBound || isBound
        }
      },
      mapState('step', ['bindingStep'])
    ),

    methods: Object.assign(
      {
        retrieveRole (role) {
          if (role) {
            this.role = role
            this.isShowSecondBtn = true
          } else {
            this.isShowSecondBtn = false
          }
        },

        retrieveStudentCard (studentCard) {
          this.studentCard = studentCard
        },

        retrieveMobile (mobile) {
          this.mobile = mobile
        },

        isRetrieveEmail (specificUser) {
          if (specificUser.email) {
            this.email = specificUser.email
            this.userName = specificUser.name
            this.isShowCompletedBtn = true
          } else {
            this.isShowCompletedBtn = false
          }
        },

        isBindingSameStudentCard () {
          this.isShowQueryProfilesBtn = true
        },

        completedLineBinding () {
          this.assignBindingAction({
            studentCard: this.studentCard,
            authentications: [
              {
                'lineUserId': this.lineUserId,
                'role': this.role,
                'email': this.email,
                'userName': this.userName
              }
            ]
          })
          this.handleNext()
        },

        queryProfiles () {
          this.$router.push(`/profile/${this.lineUserId}`)
        },
      },

      mapActions('step', {
        handleNext: 'forwardStepAction',
        handlePrevious: 'backwardStepAction',
        resetStepAction: 'resetStepAction'
      }),

      mapActions('binding', ['assignBindingAction', 'assignStudentCardAuthenticationMappingAction'])
    ),

    store
  }
</script>

<style lang="less">
  @titleFont: 1.4em;
  @containerWidth: 29px;
  @stepLabelCircleSquare: 25px;
  @stepLabelCircleFont: 0.8em;

  #line-binding .mu-stepper {
    .mu-step-label.active {
      font-size: @titleFont;

      .mu-step-label-icon-container {
        width: 35px;
        margin-right: 3px;

        .mu-step-label-circle {
          background-color: #01579b;
          width: @stepLabelCircleSquare;
          height: @stepLabelCircleSquare;
          font-size: @stepLabelCircleFont;
          line-height: 23px;
        }
      }
    }

    .mu-step-label.completed {
      font-size: @titleFont;
      color: #535051;
      height: 60px;

      .mu-step-label-icon-container {
        width: @containerWidth;

        .mu-step-label-icon {
          margin-left: -2px;
          width: 30px;
          height: 30px;
        }
      }
    }

    .mu-step-label.disabled {
      font-size: @titleFont;
      height: 50px;

      .mu-step-label-icon-container {
        width: @containerWidth;

        .mu-step-label-circle {
          width: @stepLabelCircleSquare;
          height: @stepLabelCircleSquare;
          font-size: @stepLabelCircleFont;
          line-height: 23px;
        }
      }
    }

    .mu-step-content {
      .mu-button {
        width: 28vw;
        height: 40px;
        font-size: @titleFont - 0.1;
        font-weight: 500;

        .mu-button-wrapper {
          padding: 2px;
        }
      }
    }
  }
</style>
