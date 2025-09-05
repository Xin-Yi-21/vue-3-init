<template>
  <div class="top-bar-container">
    <!-- <hamburger type="top" />
    <breadcrumb /> -->
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
  display: flex;
  align-items: center;

  .c-hamburger {
    padding: 0 5px;
    border-radius: 4px 4px 0 0;
    background-color: var(--bg-card);
  }

  .c-breadcrumb {
    padding: 0 10px;
    border-radius: 4px 4px 0 0;
    margin: 0 10px;
    background-color: var(--bg-card);
  }
}
</style>