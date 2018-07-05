<template>
  <article id="line-binding-failure">
    <mu-row>
      <mu-col span="11">
        <div class="app-center result result-failure">
          <mu-icon left value="warning"></mu-icon>
          綁定失敗
        </div>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <div class="result-detail">請您再次確認並重新綁定，如有任何問題，您可以利用雲端學院 Line 線上客服，
          或撥打客服電話 0800-0088-11 詢問，謝謝！
        </div>
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
    name: 'LineBindingFailure',
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
