<template>
  <div class="top-bar-vue">
    <hamburger :isCollapse="settingStore.leftNav.isCollapse" @toggleClick="handleLeftNav" />
    <Breadcrumb class="breadcrumb-container" />
  </div>
</template>

<script setup>
import Hamburger from '@/components/f-hamburger'
import Breadcrumb from '@/components/f-breadcrumb'
import useSettingStore from '@/store/setting'
const settingStore = useSettingStore()
const handleLeftNav = () => {
  settingStore.leftNav.isCollapse = !settingStore.leftNav.isCollapse
  settingStore.setLeftSide()
}
</script>

<style lang="scss" scoped>
.top-bar-vue {
  display: flex;
  height: 40px;
  border-bottom: 1px solid var(--bcp);

  :root[theme-style='dark'] & {
    background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    background-color: var(--bg-card);
  }

}
</style>