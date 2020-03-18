<template>
  <div id="line-bot">
    <header>
      <mu-appbar style="width: 100%;" color="lightBlue900" text-color="#fbfbfb">
        <mu-menu slot="left">
          <mu-button icon style="margin-top: 6px;" color="#fbfbfb" @click="isOpen = (!isOpen)">
            <mu-icon value="menu" size="35"></mu-icon>
          </mu-button>
        </mu-menu>
        翰林雲端學院
      </mu-appbar>
      <mu-drawer :open.sync="isOpen" :docked="false" :right="false" width="210" :z-depth="24">
        <mu-list>
          <mu-list-item button @click="binding">
            <mu-list-item-action>
              <mu-icon value="loupe"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>綁定帳號</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="queryProfiles">
            <mu-list-item-action>
              <mu-icon value="account_circle"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>帳號查詢</mu-list-item-title>
          </mu-list-item>
          <!-- deprecated -->
          <!-- <mu-list-item button @click="queryProfiles('parentsOnLine')">
            <mu-list-item-action>
              <mu-icon value="alarm"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>學習通知</mu-list-item-title>
          </mu-list-item> -->
        </mu-list>
      </mu-drawer>
    </header>
    <main>
      <mu-container class="layout-main">
        <router-view v-if="isAlive"></router-view>
      </mu-container>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      const vueModel = this
      return {
        isAlive: true,
        isOpen: false,
      }
    },

    methods: {
      reload () {
        const vueModel = this
        vueModel.isAlive = false
        vueModel.$nextTick(() => (vueModel.isAlive = true))
      },

      closeDrawer () {
        const vueModel = this
        vueModel.isOpen = false
      },

      binding () {
        const vueModel = this
        const uId = vueModel.$route.params['specificLineUser']
        vueModel.closeDrawer()
        vueModel.$router.replace(`/lineBinding/${uId}`)
      },

      queryProfiles (menuFunction) {
        const vueModel = this
        const uId = vueModel.$route.params['specificLineUser']
        vueModel.closeDrawer()
        if (menuFunction) {
          vueModel.$router.push(`/profile/${uId}?menuFunction=${menuFunction}`)
        } else {
          vueModel.$router.push(`/profile/${uId}`)
        }
      }
    }
  }
</script>

<style lang="less">
  @import './static/css/layout.less';
  @import './static/css/process-result.less';
  @import './static/css/content.less';

  body, main, section, article, div, button, span, p {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #line-bot {
    font-family: Roboto, monospace;

    .mu-appbar-title {
      width: 100vw;
      font-size: 2em;
      font-weight: 600;
      text-align: center;
      margin-right: 15px;
    }

    .layout-main {
      /*height: 10vh;*/
      margin-top: 30px;
    }

    .mu-drawer {
      .mu-item-action {
        min-width: 40px;
      }

      .mu-icon {
        color: #01579b;
        font-size: 1.6em;
      }

      .mu-item-title {
        color: #01579b;
        font-weight: 500;
        font-size: 1.4em;
      }
    }
  }
</style>

