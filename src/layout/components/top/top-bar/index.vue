<template>
  <div class="top-bar-vue">
    <hamburger :isCollapse="settingStore.leftNav.isCollapse" @toggleClick="handleToggle" />
    <Breadcrumb class="breadcrumb-container" />
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
.top-bar-vue {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}
</style>