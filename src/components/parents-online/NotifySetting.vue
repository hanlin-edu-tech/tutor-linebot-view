<template>
  <section>
    <TipSubtitle>
      <mu-icon class="icon-padding-right" value="notifications_active"></mu-icon>
      目前設定
    </TipSubtitle>
    <article id="parents-online">
      <mu-container class="color-primary">
        <mu-row>
          <mu-alert>
            帳號: {{ lineBindingStudentCard.email }}
          </mu-alert>
        </mu-row>
        <mu-row class="notify-padding font-common font-weight-common">
          通知頻率：
        </mu-row>
        <mu-row class="notify-padding">
          <mu-col span="6">
            <mu-radio v-model="parentsOnline.notifyFrequency" value="none" label="不通知"></mu-radio>
          </mu-col>
        </mu-row>
        <mu-row class="notify-padding">
          <mu-col span="6">
            <mu-radio v-model="parentsOnline.notifyFrequency" value="everyHour" label="每小時"></mu-radio>
          </mu-col>
          <mu-col span="6">
            <mu-checkbox v-show="parentsOnline.notifyFrequency === 'everyHour'"
                         v-model="parentsOnline.noDisturb" value="true" label="勿擾模式">
            </mu-checkbox>
          </mu-col>
        </mu-row>
        <mu-row id="radio-daily" class="notify-padding">
          <mu-col span="6">
            <mu-radio v-model="parentsOnline.notifyFrequency" value="daily" label="每日"></mu-radio>
          </mu-col>
          <mu-col span="6">
            <mu-select v-show="parentsOnline.notifyFrequency === 'daily'" v-model="parentsOnline.dailyHour">
              <mu-option v-for="hour,index in dailyHours" :key="hour"
                         :label="retrieveDailyHourSelectLabel(hour)" :value="hour">
              </mu-option>
            </mu-select>
          </mu-col>
        </mu-row>
        <mu-row class="notify-padding font-common font-weight-common">
          通知內容：
        </mu-row>
        <mu-row class="notify-padding">
          <mu-paper class="demo-paper" :z-depth="7">
            <article class="notify-content font-important-info">
              自我評量
            </article>
          </mu-paper>
        </mu-row>
        <mu-row>
          <div class="update-notify-setting">
            <mu-button color="lightBlue900" @click="notifySetting">更新設定</mu-button>
          </div>
        </mu-row>
        <mu-dialog title="Dialog" width="360" :open.sync="openSettingResult">
          更新成功
          <mu-button slot="actions" flat color="primary" @click="closeDialog">確認</mu-button>
        </mu-dialog>
      </mu-container>
    </article>
  </section>
</template>

<script>
  import TipSubtitle from '../layout/TipSubtitle'

  export default {
    name: 'NotifySetting',
    components: {
      TipSubtitle
    },
    props: {
      studentCard: String,
      specificLineUser: String,
      panel: String,
      lineBindingStudentCard: Object,
      isMultiLineBindingStudentCard: Boolean
    },

    data () {
      return {
        openSettingResult: false,
        updateResult: '設定成功',
        parentsOnline: {
          notifyFrequency: 'none',
          noDisturb: false,
          dailyHour: 22
        },

        dailyHours: ['06', '07', '08', '09', '10', '11', '12', '13', '14',
          '15', '16', '17', '18', '19', '20', '21', '22', '23']
      }
    },

    methods: {
      retrieveDailyHourSelectLabel (hour) {
        return `${hour} 時`
      },

      notifySetting () {
        let vueModel = this
        let parentsOnline = vueModel.parentsOnline
        let settingInfo = {
          lineUserId: vueModel.specificLineUser,
          studentCard: vueModel.studentCard
        }
        let setting = {}
        if (vueModel.parentsOnline.notifyFrequency === 'everyHour') {
          setting.noDisturb = parentsOnline.noDisturb
        } else if (vueModel.parentsOnline.notifyFrequency === 'daily') {
          setting.dailyHour = parentsOnline.dailyHour
        } else {
          return
        }
        setting.notifyFrequency = parentsOnline.notifyFrequency
        settingInfo.setting = setting

        vueModel.openSettingResult = true
        vueModel
          .axios({
            method: 'post',
            url: `/linebot/parentsOnLine/notifySetting`,
            data: settingInfo
          })
          .then(response => {
            let modifiedCount = response.data['content']
            if (modifiedCount !== 1) {
              vueModel.updateResult = '設定失敗'
            }
            this.openSettingResult = true
          })
          .catch(error => {
            console.error(error)
            vueModel.updateResult = '設定失敗'
            this.openSettingResult = true
          })
      },

      closeDialog () {
        this.openSettingResult = false
      }
    }
  }
</script>

<style lang="less">
  #parents-online {
    .mu-alert {
      margin-top: -10px;
      padding: 0 3px;
      min-height: 45px;
      color: rgba(0, 0, 0, .87);
      background-color: #F4ECF7;
      font-size: 19px;
      font-weight: 500;
    }

    .notify-padding {
      padding: 12px 0 0 0;
    }

    .notify-type-position {
      margin-bottom: 15px;
    }

    .mu-radio .mu-radio-label, .mu-checkbox .mu-checkbox-label {
      font-size: 1.3em;
    }

    #radio-daily {
      .mu-input {
        margin-bottom: -20px;
      }
    }

    .mu-select {
      margin-top: -10px;
      margin-left: 10px;
      font-size: 1.2em;
      width: 100px;
    }

    .mu-select-input, .mu-option.is-selected .mu-item {
      color: #01579b;
    }

    .demo-paper {
      background-color: #f8fbe4;
      width: 100vw;
      height: 20vh;
    }

    .notify-content {
      padding: 20px;
      font-size: 18px;
    }

    .update-notify-setting {
      position: absolute;
      bottom: 20px;
      right: 5vw;

      .mu-button {
        width: 25vw;
        height: 35px;
        font-size: 20px;
        font-weight: 500;

        .mu-button-wrapper {
          padding: 2px;
        }
      }
    }
  }

  .mu-option.is-selected .mu-item {
    color: #01579b;
  }
</style>
