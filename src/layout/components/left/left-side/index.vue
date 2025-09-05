<template>
  <div :class="['left-side-container', isCollapse ? 'is-collapse' : 'is-expand',]">
    <left-nav></left-nav>
    <left-station></left-station>
    <c-hamburger class="left-side-toggle" />
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import LeftNav from '@/layout/components/left/left-nav'
import LeftStation from '@/layout/components/left/left-station'
import cHamburger from '@/components/custom-hamburger'
// ^

// # 二、模块功能
// ^
</script>

<style lang="scss" scoped>
.left-side-container {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  :root[theme-style='dark'] & {
    background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    background-color: var(--bg-card);
  }

  box-shadow: 2px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding-bottom: 100px;

  &.is-collapse {
    width: 0;
  }

  :deep(.left-side-toggle) {
    position: absolute;
    top: 50%;
    right: 0;
    width: 14px;
    height: 80px;
    padding: 0;
    transform: translate(100%, calc(-50% - 50px));
    box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px 6px 6px 0px;
    cursor: pointer;
    z-index: 999;

    :root[theme-style='dark'] & {
      background-color: var(--bg-card);
    }

    :root[theme-style='light'] & {
      background-color: var(--bg-card);
    }

    .c-icon {
      margin: 0 !important;
      color: var(--tc) !important;
    }
  }
}
</style>
