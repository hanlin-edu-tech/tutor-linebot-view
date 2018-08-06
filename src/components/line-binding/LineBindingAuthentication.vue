<template>
  <article id="line-binding-authentication">
    <mu-container>
      <mu-row v-for="identity in identities" :key="identity.id">
        <mu-col span="11">
          <mu-radio name="role" :value="identity.value" v-model="role"
                    :label="identity.text" @change="givenRole"></mu-radio>
          <mu-divider class="divider"></mu-divider>
        </mu-col>
      </mu-row>
      <mu-row v-if="Object.keys(studentCardAuthenticationMapping).length && isStudentBoundTwice()">
        <mu-col span="12">
          <span class="verify-result font-important-info">{{verifyResult}}</span>
        </mu-col>
      </mu-row>
    </mu-container>
  </article>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'LineBindingAuthentication',
    data () {
      return {
        role: '',
        identities: [
          {id: 'parent', text: '家長', value: 'parent'},
          {id: 'student', text: '學生', value: 'student'}
        ],
        verifyResult: ''
      }
    },

    computed: mapState('binding', ['studentCardAuthenticationMapping']),

    methods: {
      givenRole () {
        document.querySelector('#line-binding-authentication .container').removeAttribute('style')
        this.$emit('retrieve-role', this.role)
      },

      isStudentBoundTwice () {
        let studentCardAuthenticationMapping = this.studentCardAuthenticationMapping
        for (let studentCard in studentCardAuthenticationMapping) {
          let authentication = studentCardAuthenticationMapping[studentCard]
          if (authentication.role === 'student' && authentication.role === this.role) {
            this.verifyResult = '您已成功綁定帳號，請至帳號查詢頁面查看詳情，目前綁定過學生帳號後，欲繼續綁定家長帳號仍可行喔！'
            document.querySelector('#line-binding-authentication .container').style.height = '250px'
            this.$emit('retrieve-role', '')
            return true
          }
        }
        return false
      },
    }
  }
</script>

<style lang="less">
  #line-binding-authentication .row {
    text-align: left;
    margin-top: 20px;
    margin-left: 2vw;
    height: 7vh;

    .mu-radio {
      .mu-radio-icon {
        width: 35px;
      }

      .mu-radio-label {
        color: #545152;
        font-size: 23px;
        font-weight: 500;
      }

      .mu-radio-svg-icon {
        height: 25px;
        width: 25px;
      }
    }
  }
</style>
