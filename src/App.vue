<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
onMounted(() => {
  nextTick(() => {
  })
})
</script>
<style lang="scss" scoped>
#app {
  height: 100%;
  font-family: PingFangSC, PingFang SC;
  background-color: #eef1f6;
}
</style>