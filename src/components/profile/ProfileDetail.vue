<template>
  <article id="profile-detail">
    <mu-container>
      <mu-list>
        <mu-list-item class="email">
          <mu-list-item-action>
            <mu-icon value="person_pin"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>
            <span>帳號：{{ profile.email }}
            </span>
          </mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider-height2"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="school"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>學號：{{ profile.studentCard }}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="supervisor_account"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>身分：{{ role }}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="bubble_chart"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>年級：{{ profile.grade }}</mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
        <!-- 雲端銀行 -->
        <mu-list-item class="general">
          <mu-list-item-title>帳號資產：
          </mu-list-item-title>
        </mu-list-item>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="grade"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title><span>e 幣：{{ profile.coins }}</span></mu-list-item-title>
        </mu-list-item>
        <mu-list-item class="general">
          <mu-list-item-action>
            <mu-icon value="stars"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title><span>寶石：{{ profile.gems }}</span></mu-list-item-title>
        </mu-list-item>
        <mu-divider class="divider"></mu-divider>
      </mu-list>
    </mu-container>
  </article>
</template>

<script>
  import DetermineUnsuccessfulStatus from '../layout/DetermineUnsuccessfulStatus'

  export default {
    name: 'ProfileDetail',
    props: {
      lineBindingStudentCard: Object
    },

    data () {
      return {
        profile: this.lineBindingStudentCard,
        lineUserId: this.$route.params['specificLineUser'],
        studentCard: this.$route.params['studentCard'],
        role: ''
      }
    },

    components: {
      DetermineUnsuccessfulStatus
    },

    created () {
      this.profile.authentications.forEach(authentication => {
        if (authentication.lineUserId === this.lineUserId) {
          this.role = authentication.role === 'parent' ? '家長' : '學生'
          if (authentication.role === 'parent') {
            this.$emit('is-parent', '')
          }
        }
      })
    },

    mounted () {
      document.querySelectorAll('#profile .mu-item-title')
        .forEach(itemTitle => {
          itemTitle.style.wordBreak = 'break-all'
        })
    }
  }
</script>

<style lang="less">
  #profile-detail {
    .mu-divider {
      margin-top: 0;
    }

    .mu-icon {
      margin-left: -13px;
      font-size: 26px;
      font-weight: 500;
      color: #5f6788;
    }

    .mu-list {
      height: 60vh;
    }

    .mu-item-action {
      min-width: 30px;
    }

    .mu-item-title {
      font-size: 18px;
      font-weight: 600;
      overflow: visible;
      white-space: normal;
      height: unset;

      span {
        display: inline-block;
        word-break: break-all;
        width: 230px;
      }
    }

    .email {
      height: 60px;
    }

    .general {
      height: 45px;
    }
  }
</style>
