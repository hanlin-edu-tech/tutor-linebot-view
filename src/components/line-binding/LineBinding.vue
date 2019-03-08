<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep" orientation="vertical">
      <mu-step v-if="!isParentBound">
        <mu-step-label>
          請選擇你的身份
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingAuthentication @retrieve-role="retrieveRole"></LineBindingAuthentication>
          </p>
          <mu-button @click="handleNext" color="lightBlue900" v-show="isShowNextToInputBtn">下一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          請輸入欲綁定的學號：
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingInput @retrieve-student-card="retrieveStudentCard"
                              @retrieve-mobile="retrieveMobile"></LineBindingInput>
          </p>
          <mu-button @click="handleNext" color="lightBlue900" v-show="isShowNextToConfirmBtn">下一步</mu-button>
          <mu-button flat class="color-primary" v-if="!isParentBound" @click="inputToPrevious">上一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          資料確認
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingConfirm :role="role" :student-card="studentCard" :mobile="mobile" :line-user-id="lineUserId"
                                @retrieve-email="retrieveEmail"
                                @binding-same-student-card="bindingSameStudentCard"></LineBindingConfirm>
          </p>
          <mu-button color="lightBlue900" @click="completedLineBinding" v-show="isShowCompletedBtn">完成</mu-button>
          <mu-button flat class="color-primary" @click="confirmToPrevious">上一步</mu-button>
          <mu-button color="lightBlue900" @click="queryProfiles" v-show="isShowQueryProfilesBtn">帳號查詢</mu-button>
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
        name: '',
        messageResult: '',
        /* 成功取得 role，才顯示通往輸入學號的下一步 button */
        isShowNextToInputBtn: false,
        isShowNextToConfirmBtn: false,
        /* 如果成功取得 email，才顯示完成的 button */
        isShowCompletedBtn: false,
        /* 如果家長綁定了同一個學號，才顯示帳號查詢之 button */
        isShowQueryProfilesBtn: false,
        lineUserId: this.$route.params['specificLineUser'],
        isParentBound: Boolean
      }
    },

    created () {
      let vueModel = this
      vueModel.resetStepAction()
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/profile/${vueModel.lineUserId}`,
        })
        .then(response => {
          let jsonData = response.data
          let lineBindingStudentCards = jsonData.content
          vueModel.isParentBound = false
          if (lineBindingStudentCards.length > 0) {
            let studentCards = []
            lineBindingStudentCards.forEach(lineBindingStudentCard => {
              studentCards.push(lineBindingStudentCard.studentCard)
              lineBindingStudentCard.authentications.forEach(authentication => {
                if (authentication.role === 'parent') {
                  vueModel.isParentBound = true
                  vueModel.retrieveRole('parent')
                }
              })
            })
            this.assignStudentCardsAction(studentCards)
          }
        })
        .catch(error => {
          console.error(error)
          vueModel.isParentBound = false
        })
    },

    mounted () {
      document.querySelector('#line-binding .mu-stepper').style.height = `${window.innerHeight * 0.45}px`
    },

    computed: Object.assign(
      {
        isCompleted () {
          let isNotBound = this.bindingStep > 2
          let isParentBound = (this.isParentBound && this.bindingStep > 1)
          return isNotBound || isParentBound
        }
      },
      mapState('step', ['bindingStep'])
    ),

    methods: Object.assign(
      {
        retrieveRole (role) {
          if (role) {
            this.role = role
            this.isShowNextToInputBtn = true
          }
        },

        retrieveStudentCard (studentCard) {
          if (studentCard) {
            this.studentCard = studentCard
            this.isShowNextToConfirmBtn = true
          } else {
            this.isShowNextToConfirmBtn = false
          }
        },

        retrieveMobile (mobile) {
          if (mobile) {
            this.mobile = mobile
            this.isShowNextToConfirmBtn = true
          } else {
            this.isShowNextToConfirmBtn = false
          }
        },

        retrieveEmail (specificUser) {
          if (specificUser && specificUser.email) {
            this.email = specificUser.email
            this.studentCard = specificUser.studentCard
            this.mobile = specificUser.mobile
            this.name = specificUser.name
            this.isShowCompletedBtn = true
          } else {
            this.isShowCompletedBtn = false
          }
        },

        bindingSameStudentCard () {
          this.isShowQueryProfilesBtn = true
        },

        completedLineBinding () {
          let lineBindingStudentCard = {
            studentCard: this.studentCard,
            email: this.email,
            name: this.name,
            mobile: this.mobile,
          }

          if (this.role === 'parent') {
            lineBindingStudentCard.authentications = [
              {
                lineUserId: this.lineUserId,
                role: this.role,
                parentsOnLine: {
                  notifyFrequency: 'hourly'
                }
              }
            ]
          } else {
            lineBindingStudentCard.authentications = [
              {
                lineUserId: this.lineUserId,
                role: this.role
              }
            ]
          }

          this.assignBindingAction(lineBindingStudentCard)
          this.handleNext()
        },

        queryProfiles () {
          this.$router.push(`/profile/${this.lineUserId}`)
        },

        inputToPrevious () {
          this.role = ''
          this.isShowNextToInputBtn = false
          this.handlePrevious()
        },

        confirmToPrevious () {
          this.studentCard = ''
          this.mobile = ''
          this.isShowNextToConfirmBtn = false
          this.isShowQueryProfilesBtn = false
          this.handlePrevious()
        }
      },

      mapActions('step', {
        handleNext: 'forwardStepAction',
        handlePrevious: 'backwardStepAction',
        resetStepAction: 'resetStepAction'
      }),

      mapActions('binding', ['assignBindingAction', 'assignStudentCardsAction'])
    ),

    store
  }
</script>

<style lang="less">
  @titleFont: 22px;
  @containerWidth: 29px;
  @stepLabelCircleSquare: 25px;
  @stepLabelCircleFont: 22px;

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
