<template>
  <div class="top-bar-vue">
    <hamburger :isCollapse="settingStore.leftNav.isCollapse" @toggleClick="handleLeftNav" />
    <Breadcrumb class="breadcrumb-container" />
  </div>
</template>

<script setup>
import Hamburger from '@/components/framework/f-hamburger'
import Breadcrumb from '@/components/framework/f-breadcrumb'
import useSettingStore from '@/store/framework/setting'
const settingStore = useSettingStore()
const handleLeftNav = () => {
  settingStore.leftNav.isCollapse = !settingStore.leftNav.isCollapse
  settingStore.setLeftNav()
}
</script>

<style lang="scss" scoped>
.top-bar-vue {
  display: flex;
  height: 40px;
  border-bottom: 1px solid var(--bcp);
  background-color: var(--bg-topBar);
}
</style>