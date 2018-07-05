<template>
  <article id="line-binding-reach-limited">
    <mu-row>
      <mu-col span="11">
        <div class="app-center result result-failure">
          <mu-icon left value="warning"></mu-icon>
          已綁定兩位使用者
        </div>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <div class="result-detail">您輸入的學號已綁定 2 位 line 使用者囉！</div>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <p class="app-center">
          <mu-button color="lightBlue900" class="btn-primary" @click="reLineBinding()">重新綁定</mu-button>
        </p>
      </mu-col>
    </mu-row>
  </article>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'LineBindingReachLimited',
    methods: Object.assign(
      {
        reLineBinding () {
          document.querySelector('#line-binding .mu-stepper').style.display = ''
          this.resetStepAction()
        }
      },
      mapActions('step', ['resetStepAction'])
    )
  }
</script>

<style lang="less">

</style>
