<template>
  <section id="profile">
    <mu-expansion-panel :expand="showPanel === 'profileDetail'" @change="toggle('profileDetail')">
      <div slot="header" class="color-primary">
        <mu-icon value="person"></mu-icon>
        基本資料
      </div>
      <ProfileDetail :line-binding-student-card="lineBindingStudentCard" @is-parent="determineParent"></ProfileDetail>
    </mu-expansion-panel>
    <mu-expansion-panel :expand="showPanel === 'coupons'" @change="toggle('coupons')">
      <div slot="header" class="color-primary">
        <mu-icon value="loyalty"></mu-icon>
        我的優惠
      </div>
      <Coupons></Coupons>
    </mu-expansion-panel>
    <p class="app-center" v-if="isParent">
      <mu-button color="lightBlue900" class="btn-primary"
                 @click="$router.replace(`/profile/${lineUserId}`)">切換帳號
      </mu-button>
    </p>
  </section>
</template>

<script>
  import ProfileDetail from './ProfileDetail'
  import Coupons from './Coupons'

  export default {
    name: 'Profile',
    props: {
      specificLineUser: String,
      panel: String,
      lineBindingStudentCard: Object
    },

    data () {
      return {
        studentCard: this.lineBindingStudentCard.studentCard,
        showPanel: this.panel,
        lineUserId: this.specificLineUser,
        isParent: false
      }
    },

    created () {
      if (!this.lineBindingStudentCard) {
        this.$router.replace({
          name: 'MultiProfile',
          params: {
            refresh: true
          }
        })
      }
    },

    components: {
      ProfileDetail,
      Coupons
    },

    methods: {
      toggle (currentPanel) {
        this.showPanel = (currentPanel === this.showPanel ? '' : currentPanel)
      },

      determineParent () {
        this.isParent = true
      }
    }
  }
</script>

<style lang="less">
  #profile {
    .mu-expansion-panel-content {
      padding: 0;
    }

    .mu-expansion-panel-header {
      font-size: 24px;
      font-weight: 500;
      min-height: 55px;

      .mu-icon {
        padding-right: 18px;
      }

      .mu-expansion-toggle-btn svg {
        height: 35px;
        width: 35px;
      }
    }
  }
</style>
