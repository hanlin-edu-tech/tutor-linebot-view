<template>
  <div id="feature-title" class="font-important-info">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FeatureTitle'
  }
</script>

<style scoped>
  #feature-title {
    font-size: 1.9em;
    margin-top: -10px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>
