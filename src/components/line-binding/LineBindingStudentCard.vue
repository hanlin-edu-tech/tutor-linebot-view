<template>
  <div id="line-binding-studentCard">
    <mu-text-field full-width v-model="studentCard" type="text" placeholder="學號" action-icon="edit" @change="givenStudentCard"></mu-text-field>
  </div>
</template>

<script>
  export default {
    name: 'LineBindingStudentCard',
    data () {
      return {
        studentCard: ''
      }
    },
    methods: {
      givenStudentCard () {
        this.$emit('retrieve-student-card', this.studentCard)
      }
    }

  }
</script>

<style scoped lang="less">
  #line-binding-studentCard .mu-input {
    font-size: 1.5em;
  }
</style>
