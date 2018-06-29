<template>
  <div id="app">
    <header>
      <mu-appbar style="width: 100%;" color="lightBlue900" text-color="#fbfbfb">
        <mu-menu slot="left">
          <mu-button icon flat color="#fbfbfb" @click="open = (!open)">
            <mu-icon value="menu" size="30"></mu-icon>
          </mu-button>
        </mu-menu>
        翰林雲端學院
      </mu-appbar>
      <mu-drawer :open.sync="open" :docked="false" width="210" :z-depth="24">
        <mu-list>
          <mu-list-item button @click="binding">
            <mu-list-item-action>
              <mu-icon value="loupe"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>
              綁定帳號
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="retrieveMultiProfile">
            <mu-list-item-action>
              <mu-icon value="account_circle"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>帳號查詢</mu-list-item-title>
          </mu-list-item>
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
      return {
        isAlive: true,
        open: false,
        lineUserId: this.$route.params['specificLineUser']
      }
    },

    methods: {
      closeDrawer () {
        this.open = false
      },

      reload () {
        this.isAlive = false
        this.$nextTick(() => (this.isAlive = true))
      },

      binding () {
        this.closeDrawer()
        this.$router.replace(`/lineBinding/${this.lineUserId}`)
        this.$router.go(0)
      },

      retrieveMultiProfile () {
        this.closeDrawer()
        this.$router.push(`/profile/${this.lineUserId}`)
      }
    }
  }
</script>

<style lang="less">
  @import "./css/app-global.less";

  body, main, section, article, div, button, span, p {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #app {
    .mu-appbar-title {
      width: 100vw;
      font-size: 2em;
      font-weight: 500;
      text-align: center;
      margin-right: 11vw;
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
