<template>
  <div :class="['left-nav-vue', isCollapse ? 'is-collapse' : 'is-expand']">
    <el-scrollbar wrap-class="c-el-scrollbar">
      <el-menu mode="vertical" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" :default-active="activeMenu" class="left-nav-menu">
        <nav-item v-for="(item, index) in leftNavRoutes" :key="index" :navInfo="item" :isNest="true" :basePath="''" />
      </el-menu>
    </el-scrollbar>
  </div>

</template>

<script setup>
// 一、综合初始化
import NavItem from './components/nav-item'
import useSettingStore from '@/store/framework/setting'
import useMenuStore from '@/store/framework/menu'

const settingStore = useSettingStore()
const menuStore = useMenuStore()
const route = useRoute()
const isCollapse = computed(() => settingStore.leftNav.isCollapse)
const leftNavRoutes = computed(() => menuStore.leftNavRoutes)
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

</script>
<style lang="scss" scoped>
.left-nav-vue {
  box-sizing: border-box;
  height: 100%;
  border-right: 1px solid var(--bcp);
  background-color: var(--bg-leftNav);

  :deep(.left-nav-menu) {
    width: 100%;
    border-right: 0;
    background-color: transparent;

    .el-menu {
      background-color: transparent;
    }

    .menu-item-container {
      min-height: 60px;

      a {
        text-decoration: none;
      }

      .svg-icon {
        flex-shrink: 0;
        font-size: 18px;
        font-weight: 700;
      }

      li {
        height: 100%;
        background-color: var(--bg-leftNav);

        .menu-title {
          overflow: hidden;
          flex: 1;
          height: 60px;
          margin: 0 20px 0 10px;
          line-height: 60px;
          color: inherit;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &.el-menu-item {
          display: flex;
          align-items: center;
          min-width: 0;
          height: 60px;
          color: var(--fcpl);

          &.is-active {
            font-weight: 700;

            & * {
              color: var(--tc);
            }
          }

          &:hover {
            background-color: var(--tc);

            & * {
              color: var(--fcpl);
            }

          }
        }

        &.el-sub-menu {

          &.is-active {
            .el-sub-menu__title {
              font-weight: 700;
            }
          }

          .el-sub-menu__title {
            display: flex;
            align-items: center;
            height: 60px;
            color: var(--fcpl);

            &:hover {
              background-color: var(--tc);

              & * {
                color: var(--fcpl);
              }
            }
          }
        }
      }
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
}
</style>
<style lang="scss">
// 模块全局样式
.left-nav-vertical-menu {

  .el-menu--popup {
    padding: 0;

    .menu-item-container {
      min-height: 50px;
      border-bottom: 1px solid var(--bcp);

      &:last-child {
        border-bottom: 0;
      }

      a {
        color: var(--fcpl);
        text-decoration: none;
      }

      .svg-icon {
        font-size: 16px;
        font-weight: 700;
      }

      li {
        &.is-active {
          font-weight: 700;
        }

        &.el-menu-item {
          display: flex;
          align-items: center;
          height: 100%;
          background-color: var(--bg-primary);
          color: var(--fcpl);

          &.is-active {
            font-weight: 700;

            & * {
              color: var(--tc);
            }
          }

          &:hover {
            background-color: var(--tc);

            & * {
              color: var(--fcpl);
            }
          }
        }

        &.el-sub-menu {
          background-color: var(--bg-primary);

          &.is-active {
            .el-sub-menu__title {
              font-weight: 700;

              & * {
                color: var(--tc);
              }
            }
          }

          .el-sub-menu__title {
            display: flex;
            align-items: center;
            height: 50px;
            background-color: var(--bg-primary);
            color: var(--fcpl);

            &:hover {
              background-color: var(--tc);

              & * {
                color: var(--fcpl);
              }
            }

            .el-sub-menu__icon-arrow {
              width: auto;
              right: 10px;

              svg {
                display: none;
              }

              &::before {
                content: '\e677';
                font-family: 'iconfont';
                font-size: 18px;
                font-style: normal;
              }
            }
          }
        }

        .menu-title {
          overflow: hidden;
          height: 50px;
          margin: 0 20px 0 10px;
          line-height: 50px;
          color: inherit;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>