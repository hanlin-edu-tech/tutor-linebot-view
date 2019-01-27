<template>
  <div class="app-center result result-failure" v-if="status && status !== 'success'">
    <mu-icon left value="warning" class="icon-global"></mu-icon>
    <slot></slot>
  </div>
  <div class="app-center" v-else-if="status === ''">
    <mu-circular-progress :stroke-width="5" :size="36"></mu-circular-progress>
  </div>
</template>

<script>
  export default {
    name: 'DetermineUnsuccessfulStatus',
    props: {
      status: ''
    }
  }
</script>

<style scoped>

</style>
