<template>
  <div class="top-nav-vue">
    <!-- :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
    :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
    :active-text-color="theme"
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    :collapse-transition="false"
    mode="vertical" -->
    <!-- -->
    <!-- <el-menu :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" class="el-menu-vertical-demo">
    <template v-for="(item, index) in leftNavRoutes" :key="index">
      <left-nav-item :navInfo="item" :isNest="true" :basePath="''" v-if="!item.hidden" />
    </template>
</el-menu> -->
    <!-- -->
    <el-scrollbar wrap-class="c-el-scrollbar">
      <el-menu :unique-opened="false" :collapse-transition="false" mode="horizontal" popper-class="top-nav-menu-modal">
        <left-nav-item v-for="(item, index) in leftNavRoutes" :key="index" :navInfo="item" :isNest="true" :basePath="''" />
      </el-menu>
    </el-scrollbar>

  </div>

</template>

<script setup>
import LeftNavItem from './components/left-nav-item'
import useAppStore from '@/store/system/app'
import useRouterStore from '@/store/system/router'
const appStore = useAppStore()
const routerStore = useRouterStore()
const route = useRoute()


const isCollapse = computed(() => appStore.leftNav.isCollapse)
const leftNavRoutes = computed(() => routerStore.leftNavRoutes)

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

</script>

<style lang="scss" scoped>
.top-nav-vue {
  height: 50px;
  overflow: hidden;
  border-right: 1px solid #ccc;

  :deep(.el-menu) {
    width: 100%;
    height: 50px;
    border-right: 0;

    a {
      color: #333;
      text-decoration: none;
    }

    .svg-icon {
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .menu-title {
      flex: 1;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-menu-item {
      display: flex;
      height: 60px;

      &.is-active {
        font-weight: 700;
      }
    }
  }

  &.is-collapse {
    width: 60px;

    :deep(.el-menu) {
      .menu-title {
        margin-left: 0;
      }
    }
  }

  &.is-expand {
    width: 200px;
  }



}
</style>
<style lang="scss">
// 组件内全局样式
.top-nav-menu-modal {
  a {
    color: #333;
    text-decoration: none;
  }

  .svg-icon {
    font-size: 16px;
    font-weight: 700;
  }

  .menu-title {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>