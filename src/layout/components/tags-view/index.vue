<template>
  <div class="tags-view-vue">
    <hamburger :isExpand="appStore.leftNav.isExpand" @toggleClick="handleToggle" />
  </div>
</template>

<script setup>
  import Hamburger from '@/components/system/hamburger'
  import useAppStore from '@/store/system/app'
  const appStore = useAppStore()
  const handleToggle = () => {
    appStore.toggleLeftNav()
    console.log('查', appStore.leftNav.isExpand)
  }
</script>

<style scoped lang="scss">
.tags-view-vue {}
</style>