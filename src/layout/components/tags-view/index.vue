<template>
  <div class="tags-view-vue">
    <hamburger :isCollapse="appStore.leftNav.isCollapse" @toggleClick="handleToggle" />
  </div>
</template>

<script setup>
  import Hamburger from '@/components/system/hamburger'
  import useAppStore from '@/store/system/app'
  const appStore = useAppStore()
  const handleToggle = () => {
    appStore.toggleLeftNav()
  }
</script>

<style scoped lang="scss">
.tags-view-vue {}
</style>