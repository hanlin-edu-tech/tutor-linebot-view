<template>
  <mu-col span="12">
    <span class="verify-result font-important-info">您已綁定過此帳號囉，請至帳號查詢頁面查看詳情！</span>
    <mu-button @click="queryProfiles" color="orange" round>帳號查詢</mu-button>
  </mu-col>
</template>

<script>
export default {
  name: "LineUserBoundTwice",
  props: ['lineUserId'],
  methods: {
    queryProfiles() {
      this.$router.push(`/profile/${this.lineUserId}`)
    }
  }
}
</script>

<style scoped>

</style>