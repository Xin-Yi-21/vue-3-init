<template>
  <div class="top-nav-vue">
    <hamburger :isCollapse="settingStore.leftNav.isCollapse" @toggleClick="handleToggle" />
    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </div>
</template>

<script setup>
import Hamburger from '@/components/system/hamburger'
import Breadcrumb from '@/components/system/breadcrumb'
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()
const handleToggle = () => {
  settingStore.toggleLeftNav()
}
</script>

<style lang="scss" scoped>
.top-nav-vue {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
}
</style>