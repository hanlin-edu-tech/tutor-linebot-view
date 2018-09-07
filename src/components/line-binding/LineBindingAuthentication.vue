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
    </mu-container>
  </article>
</template>

<script>
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

    methods: {
      givenRole () {
        document.querySelector('#line-binding-authentication .container').removeAttribute('style')
        this.$emit('retrieve-role', this.role)
      }
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
