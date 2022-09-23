<template>
  <div id="line-bot">
    <!-- 版頭 -->
    <header>
      <!-- 舊樣式 -->
      <!-- <mu-appbar style="width: 100%;" color="lightBlue900" text-color="#fbfbfb">
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
        </mu-list>
      </mu-drawer> -->

      <!-- 新樣式 -->
      <div class="header_bar">
        <div class="logo">
          <img src="../src/asset/ehanlin_logo 1.svg" alt="logo">
        </div>
      </div>
    </header>
    <!-- 內容 -->
    <main>
      <div class="wrap">
        <mu-container class="layout-main">
          <router-view v-if="isAlive"></router-view>
        </mu-container>
      </div>
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
    background-color: #f5f5f5;
    // 版頭
    header{
      .header_bar{
        width: 100%;
        height: 50px;
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: #0D6CBE;
        padding: 0px 20px;
        position: relative;
      }
      .logo{
        width: 200px;
        max-width: 100%;
        margin: auto;
      }
      .logo > img{
        width: 100%;
        height: auto;
      }
    }

    // 內容
    main{
      .wrap{
        width: 90%;
        max-width:1000px;
        margin: auto;
        // border: 1px #333 solid;
        touch-action: none;
      }
    }
    @media (max-width: 425px) {
      main{
        .wrap{
          width: 85%;
        }
      }
    }
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

    /* 標題 */
    #title-area {
      text-align: center;
      margin: 18px 0px;
      display: flex;
      flex-direction: column;
      align-content: center;
    }
      p.title {
        color: #0D6CBE;
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
      }
      #title-area span{
        font-size: 12px;
        color: #A8A8A8;
        display: flex;
        align-items: center;
        position: relative;
        margin: auto;
      }
        #title-area span::before,#title-area span::after{
          content: "";
          display: block;
          width: 4px;
          height: 1px;
          background-color: #A8A8A8;
        }
        #title-area span::before{
          margin-right: 4px;
        }
        #title-area span::after{
          margin-left: 4px;
        }

    // 控制container出現
    .container{
      padding: 0;
      margin: 0;
      max-width: 1000px!important;
      position: relative;
      margin: auto;
    }

    // 按扭區塊樣式
    .button-div{
      margin-top: 50px;
    }
      // 按鈕大小
      .button-div .mu-raised-button{
        // font-size: 16px;
        // font-weight: 500;
        // min-width: 124px;
        // height: 44px;
        // box-shadow: unset;
      }
      
      // 共用樣式
      .btn_style{
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        min-width: 124px;
        height: 44px;
        border-radius: 50px;
        box-shadow: unset;
        margin: 0px 6px;
      }
      //  下一步
      .btn_style.next{
        background-color: #FD9841;
      }
        .btn_style.next:active{
          background-color: #F28121;
          border:2px #FFE6D0 solid;
        }
      //  上一步
      .btn_style.back{
        background-color: #065DA7;
      }
        .btn_style.back:active{
          background-color: #01579b;
          border:2px #DAEEFF solid;
        }
  }
</style>

