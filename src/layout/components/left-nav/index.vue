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
  <!-- <el-menu :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" class="el-menu-vertical-demo">
    <template v-for="(item, index) in leftNavRoutes" :key="index">
      <left-nav-item :navInfo="item" :isNest="true" :basePath="''" v-if="!item.hidden" />
    </template>
</el-menu> -->

  <el-menu :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" class="el-menu-vertical-demo">
    <left-nav-item v-for="(item, index) in leftNavRoutes" :key="index" :navInfo="item" :isNest="true" :basePath="''" />
  </el-menu>


</template>

<script setup>
  import LeftNavLogo from './components/left-nav-logo'
  import LeftNavItem from './components/left-nav-item'
  import useAppStore from '@/store/system/app'
  import useRouterStore from '@/store/system/router'
  const appStore = useAppStore()
  const routerStore = useRouterStore()
  const route = useRoute()


  const isCollapse = computed(() => !appStore.leftNav.isExpand)
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

<style scoped lang="scss"></style>
