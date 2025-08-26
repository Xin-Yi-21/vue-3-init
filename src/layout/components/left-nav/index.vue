<template>
  <div :class="['left-nav-vue', isCollapse ? 'is-collapse' : 'is-expand', menuRef?.isMenuCollapse ? 'has-is-menu-collapse' : 'has-is-menu-expand', stationRef?.isStationCollapse ? 'has-is-station-collapse' : 'has-is-station-expand',]">
    <p-menu ref="menuRef"></p-menu>
    <div class="left-nav-toggle">
      <c-hamburger :isCollapse="settingStore.leftNav.isCollapse" @toggleClick="handleLeftNav" />
    </div>
    <!-- <station ref="stationRef"></station> -->
  </div>

</template>

<script setup>
// # 一、综合
// 组件
import PMenu from './components/p-menu'
import cHamburger from '@/components/custom-hamburger'
// pinia
import useStore from '@/store'
// 声明
const { settingStore } = useStore()
// ^

// # 二、模块功能
// 1、折叠展开左侧导航
const isCollapse = computed(() => settingStore.leftNav.isCollapse)
const handleLeftNav = () => {
  settingStore.leftNav.isCollapse = !settingStore.leftNav.isCollapse
  settingStore.setLeftNav()
}
const menuRef = ref(null)
const stationRef = ref(null)
// ^
// ^
</script>

<style lang="scss" scoped>
.left-nav-vue {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  // border-right: 1px solid var(--bcp);
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

  .left-nav-toggle {
    position: absolute;
    top: 50%;
    right: 0;
    width: 14px;
    height: 80px;
    transform: translate(100%, -50%);
    box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px 6px 6px 0px;
    background-color: var(--bg-leftNav);
    cursor: pointer;
    z-index: 999;

    :deep(.hamburger) {
      width: 100%;
      padding: 0;

      .c-icon {
        margin: 0 !important;
        color: var(--tc) !important;
      }
    }
  }


}
</style>
