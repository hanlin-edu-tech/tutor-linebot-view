<template>
  <section id="profile">
    <mu-expansion-panel :expand="panel === 'profileDetail'" @change="toggle('profileDetail')">
      <div slot="header" class="color-primary">
        <mu-icon value="person"></mu-icon>
        基本資料
      </div>
      <ProfileDetail @is-parent="determineParent"></ProfileDetail>
    </mu-expansion-panel>
    <mu-expansion-panel :expand="panel === 'coupons'" @change="toggle('coupons')">
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
    data () {
      return {
        panel: this.$route.params['panel'],
        lineUserId: this.$route.params['specificLineUser'],
        isParent: false
      }
    },
    components: {
      ProfileDetail,
      Coupons
    },

    methods: {
      toggle (currentPanel) {
        this.panel = (currentPanel === this.panel ? '' : currentPanel)
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
      font-size: 23px;
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
