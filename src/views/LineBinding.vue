<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep" v-if="bindingStep < 3">
      <mu-step v-for="num in 3" :class="{'connector-line': bindingStep >= num}">
        <mu-step-label></mu-step-label>
      </mu-step>
    </mu-stepper>

    <template v-if="isInitial">
      <ChooseRole v-if="bindingStep === 0 && !isAlreadyBinding"></ChooseRole>

      <BindingProcedure v-if="bindingStep === 1" :is-already-binding="isAlreadyBinding"></BindingProcedure>

      <LineBindingConfirm
          v-if="bindingStep === 2"
          :line-user-id="lineUserId"
          @binding-completed="isBindingCompleted = true"
          @binding-result="setBindingResult"></LineBindingConfirm>

      <LineBindingSuccess v-if="bindingResult === 'success'"></LineBindingSuccess>

      <LineBindingFailure v-if="bindingResult === 'failure'"></LineBindingFailure>
    </template>
  </section>
</template>

<script>
import ChooseRole from '@/components/line-binding/ChooseRole'
import BindingProcedure from "@/components/line-binding/BindingProcedure"
import LineBindingConfirm from "@/components/line-binding/LineBindingConfirm"
import LineBindingResult from "@/components/line-binding/LineBindingResult"
import store from '@/store/store'
import {mapActions} from 'vuex'
import LineBindingSuccess from "@/components/line-binding/result/LineBindingSuccess";
import LineBindingFailure from "@/components/line-binding/result/LineBindingFailure";

export default {
  name: 'LineBinding',
  components: {
    LineBindingFailure,
    LineBindingSuccess,
    ChooseRole,
    BindingProcedure,
    LineBindingConfirm,
    LineBindingResult
  },
  data() {
    return {
      lineUserId: this.$route.params['specificLineUser'],
      isBindingCompleted: false,
      isBindingAgain: false,
      isAlreadyBinding: false,
      isInitial: false,
      bindingResult: ''
    }
  },

  async created() {
    try {
      // await 後端回傳data，不然這裡取不到資料
      await this.$store.dispatch('commonData/initStudentsWithLineUser', this.lineUserId)

      if (this.students.length > 0) {
        const students = this.students
        const studentCards = []
        students.forEach(student => {
          studentCards.push(student.studentCard)
          student.authentications.forEach(authentication => {
            if (authentication.role === 'parent') {
              this.student.role = 'parent'
            } else {
              this.student.role = 'student'
            }
          })
        })
        this.student.studentCards = studentCards
        this.isAlreadyBinding = true
        this.handleNext()
        // 當綁定過身份後 導到profile，若在profile那點擊帳號綁定，則不跳轉
        // if (!this.continueBinding) {
        //   await this.$router.replace(`/profile/${this.lineUserId}/${this.student.studentCards[0]}`)
        // }
      }
    } catch (error) {
      console.error(error)
      this.isAlreadyBinding = false
    }
    // created流程跑完後 才讓上面的template顯示
    // 不在選擇身份階段時，不該閃過選擇身份的component的畫面
    this.isInitial = true
  },

  methods: {
    setBindingResult(result) {
      this.bindingResult = result
    },

    ...mapActions('step', {
      resetStepAction: 'resetStepAction',
      handleNext: 'forwardStepAction'
    }),

  },

  computed: {
    bindingStep: () => store.state.step.bindingStep,
    student: () => store.state.binding.student,
    continueBinding: () => store.state.binding.continueBinding,
    students: () => store.state.commonData.students
  },
}
</script>

<style>
.mu-step-label.active .mu-step-label-circle, .mu-step-label.completed .mu-step-label-circle {
  background-color: orange;
}

.mu-step-label.active .mu-step-label-icon, .mu-step-label.completed .mu-step-label-icon {
  color: orange;
}

.mu-step-connector-line {
}

div[class~="connector-line"] + div > span[class="mu-step-connector-line"] {
  border-top-width: 3px;
  border-color: orange;
}

/* 步驟樣式 */
.mu-stepper{
  position: relative;
  width: 50%;
  max-width: 320px;
  margin: auto;
  margin-top: 16px;
}
  .mu-step{
    z-index: 1;
  }
  .mu-step-label{
    height: unset;
    padding: unset;
  }
  .mu-step-label.active{

  }
    .mu-step-label-icon-container{
      margin: 0;
      width: unset;
    }


</style>
