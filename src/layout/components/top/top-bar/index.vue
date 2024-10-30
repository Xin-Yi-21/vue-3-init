<template>
  <div class="top-nav-vue">
    <hamburger :isCollapse="appStore.leftNav.isCollapse" @toggleClick="handleToggle" />
    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </div>
</template>

<script setup>
import Hamburger from '@/components/system/hamburger'
import Breadcrumb from '@/components/system/breadcrumb'
import useAppStore from '@/store/system/app'
const appStore = useAppStore()
const handleToggle = () => {
  appStore.toggleLeftNav()
}
</script>

<style lang="scss" scoped>
.top-nav-vue {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
}
</style>