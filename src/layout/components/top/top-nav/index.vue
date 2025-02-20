<template>
  <div class="top-nav-vue">
    <el-scrollbar wrap-class="c-el-scrollbar">
      <el-menu :unique-opened="true" :collapse-transition="false" mode="horizontal" :ellipsis="false" :default-active="activeMenu" menu-trigger="hover" class="top-nav-menu" :teleported="true">
        <nav-item v-for="(item, index) in topNavRoutes" :key="index" :navInfo="item" :isNest="true" :basePath="''" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// 一、综合初始化
import NavItem from './components/nav-item'
import userMenuStore from '@/store/system/menu'

const menuStore = userMenuStore()
const route = useRoute()
const topNavRoutes = computed(() => menuStore.topNavRoutes)
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
  width: 100%;
  height: var(--top-nav-height);

  :deep(.top-nav-menu) {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--bg-topNav);
    border-bottom: 1px solid var(--bcp);

    .menu-item-container {
      flex: 1;
      flex-shrink: 0;
      height: 100%;
      border-right: 1px solid var(--bcp);

      &:last-child {
        border-right: 0;
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
        height: 100%;
        position: relative;

        &.el-menu-item {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fcpl);
          background-color: var(--bg-topNav);

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
          display: flex;
          align-items: center;
          justify-content: center;

          &.is-active {
            .el-sub-menu__title {
              font-weight: 700;

              & * {
                color: var(--tc);
              }
            }
          }

          .el-sub-menu__title {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 0;
            color: var(--fcpl);

            &:hover {
              background-color: var(--tc);

              & * {
                color: var(--fcpl);
              }
            }

            .el-sub-menu__icon-arrow {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%) !important;
              width: 20px;
              margin-top: 0;
              font-size: 16px;
            }
          }
        }

        .menu-title {
          height: 100%;
          margin: 0 10px;
          line-height: 49px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: inherit;
        }
      }
    }

  }
}
</style>
<style lang="scss">
// 模块全局样式
.top-nav-vertical-menu {

  // width: calc((100% - var(--left-nav-width)) / 5);
  .el-menu--popup {
    padding: 0;

    .menu-item-container {
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
        .menu-title {
          height: 100%;
          margin: 0 20px 0 10px;
          line-height: 36px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--fcpl);
        }

        &.el-menu-item {
          height: 100%;
          display: flex;
          align-items: center;
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
          display: flex;
          align-items: center;

          &.is-active {
            .el-sub-menu__title {
              font-weight: 700;

              & * {
                color: var(--tc);
              }
            }
          }

          .el-sub-menu__title {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            border-bottom: 0;
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
            }

          }
        }
      }
    }
  }
}
</style>