<template>
  <div>
    <mu-container class="layout-main">
      <mu-row class="layout-main-content">
        <mu-col span="12">
          <slot name="content"></slot>
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="12">
          <slot name="below"></slot>
        </mu-col>
      </mu-row>
    </mu-container>
  </div>
</template>

<script>
  export default {
    name: 'LayoutTwoBlock'
  }
</script>

<style scoped>
  .layout-main {
    height: 90vh;
  }

  .layout-main-content {
    height: 85%;
  }

</style>
