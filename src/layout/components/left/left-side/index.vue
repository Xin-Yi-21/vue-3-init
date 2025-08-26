<template>
  <!-- <div :class="['left-side-vue', isCollapse ? 'is-collapse' : 'is-expand', leftNavRef?.isVerticalCollapse ? 'has-is-menu-collapse' : 'has-is-menu-expand', leftStationRef?.isStationCollapse ? 'has-is-station-collapse' : 'has-is-station-expand',]"> -->
  <div :class="['left-side-vue', isCollapse ? 'is-collapse' : 'is-expand',]">
    <left-nav ref="leftNavRef"></left-nav>
    <!-- <left-station ref="leftStationRef"></left-station> -->
    <c-hamburger :isCollapse="isCollapse" class="left-side-toggle" @toggleClick="handleHorizonalToggleSide" />
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import LeftNav from '@/layout/components/left/left-nav'
import LeftStation from '@/layout/components/left/left-station'
import cHamburger from '@/components/custom-hamburger'
// pinia
import useStore from '@/store'
// 声明
const { settingStore } = useStore()
// ^

// # 二、模块功能
// 1、折叠展开左侧导航
const isCollapse = computed(() => settingStore.leftSide.isCollapse)
const handleHorizonalToggleSide = () => {
  settingStore.leftSide.isCollapse = !settingStore.leftSide.isCollapse
  settingStore.setLeftSide()
}
const leftNavRef = ref(null)
const leftStationRef = ref(null)
// ^
// ^
</script>

<style lang="scss" scoped>
.left-side-vue {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  background-color: var(--bg-leftNav);
  box-shadow: 2px 0px 8px 0px rgba(0, 0, 0, 0.1);

  .is-menu-collapse {
    height: 44px;
  }

  .is-station-collapse {
    height: 44px;
  }

  &.has-is-menu-expand.has-is-station-expand {
    .is-menu-expand {
      // height: calc(50% - 12px);
      height: calc(50% - 62px);
      flex-shrink: 0;
    }

    .is-station-expand {
      // height: calc(50% - 112px);
      height: calc(50% - 62px);
      flex-shrink: 0;
    }
  }

  &.has-is-menu-expand.has-is-station-collapse {
    .is-menu-expand {
      // flex: 1;
      height: calc(100% - 168px);
    }
  }

  &.has-is-station-expand.has-is-menu-collapse {
    .is-station-expand {
      // flex: 1;
      height: calc(100% - 168px);
    }
  }

  &.is-collapse {

    :deep(.left-nav-menu) {
      .menu-title {
        // margin-left: 0;
        display: none;
      }

      .el-sub-menu__icon-arrow {
        display: none;
      }

      .el-menu-item {
        padding: 0 !important;

        .el-tooltip {
          padding: 0 !important;
          text-align: center;
        }
      }

      .el-submenu__title {
        justify-content: center;
        padding: 0 !important;
      }
    }
  }

  :deep(.left-side-toggle) {
    position: absolute;
    top: 50%;
    right: 0;
    width: 14px;
    height: 80px;
    padding: 0;
    transform: translate(100%, -50%);
    box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px 6px 6px 0px;
    background-color: var(--bg-leftNav);
    cursor: pointer;
    z-index: 999;

    .c-icon {
      margin: 0 !important;
      color: var(--tc) !important;
    }
  }
}
</style>
