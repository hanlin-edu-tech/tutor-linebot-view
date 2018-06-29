<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep" orientation="vertical">
      <mu-step>
        <mu-step-label>
          請選擇你的身份
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingAuthentication @retrieve-role="retrieveRole"></LineBindingAuthentication>
          </p>
          <mu-button @click="handleNext" color="lightBlue900">下一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          請輸入您欲綁定的學號：
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingStudentCard @retrieve-student-card="retrieveStudentCard"></LineBindingStudentCard>
          </p>
          <mu-button @click="handleNext" color="lightBlue900">下一步</mu-button>
          <mu-button flat class="color-primary" @click="handlePrevious">上一步</mu-button>
        </mu-step-content>
      </mu-step>
      <mu-step>
        <mu-step-label>
          資料確認
        </mu-step-label>
        <mu-step-content>
          <p>
            <LineBindingConfirm :studentCard="studentCard"
                                @is-show-completed-btn="isRetrieveEmail"></LineBindingConfirm>
          </p>
          <mu-button @click="completedLineBinding" color="lightBlue900" v-if="isShowCompletedBtn">完成</mu-button>
          <mu-button flat class="color-primary" @click="handlePrevious">上一步</mu-button>
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
  import LineBindingStudentCard from './LineBindingStudentCard'
  import LineBindingConfirm from './LineBindingConfirm'
  import LineBindingResult from './LineBindingResult'
  import store from '../../store/store'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'LineBinding',
    components: {
      LineBindingAuthentication,
      LineBindingStudentCard,
      LineBindingConfirm,
      LineBindingResult
    },

    data () {
      return {
        role: '',
        studentCard: '',
        /* 如果成功取得 email，才顯示完成的 button */
        isShowCompletedBtn: false,
        email: '',
        messageResult: ''
      }
    },

    mounted () {
      document.querySelector('#line-binding .mu-stepper').style.height = `${window.innerHeight * 0.45}px`
    },

    computed: Object.assign(
      {
        isCompleted () {
          return this.bindingStep > 2
        }
      },
      mapState('step', ['bindingStep'])
    ),

    methods: Object.assign(
      {
        retrieveRole (role) {
          this.role = role
        },

        retrieveStudentCard (studentCard) {
          this.studentCard = studentCard
        },

        isRetrieveEmail (email) {
          this.isShowCompletedBtn = true
          this.email = email
        },

        completedLineBinding () {
          let lineUserId = this.$route.params['specificLineUser']

          this.assignBindingAction({
            studentCard: this.studentCard,
            authentications: [
              {
                'lineUserId': lineUserId,
                'role': this.role,
                'email': this.email
              }
            ]
          })

          this.handleNext()
        }
      },

      mapActions('step', {
        handleNext: 'forwardStepAction',
        handlePrevious: 'backwardStepAction'
      }),

      mapActions('binding', ['assignBindingAction'])
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
