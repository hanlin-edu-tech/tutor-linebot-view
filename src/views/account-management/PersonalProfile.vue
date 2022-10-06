<template>
  <!-- 個人資料頁面 -->
  <div class="persnal_page">
    <div class="persnal_page_in">
      {{ findCurrentStudent }}
      <!-- 個人形象區 -->
      <div class="personal_visual">
        <div class="wrap">
          <!-- 標題區 -->
          <div class="personal_title">
            <h1>
              歡迎來到翰林雲端學院!
            </h1>
          </div>
          <!-- 大頭照 -->
          <div class="personal_img">
            <img :src="currentStudent.defPic">
          </div>
          <!-- 點數狀態 -->
          <div class="personal_point">
            <!-- e幣 -->
            <div class="personal_point_in">
              <!-- 圖片 -->
              <div class="coin_img">
                <img src="../../asset/icon/coin.svg" alt="icon">
              </div>
              <!-- 數值 -->
              <div class="point_count">
                <span>e幣:</span>{{ currentStudent.coins }}
              </div>
            </div>
            <!-- 寶石 -->
            <div class="personal_point_in">
              <!-- 圖片 -->
              <div class="coin_img">
                <img src="../../asset/icon/diamond.svg" alt="icon">
              </div>
              <!-- 數值 -->
              <div class="point_count">
                <span>寶石:</span>{{ currentStudent.gems }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 用戶資料 -->
      <div class="personal_data">
        <!-- 用戶帳號 -->
        <div class="user">
          {{ currentStudent.email }}
        </div>
        <!-- 細項 -->
        <ul class="detail_data">
          <li>
            <!-- icon -->
            <div class="icon">
              <img src="../../asset/icon/ID.svg" alt="icon">
            </div>
            <!-- content -->
            <div class="content">
              <span>學號:</span>{{ currentStudent.studentCard }}
            </div>
          </li>
          <li>
            <!-- icon -->
            <div class="icon">
              <img src="../../asset/icon/user.svg" alt="icon">
            </div>
            <!-- content -->
            <div class="content">
              <span>身份:</span>學生
            </div>
          </li>
          <li>
            <!-- icon -->
            <div class="icon">
              <img src="../../asset/icon/level.svg" alt="icon">
            </div>
            <!-- content -->
            <div class="content">
              <span>會員等級:</span>{{ currentStudent.rank }}
            </div>
          </li>
          <li>
            <!-- icon -->
            <div class="icon">
              <img src="../../asset/icon/grade.svg" alt="icon">
            </div>
            <!-- content -->
            <div class="content">
              <span>年級:</span>{{ currentStudent.grade }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PersonalProfile",
  data() {
    return {
      currentStudent: {}
    }
  },

  computed: {
    getCurrentStudentCard() {
      return this.$route.params.studentCard
    },
    findCurrentStudent() {
      this.students.find(student => {
        if (student.studentCard === this.getCurrentStudentCard) {
          this.currentStudent = student
        }
      })
    },

    ...mapState('profile', ['students'])
  },
}
</script>

<style lang="less" scoped>
// 個人資料頁面
.persnal_page{
  width: 100%;
  .persnal_page_in{

  }
}
// 個人形象區
.personal_visual{
  // background-color: #dedede;
  margin-left: calc(-5% - 3px);
  margin-right: calc(-5% - 3px);
  box-sizing: content-box;
  background-image: url(../../asset/personal_bg.png);
  background-size: cover;
  background-position: center;
  padding-bottom: calc(16px + 18px);
  position: relative;
  .wrap{
    // 標題
    .personal_title{
      padding: 16px 0px;
      margin: 0;
      h1{
        margin: auto;
        text-align: center;
        padding: 0px 32px;
        font-size: 20px;
        color: #0D6CBE;
      }
    }
    // 大頭
    .personal_img{
      margin:auto;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 5px #fff solid;
      box-sizing: border-box;
      box-shadow: 0 0 0 0 rgba(0,0,0,0.2);
      img{
        width: 100%;
        max-width: 100%;
        height: auto;
      }
    }
    // 點數
    .personal_point{
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%,50%);
      display: flex;
      width: 75%;
      max-width: 400px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
      .personal_point_in{
        width: 50%;
        padding: 8px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        // 圖
        .coin_img{
          width: 20px;
          height: 20px;
          margin-right: 4px;
          img{
            width: 100%;
            height: auto;
          }
        }
        // 文
        .point_count{
          color: #a8a8a8;
          span{
            font-size: 14px;
            margin-right: 4px;
          }
        }
      }
      .personal_point_in:first-of-type::after{
        content: "";
        display: block;
        width: 1px;
        height: 20px;
        position: absolute;
        right: 0;
        background-color: #A8A8A8;
      }
      @media (max-width: 425px){
        width: 70%;
      }
    }
  }
  @media (max-width: 425px){
    margin-left: calc(-7.5% - 5px);
    margin-right: calc(-7.5% - 5px);
  }
}
// 用戶資料區
.personal_data{
  margin: 0 auto;
  margin-top: calc(18px + 18px);
  max-width: 600px;
  // 帳號
  .user{
    background-color: #DBDBDB;
    font-size: 14px;
    color: #fff;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px 5px 0px 0px;
  }
  // 細節
  ul.detail_data{
    list-style: none;
    padding: unset;
    margin: unset;
    padding: 8px 16px;
    background-color: #fff;
    li{
      display: flex;
      padding: 8px 0px;
      border-bottom: 1px #DBDBDB solid;
      .icon{
        width: 24px;
        height: 24px;
        margin-right: 8px;
        img{
          width: 100%;
          height: auto;
        }
      }
      .content{
        font-size: 16px;
        font-weight: 700;
        color: #a8a8a8;
        span{
          font-weight: normal;
          margin-right: 4px;
        }
      }
    }
    li:last-of-type{
      border-bottom:unset
    }
  }
}
</style>