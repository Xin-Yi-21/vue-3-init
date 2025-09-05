<template>
  <div class="top-bar-container">
    <hamburger type="top" />
    <!-- <breadcrumb /> -->
    <top-tag></top-tag>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import TopTag from '@/layout/components/top/top-tag'
import Hamburger from '@/components/custom-hamburger'
import Breadcrumb from '@/components/custom-breadcrumb'
// ^

// # 二、模块功能
// # 1、初始化
function init() {

}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
// ^
</script>

<style lang="scss" scoped>
.top-bar-container {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;

  :root[theme-style='dark'] & {
    // background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    // background-color: var(--bg-card);
  }
}
</style>