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
            <mu-radio v-model="parentsOnLine.notifyFrequency" value="none" label="不通知"></mu-radio>
          </mu-col>
        </mu-row>
        <mu-row class="notify-padding">
          <mu-col span="6">
            <mu-radio v-model="parentsOnLine.notifyFrequency" value="hourly" label="每小時"></mu-radio>
          </mu-col>
          <mu-col span="6" v-show="parentsOnLine.notifyFrequency === 'hourly'">
            <mu-checkbox v-model="parentsOnLine.noDisturb" value="true" label="勿擾模式">
            </mu-checkbox>
            <br />
            <span class="font-smallest no-disturb-time-hint">勿擾時間 23:00 ~ 06:00</span>
          </mu-col>
        </mu-row>
        <mu-row id="radio-daily" class="notify-padding">
          <mu-col span="6">
            <mu-radio v-model="parentsOnLine.notifyFrequency" value="daily" label="每日"></mu-radio>
          </mu-col>
          <mu-col span="6">
            <mu-select v-show="parentsOnLine.notifyFrequency === 'daily'" v-model="parentsOnLine.dailyHour">
              <mu-option v-for="hour, index in dailyHours" :key="hour"
                         :label="retrieveDailyHourSelectLabel(hour)" :value="hour">
              </mu-option>
            </mu-select>
          </mu-col>
        </mu-row>
        <mu-row>
          <div class="update-notify-setting">
            <mu-button color="lightBlue900" @click="notifySetting">更新設定</mu-button>
          </div>
        </mu-row>
        <mu-dialog width="360" :open.sync="openSettingResult">
          {{ updateResult }}
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
        parentsOnLine: {
          notifyFrequency: 'none',
          noDisturb: false,
          dailyHour: '22時'
        },

        dailyHours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14',
          '15', '16', '17', '18', '19', '20', '21', '22', '23']
      }
    },

    created () {
      let vueModel = this
      vueModel
        .axios({
          method: 'get',
          url: `/linebot/parentsOnLine/notifySetting?studentCard=${vueModel.studentCard}&lineUserId=${vueModel.specificLineUser}`
        })
        .then(response => {
          let jsonData = response.data
          let setting = jsonData.content
          if (Object.keys(setting).length > 0) {
            vueModel.parentsOnLine = setting
          }
        })
        .catch(console.error)
    },

    methods: {
      retrieveDailyHourSelectLabel (hour) {
        return `${hour} 時`
      },

      notifySetting () {
        let vueModel = this
        let parentsOnLine = vueModel.parentsOnLine
        let settingInfo = {
          lineUserId: vueModel.specificLineUser,
          studentCard: vueModel.studentCard
        }
        let setting = {}
        switch (vueModel.parentsOnLine.notifyFrequency) {
          case 'hourly' : {
            setting.notifyFrequency = parentsOnLine.notifyFrequency
            setting.noDisturb = parentsOnLine.noDisturb
            break
          }

          case 'daily' : {
            setting.notifyFrequency = parentsOnLine.notifyFrequency
            setting.dailyHour = parentsOnLine.dailyHour
            break
          }

          default: {
            setting.closed = true
          }
        }

        settingInfo.setting = setting

        vueModel
          .axios({
            method: 'post',
            url: `/linebot/parentsOnLine/notifySetting`,
            data: settingInfo
          })
          .then(response => {
            vueModel.openSettingResult = true
          })
          .catch(error => {
            console.error(error)
            vueModel.updateResult = '設定失敗'
            vueModel.openSettingResult = true
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

    .no-disturb-time-hint {
      display: inline-block;
      position: relative;
      width: 160px;
      left: -20px;
    }
  }

  .mu-option.is-selected .mu-item {
    color: #01579b;
  }
</style>
