<template>
  <div class="top-nav-vue">
    <el-scrollbar wrap-class="c-el-scrollbar">
      <el-menu :unique-opened="true" :collapse-transition="false" mode="horizontal" :ellipsis="false" :default-active="activeMenu" menu-trigger="hover" popper-class="top-nav-menu-modal" :teleported="true">
        <nav-item v-for="(item, index) in topNavRoutes" :key="index" :navInfo="item" :isNest="true" :basePath="''" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// 一、综合初始化
import NavItem from './components/nav-item'
import userMenuStore from '@/store/system/menu'

const routerStore = userMenuStore()
const route = useRoute()
const topNavRoutes = computed(() => routerStore.topNavRoutes)
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style lang="scss" scoped>
.top-nav-vue {
  height: 50px;

  :deep(.el-menu) {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;

    &>* {
      flex: 1;
      border-right: 1px solid #ccc;

      // box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
      &:last-child {
        border-right: 0;
      }
    }

    .el-sub-menu {
      position: relative;

      .el-sub-menu__title {
        position: static;
        display: inline-flex;
        justify-content: center;
        border-bottom: 0;
        width: 100%;
        height: 49px;

        .el-sub-menu__icon-arrow {
          width: auto;
          right: 10px;
          // &::before {
          //   content: "\e790";
          //   // content: url('assets/icons/svg/c-scroll-down.svg');
          //   font-size: 16px;
          //   // color: var(--first-font-color);
          // }
        }
      }

      &.is-active {
        background-color: #fcfcfc;

        .el-sub-menu__title {
          border-bottom: 0;
        }
      }
    }

    .el-menu-item {
      display: inline-flex;
      justify-content: center;
      width: 100%;
      height: 49px;

      &.is-active {
        background-color: #fcfcfc;
      }
    }

    .menu-title {
      height: 49px;
      line-height: 49px;
      font-size: 16px;
      font-weight: 700;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    a {
      color: #333;
      text-decoration: none;
    }

    .svg-icon {
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

  }
}
</style>
<style lang="scss">
// 组件内全局样式
.top-nav-menu-modal {
  // min-width: 100%;
  // margin-top: 2px;
  // z-index: 99999;

  // .el-menu--popup {
  //   display: flex;
  //   flex-direction: column;
  //   overflow: hidden;
  //   margin-left: -1px;
  //   padding: 0;
  //   border: 1px solid var(--first-border-color);
  //   border-radius: 4px 4px 4px 4px;
  //   box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.25);
  //   background-color: var(--top-nav-color-bg);

  //   .el-menu-item {
  //     min-width: 100%;
  //     border-bottom: 1px solid var(--first-border-color);
  //     background-color: var(--top-nav-color-bg);
  //     color: var(--first-font-color);

  //     &:last-child {
  //       border-bottom: 0;
  //     }

  //     &:hover {
  //       background-color: var(--top-nav-color-bg-active);
  //     }
  //   }

  //   .is-active {
  //     color: var(--active-color);
  //     background-color: var(--top-nav-color-bg-active);
  //   }
  // }

  a {
    color: #333;
    text-decoration: none;
  }

  .svg-icon {
    font-size: 16px;
    font-weight: 700;
  }

  .menu-title {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>