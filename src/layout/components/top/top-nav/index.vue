<template>
  <div class="top-nav-vue top-nav-menu">
    <el-scrollbar v-wheel="{ target: '.el-scrollbar__wrap' }">
      <!-- :default-active="activeMenu" -->
      <el-menu ref="topMenuRef" :unique-opened="true" :collapse-transition="false" mode="horizontal" :ellipsis="false" menu-trigger="click" class="top-nav-el-menu" :teleported="true" :close-on-click-outside="true">
        <nav-item v-for="(item, index) in topMenu" :key="index" :navInfo="item" :isNest="false" :basePath="''" :isJump="topMenuSetting.isJump" :class="activeTopMenu === item.path ? 'is-top-active' : ''" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import NavItem from './components/nav-item'
// pinia
import useStore from '@/store'
// 声明
const route = useRoute()
const { menuStore, settingStore } = useStore()
const navRoutes = computed(() => menuStore.navRoutes)
const topMenuSetting = { showType: 'set', isJump: false, } // showType:['all','set']
// ^

// # 二、模块功能
// # 1、初始化相关
function init() {
  getTopMenu()
}
// ^
// # 2、获取顶部菜单
const topMenu = ref([])
function getTopMenu() {
  // TODO：首页特殊情况
  function getMenu(routes) {
    const res = []
    routes.forEach(routeItem => {
      const newRoute = { ...routeItem }
      if (!newRoute.meta?.hideIn?.includes('top')) {
        if (Array.isArray(newRoute.children) && newRoute.children.length) {
          newRoute.children = getMenu(newRoute.children)
        }
        res.push(newRoute)
      }
    })
    return res
  }
  let newNavRoutes = JSON.parse(JSON.stringify(navRoutes.value))
  if (!settingStore.isTemplateManage) {
    newNavRoutes = newNavRoutes.filter(item => item.name != 'Template')
  }
  let newTopMenu = getMenu(newNavRoutes)
  topMenu.value = topMenuSetting.showType === 'all' ? navRoutes.value : newTopMenu
}
// ^
// # 3、设置激活菜单
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const activeTopMenu = computed(() => {
  return route.matched?.[0]?.path || ''
})
// ^
// ^

// # 三、机制
init()
watch(() => settingStore.isTemplateManage, (nv, ov) => {
  getTopMenu()
})
// ^
</script>
<style lang="scss" scoped>
.top-nav-vue {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 50px;
  align-items: center;

  :root[theme-style='dark'] & {
    background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    background-color: var(--bg-card);
  }

  :deep(.el-scrollbar) {
    width: 100%;

    .el-scrollbar__view {
      width: 100%;
      height: 100%;
    }
  }

  :deep(.top-nav-el-menu) {
    width: 100%;
    height: 100%;
    display: flex;
    border-bottom: 0;
    background-color: transparent;

    .menu-item-container {
      flex: 1;
      flex-shrink: 0;


      &.is-top-active {
        .menu-title {
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 25px; // 设置下划线与文字的垂直距离
          text-decoration-thickness: 3px; // 设置下划线的粗细
          text-decoration-color: var(--tc); // 设置下换线颜色
          color: var(--fcp);
        }
      }
    }

    a {
      display: flex;
      height: 100%;
      text-decoration: none;
      align-items: center;
    }

    .el-menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0 10px;
      color: var(--fcs);
      font-size: 20px;
      font-weight: 400;
      font-family: 'Source Han Sans';

      &:hover {
        background-color: var(--tc-alpha-50);
      }

      .menu-icon {
        margin-right: 5px;
      }

      // &.is-active {
      //   .menu-title {
      //     font-weight: 700;
      //     text-decoration: underline;
      //     text-underline-offset: 25px; // 设置下划线与文字的垂直距离
      //     text-decoration-thickness: 3px; // 设置下划线的粗细
      //     text-decoration-color: var(--tc); // 设置下换线颜色
      //     color: var(--fcp);
      //   }
      // }
    }

    .el-sub-menu {
      height: 100%;

      .el-sub-menu__title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        color: var(--fcs);
        font-size: 20px;
        font-weight: 400;
        font-family: 'Source Han Sans';

        &:hover {
          background-color: var(--tc-alpha-50);
        }

        .menu-icon {
          margin-right: 5px;
        }

        .menu-title {
          padding-right: 30px;
        }

        .el-sub-menu__icon-arrow {
          display: none;
          font-size: 18px;
          width: auto;
          right: 10px;
          top: 50%;
          margin: 0;
          transform: translateY(-50%) !important;
        }
      }

      // &.is-active {
      //   .el-sub-menu__title {
      //     .menu-title {
      //       font-weight: 700;
      //       text-decoration: underline;
      //       text-underline-offset: 25px; // 设置下划线与文字的垂直距离
      //       text-decoration-thickness: 3px; // 设置下划线的粗细
      //       text-decoration-color: var(--tc); // 设置下换线颜色
      //       color: var(--fcp);
      //     }
      //   }
      // }

      &.is-opened {
        .el-sub-menu__icon-arrow {
          transform: translateY(-50%) rotateZ(180deg) !important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
// 全局样式
.top-nav-el-menu-vertical {
  .el-menu--popup {
    padding: 0;

    .menu-item-container {
      border-bottom: 1px solid var(--bcs);

      &:last-child {
        border-bottom: 0;
      }

      a {
        text-decoration: none;
      }

      .el-menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36px;
        border-bottom: 0;
        color: var(--fcs);
        font-size: 16px;
        font-family: 'Source Han Sans';
        background-color: var(--bg-card);

        &:hover {
          background-color: var(--tc-alpha-50);
        }

        .menu-icon {
          font-size: 14px;
          margin-right: 5px;
        }

        .menu-title {
          font-size: 16px;
        }

        &.is-active {
          color: var(--tc);
          font-weight: 600;
        }
      }

      .el-sub-menu {
        display: flex;
        align-items: center;


        &.is-active {
          .el-sub-menu__title {
            & * {
              color: var(--tc);
              font-weight: 600;
            }
          }
        }

        .el-sub-menu__title {
          display: flex;
          align-items: center;
          width: 100%;
          height: 36px;
          padding: 0 40px 0 10px;
          border-bottom: 0;
          background-color: var(--bg-card);
          color: var(--fcs);
          font-size: 16px;
          font-family: 'Source Han Sans';

          &:hover {
            background-color: var(--tc-alpha-50);
          }

          .menu-icon {
            margin-right: 5px;
            font-size: 14px;
          }

          .menu-title {
            font-size: 16px;
          }

          .el-sub-menu__icon-arrow {
            font-size: 14px;
            width: auto;
            right: 10px;
            top: 50%;
            margin: 0;
            transform: translateY(-50%) !important;
          }
        }

        &.is-opened {
          .el-sub-menu__icon-arrow {
            transform: translateY(-50%) rotateZ(180deg) !important;
          }
        }
      }
    }
  }
}
</style>