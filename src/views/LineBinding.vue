<template>
  <section id="line-binding">
    <mu-stepper :active-step="bindingStep">
      <mu-step v-for="num in 3">
        <mu-step-label></mu-step-label>
      </mu-step>
    </mu-stepper>

    <p v-if="bindingStep === 0 && !isParentBound">
      <ChooseRole></ChooseRole>
    </p>
    <p v-if="bindingStep === 1">
      <BindingProcedure></BindingProcedure>
    </p>
    <p v-if="bindingStep === 2">
      <LineBindingConfirm
          :line-user-id="lineUserId"
          @binding-completed="bindingSuccess">
      </LineBindingConfirm>
    </p>

    <p v-if="isBindingCompleted">
      <LineBindingResult @binding-again="resetStepAction" :line-user-id="lineUserId">
      </LineBindingResult>
    </p>
  </section>
</template>

<script>
import ChooseRole from '@/components/line-binding/ChooseRole'
import BindingProcedure from "@/components/line-binding/BindingProcedure"
import LineBindingConfirm from "@/components/line-binding/LineBindingConfirm"
import LineBindingResult from "@/components/line-binding/LineBindingResult"
import store from '@/store/store'
import {mapActions} from 'vuex'

export default {
  name: 'LineBinding',
  components: {
    ChooseRole,
    BindingProcedure,
    LineBindingConfirm,
    LineBindingResult
  },
  data() {
    return {
      lineUserId: this.$route.params['specificLineUser'],
      isParentBound: false,
      isBindingCompleted: false,
      isBindingAgain: false
    }
  },

  async created() {
    this.resetStepAction()
    // try {
    //   // await 後端回傳data，不然這裡取不到資料
    //   const response = await this.$axios({
    //     method: 'get',
    //     // url: `/linebot/profile/${this.lineUserId}`,
    //     url: `https://www.tbbt.com.tw/linebot/profile/U66056dae13d4f659feecca4c70e32bae`,

    //   })
    //   const jsonData = response.data
    //   const lineBindingStudentCards = jsonData.content
    //   this.isParentBound = false

    //   if (lineBindingStudentCards.length > 0) {
    //     const studentCards = []
    //     lineBindingStudentCards.forEach(lineBindingStudentCard => {
    //       studentCards.push(lineBindingStudentCard.studentCard)
    //       lineBindingStudentCard.authentications.forEach(authentication => {
    //         if (authentication.role === 'parent') {
    //           this.isParentBound = true
    //           this.student.role = 'parent'
    //         }
    //       })
    //     })
    //     this.student.studentCards = studentCards
    //   }
    // } catch (error) {
    //   console.error(error)
    //   this.isParentBound = false
    // }
  },

  methods: {
    bindingSuccess() {
      this.resetConnectorLineColor('#bdbdbd')
      this.isBindingCompleted = true
    },

    resetConnectorLineColor(color) {
      const connectorLineList = document.querySelectorAll('span[class="mu-step-connector-line"]')
      connectorLineList.forEach(connectorLine => {
        connectorLine.style.borderColor = color
      })
    },

    ...mapActions('step', {
      resetStepAction: 'resetStepAction'
    }),

  },

  computed: {
    bindingStep: () => store.state.step.bindingStep,
    student: () => store.state.binding.student
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
  border-top-width: 3px;
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
