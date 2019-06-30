<template>

</template>

<script>
  export default {
    name: 'Refresh.vue',
    beforeRouteEnter (to, from, next) {
      next(vueModel => {
        vueModel.$router.replace(from.path)
      })
    }
  }
</script>

<style scoped>

</style>
