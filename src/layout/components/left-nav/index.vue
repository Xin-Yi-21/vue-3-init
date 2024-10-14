<template>
  <!-- <div :class="['left-nav-vue', isCollapse ? 'is-collapse' : 'is-expand']"> -->
  <!-- <left-nav-logo v-if="showLogo" :collapse="isCollapse" /> -->
  <!-- :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
    :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
    :active-text-color="theme"
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    :collapse-transition="false"
    mode="vertical" -->
  <!-- -->
  <el-menu :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" class="el-menu-vertical-demo">
    <left-nav-item v-for="(item, index) in leftNavRoutes" :key="index" :navInfo="item" :base-path="''" isTopPath />
  </el-menu>

  <!-- :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
  :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor" -->
  <!-- :active-text-color="theme" -->
  <!-- <div class="sidebar-container">
    <el-menu
      active-text-color="red"
      default-active="index"
      :collapse="true"
      :unique-opened="true"
      :collapse-transition="false"
      mode="vertical">
      <sidebar-item
        v-for="(route, index) in leftNavRoutes"
        :key="route.path + index"
        :item="route"
        :base-path="route.path" />
    </el-menu>
  </div> -->

  <!-- <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse">
    <el-sub-menu index="1">
      <template #title>
        <svg-icon icon-class="c-system-manage" />
        <span>Navigator One</span>
      </template>
<el-menu-item-group>
  <el-menu-item index="1-1">item one</el-menu-item>
  <el-menu-item index="1-2">item two</el-menu-item>
</el-menu-item-group>
<el-menu-item-group title="Group Two">
  <el-menu-item index="1-3">item three</el-menu-item>
</el-menu-item-group>
<el-sub-menu index="1-4">
  <template #title><span>item four</span></template>
  <el-menu-item index="1-4-1">item one</el-menu-item>
</el-sub-menu>
</el-sub-menu>
<el-menu-item index="2">
  <svg-icon icon-class="c-system-manage" />
  <template #title>Navigator Two</template>
</el-menu-item>
<el-menu-item index="3" disabled>
  <svg-icon icon-class="c-system-manage" />
  <template #title>Navigator Three</template>
</el-menu-item>
<el-menu-item index="4">
  <svg-icon icon-class="c-system-manage" />
  <template #title>Navigator Four</template>
</el-menu-item>
</el-menu> -->
  <!-- </div> -->
</template>

<script setup>
  import LeftNavLogo from './components/left-nav-logo'
  import LeftNavItem from './components/left-nav-item'
  import useAppStore from '@/store/system/app'
  import useRouterStore from '@/store/system/router'
  import SidebarItem from './components/SidebarItem'
  const appStore = useAppStore()
  const routerStore = useRouterStore()
  const route = useRoute()
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
  } from '@element-plus/icons-vue'

  // const isCollapse = computed(() => !appStore.leftNav.isExpand)
  const isCollapse = computed(() => {
    // console.log('查isCollapse', !appStore.leftNav.isExpand)
    return !appStore.leftNav.isExpand
  })

  const activeMenu = computed(() => {
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path;
  })

  const leftNavRoutes = computed(() => routerStore.leftNavRoutes);
  // console.log('查leftNavRouters', routerStore.leftNavRoutes)
</script>

<style scoped lang="scss">
// .left-nav-vue {
//   height: 100%;
//   background-color: pink;

//   &.is-expand {
//     width: 240px;
//   }

//   &.is-collapse {
//     width: 50px;
//   }
// }</style>
<style></style>
