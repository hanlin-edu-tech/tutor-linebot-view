<template>
  <mu-row>
    <mu-alert class="tip-subtitle font-secondary-info">
      <slot></slot>
    </mu-alert>
  </mu-row>
</template>

<script>
  export default {
    name: 'TipSubtitle'
  }
</script>

<style lang="less" scoped>
  .tip-subtitle {
    padding: 0 3px;
    margin-top: -20px;
    min-height: 60px;
    background-color: #FAFAFA;
    font-size: 20px;
    font-weight: 500;
  }
</style>
