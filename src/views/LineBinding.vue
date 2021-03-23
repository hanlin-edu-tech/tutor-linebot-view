<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep" orientation="vertical">
      <mu-step v-if="!isParentBound">
        <mu-step-label>
          請選擇你的身份
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingAuthentication @given-role="givenRole"></LineBindingAuthentication>
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
            <LineBindingInput @given-student-card="givenStudentCard"
                              @given-mobile="givenMobile"></LineBindingInput>
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
                                @given-email="givenEmail"
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
  import LineBindingAuthentication from '@/components/line-binding/LineBindingAuthentication'
  import LineBindingInput from '@/components/line-binding/LineBindingInput'
  import LineBindingConfirm from '@/components/line-binding/LineBindingConfirm'
  import LineBindingResult from '@/components/line-binding/LineBindingResult'
  import store from '@/store/store'
  import { mapState, mapActions } from 'vuex'

  export default {
    store,
    name: 'LineBinding',
    components: {
      LineBindingAuthentication,
      LineBindingInput,
      LineBindingConfirm,
      LineBindingResult
    },

    data () {
      const vueModel = this
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
        lineUserId: vueModel.$route.params['specificLineUser'],
        isParentBound: Boolean
      }
    },

    async created () {
      const vueModel = this
      vueModel.resetStepAction()

      try {
        const response = await vueModel.$axios({
          method: 'get',
          url: `/linebot/profile/${vueModel.lineUserId}`,
        })
        const jsonData = response.data
        const lineBindingStudentCards = jsonData.content
        vueModel.isParentBound = false
        if (lineBindingStudentCards.length > 0) {
          const studentCards = []
          lineBindingStudentCards.forEach(lineBindingStudentCard => {
            studentCards.push(lineBindingStudentCard.studentCard)
            lineBindingStudentCard.authentications.forEach(authentication => {
              if (authentication.role === 'parent') {
                vueModel.isParentBound = true
                vueModel.givenRole('parent')
              }
            })
          })
          vueModel.assignStudentCardsAction(studentCards)
        }
      } catch (error) {
        console.error(error)
        vueModel.isParentBound = false
      }
    },

    mounted () {
      document.querySelector('#line-binding .mu-stepper').style.height = `${window.innerHeight * 0.45}px`
    },

    computed: Object.assign(
      {
        isCompleted () {
          const vueModel = this
          let isNotBound = vueModel.bindingStep > 2
          let isParentBound = (vueModel.isParentBound && vueModel.bindingStep > 1)
          return isNotBound || isParentBound
        }
      },
      mapState('step', ['bindingStep'])
    ),

    methods: Object.assign(
      {
        givenRole (role) {
          const vueModel = this
          if (role) {
            vueModel.role = role
            vueModel.isShowNextToInputBtn = true
          }
        },

        givenStudentCard (studentCard) {
          const vueModel = this
          if (studentCard) {
            vueModel.studentCard = studentCard
            vueModel.isShowNextToConfirmBtn = true
          } else {
            vueModel.isShowNextToConfirmBtn = false
          }
        },

        givenMobile (mobile) {
          const vueModel = this
          if (mobile) {
            vueModel.mobile = mobile
            vueModel.isShowNextToConfirmBtn = true
          } else {
            vueModel.isShowNextToConfirmBtn = false
          }
        },

        givenEmail (specificUser) {
          const vueModel = this
          if (specificUser && specificUser.email) {
            vueModel.email = specificUser.email
            vueModel.studentCard = specificUser.studentCard
            vueModel.mobile = specificUser.mobile
            vueModel.name = specificUser.name
            vueModel.isShowCompletedBtn = true
          } else {
            vueModel.isShowCompletedBtn = false
          }
        },

        bindingSameStudentCard () {
          const vueModel = this
          vueModel.isShowQueryProfilesBtn = true
        },

        completedLineBinding () {
          const vueModel = this
          const lineBindingStudentCard = {
            studentCard: vueModel.studentCard,
            email: vueModel.email,
            name: vueModel.name,
            mobile: vueModel.mobile,
          }


          lineBindingStudentCard.authentications = [
            {
              lineUserId: vueModel.lineUserId,
              role: vueModel.role
            }
          ]


          vueModel.assignBindingAction(lineBindingStudentCard)
          vueModel.handleNext()
        },

        queryProfiles () {
          const vueModel = this
          vueModel.$router.push(`/profile/${vueModel.lineUserId}`)
        },

        inputToPrevious () {
          const vueModel = this
          vueModel.role = ''
          vueModel.isShowNextToInputBtn = false
          vueModel.handlePrevious()
        },

        confirmToPrevious () {
          const vueModel = this
          vueModel.studentCard = ''
          vueModel.mobile = ''
          vueModel.isShowNextToConfirmBtn = false
          vueModel.isShowQueryProfilesBtn = false
          vueModel.handlePrevious()
        }
      },

      mapActions('step', {
        handleNext: 'forwardStepAction',
        handlePrevious: 'backwardStepAction',
        resetStepAction: 'resetStepAction'
      }),

      mapActions('binding', ['assignBindingAction', 'assignStudentCardsAction'])
    )
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
