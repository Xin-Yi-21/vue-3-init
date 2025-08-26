<template>
  <div :class="['left-nav-vue', isVerticalCollapse ? 'is-vertical-collapse' : 'is-vertical-expand', isHorizontalCollapse ? 'is-horizontal-collapse' : 'is-horizontal-expand', leftNavSetting.showType === 'all' ? 'style1' : 'style2']" id="left-nav-vue" ref="lnmRef">

    <div class="part-header" v-if="leftNavSetting.isCustomHeader">
      <c-icon i="c-back" v-if="currentShow.menuGroup?.meta?.clickIn && !isHorizontalCollapse" :tip="`返回上级菜单：${currentShow.previousMenuGroup?.meta?.fullTitle || currentShow.fullTitle.split(' - ')[0] || ''}`" tipClass="c-tooltip" hoverColor="" showType="el" size="16" cursor="pointer" class="back-icon" @click="handlePreviousMenu"></c-icon>
      <c-icon i="c-menu" v-else size="16" class="menu-icon"></c-icon>
      <div class="content" :hasBack="currentShow.menuGroup?.meta?.clickIn" v-if="!isHorizontalCollapse">
        <span class="text">
          <c-tooltip :content="currentShow.fullTitle" targetClass="overflow-test" placement="top" effect="light" maxWidth="400">
            <c-scroll direction="x" scrollType="smooth" :stepTime="1000" :stayTime="0" :scrollBar="false">
              <span class="overflow-test"> {{ currentShow.menuGroup?.meta?.title || currentShow.menu?.[0]?.meta?.title }} </span>
            </c-scroll>
          </c-tooltip>
        </span>
      </div>
      <c-icon i="c-normal-down" size="18" :class="['toggle-icon', isVerticalCollapse ? 'is-rotate' : '']" cursor="pointer" v-if="!isHorizontalCollapse" @click="handleVerticalToggleMenu"></c-icon>
    </div>

    <el-menu :key="menuKey" mode="vertical" ref="menuRef" :collapse="isHorizontalCollapse" :unique-opened="false" :collapse-transition="false" :default-active="activeMenu" :default-openeds="opendMenu" :class="['left-el-menu',]" @select="handleMenuSelect" @close="handleMenuClose" @open="handleMenuOpen">
      <el-scrollbar ref="menuScrollbarRef" class="c-el-scrollbar menu-scrollbar">
        <nav-item v-for="(item, index) in currentShow.menu" :key="index" :navInfo="item" :currentIn="currentShow.menuGroup?.name" :isCollapse="isHorizontalCollapse" :isNest="true" @refresh="handleNextMenu" @rightClick="handleRightClick" />
      </el-scrollbar>
    </el-menu>

    <ul v-show="contextMenu.visible" :style="{ left: contextMenu.left + 'px', top: contextMenu.top + 'px' }" class="contextmenu">
      <li @click="handleAddTag('browser')">
        <c-icon i="c-add" cursor="pointer" size="14"></c-icon>
        <span class="operate-text">新建标签页</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import NavItem from './components/nav-item'
// pinia
import useStore from '@/store'
// hook
import { useResizeObserver } from '@/hooks/resizeObserver'
// 声明
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const { menuStore, settingStore, stationStore, tagStore } = useStore()
const leftNavSetting = { showType: 'set', isMenuWithParent: false, isCustomHeader: true, }
// ^

// # 二、模块功能
// # 1、初始化
function init() {
  setResizeObserver()
  initMenu()
}
// # (1) 设置容器大小监听
const lnmRef = ref(null)
const menuScrollbarRef = ref(null)
function setResizeObserver() {
  useResizeObserver(lnmRef, () => {
    menuScrollbarRef.value?.update()
  })
}
// ^
// ^
// # 2、获取显示菜单
const menuRef = ref(null)
const menuKey = ref(0)
// # (1) 初始化菜单
const allMenu = ref([])
function initMenu() {
  allMenu.value = JSON.parse(JSON.stringify(menuStore.navRoutes || []))
  let routeName = route.name
  let menuGroup = {}
  if (leftNavSetting.showType === 'all') {
    menuGroup = { children: allMenu.value }
  } else {
    menuGroup = locateMenuGroup(routeName)
  }
  // console.log('查menuGroup', toRaw(menuGroup))
  setCurrentShow(menuGroup)
}
// ^
// # (2) 定位菜单
function locateMenuGroup(targetName) {
  let targetMenu = JSON.parse(JSON.stringify(allMenu.value))
  let path = null
  function findMenu(node) {
    if (node.name === targetName) { return [node] }
    if (node.children) {
      for (let child of node.children) {
        const subMenu = findMenu(child)
        if (subMenu) { return [node, ...subMenu] }
      }
    }
    return null
  }
  for (let item of targetMenu) {
    path = findMenu(item)
    if (path) break
  }
  if (!path) return []
  path = path.filter(item => item.meta.menu?.includes('left'))
  // console.log('递归定位path', path)
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i].meta?.clickIn && targetName != path[i].name) {
      return path[i]
    }
  }
  return path[0]
}
// ^
// # (3) 设置show值：页面初始化刷新， route变化刷新，点击顶部刷新，进入下级刷新，返回上级刷新
const currentShow = ref({ fullTitle: '', menuGroup: {}, menu: [], })
function setCurrentShow(menuGroup = {}) {
  if (!menuGroup.name) { menuGroup.name = menuGroup?.children?.[0]?.name || '' }
  if (currentShow.value.menuGroup.name === menuGroup.name) return  // 解决路由重复刷新菜单bug
  let newCurrentShow = {
    fullTitle: route.meta?.fullTitle,
    menuGroup: menuGroup,
    menu: (!leftNavSetting.isMenuWithParent || leftNavSetting.showType === 'all') ? menuGroup.children : [menuGroup],
    previousMenuGroup: locateMenuGroup(menuGroup.name),
  }
  currentShow.value = newCurrentShow
  if (leftNavSetting.isMenuWithParent) {
    //  如带上级标签，解决el-submenu的click事件和el-menu的open和close事件冲突效果bug。
    nextTick(() => { menuRef.value && currentShow.value.menuGroup?.meta?.fullPath && menuRef.value.open(currentShow.value.menuGroup.meta.fullPath) })
  }
  // console.log('当前显示菜单currentShow', toRaw(newCurrentShow))
  menuKey.value++
}
// ^
// ^
// # 3、菜单操作
// # (1) 进入下级菜单
function handleNextMenu(self) {
  setCurrentShow(self)
}
// ^
// # (2) 返回上级菜单
function handlePreviousMenu(e) {
  e && e.stopPropagation()
  let routeName = currentShow.value.menuGroup.name
  let menuGroup = locateMenuGroup(routeName)
  setCurrentShow(menuGroup)
}
// ^
// # (3) 横向折叠展开
const isHorizontalCollapse = computed(() => settingStore.leftSide.isCollapse)
// ^
// # (4) 竖向折叠展开
const isVerticalCollapse = ref(false)
function handleVerticalToggleMenu() {
  isVerticalCollapse.value = !isVerticalCollapse.value
}
// ^
// # (5) 菜单项折叠展开
function handleMenuOpen(path, pathArr) {
  // console.log('sunMenu展开', path, pathArr)
}
function handleMenuClose(path, pathArr) {
  // console.log('sunMenu收起', path, pathArr)
}
function handleMenuSelect(path, pathArr) {
  // console.log('菜单激活', path, pathArr)
}
// ^
// ^
// # 4、右键事件
const contextMenu = ref({ visible: false, left: 0, top: 0 })
const rightClickMenuItem = ref({})
function handleRightClick(e, self,) {
  rightClickMenuItem.value = self
  // 可以根据 event.clientX / clientY 获取点击位置
  const menuMinWidth = 120
  const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  // const l = e.clientX - offsetLeft + 15 // 15: margin right
  const l = e.clientX // 15: margin right
  // console.log('查宽度', e.clientX, offsetLeft, offsetWidth, l)

  contextMenu.value.left = 190
  contextMenu.value.top = e.clientY - 90
  contextMenu.value.visible = true
}
watch(() => contextMenu.value.visible, (nv) => {
  if (nv) {
    document.body.addEventListener('click', () => { contextMenu.value.visible = false })
  } else {
    document.body.removeEventListener('click', () => { contextMenu.value.visible = false })
  }
})
function handleAddTag(type) {
  if (type == 'page') {
    // tagStore.addTag(rightClickMenuItem.value, { station: stationStore.currentStation })
    // console.log('查rightClickMenuItem', rightClickMenuItem.value)
    router.push(rightClickMenuItem.value.meta.fullPath)
  } else {
    window.open(window.location.href, '_blank');
  }

}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
// 监听路由，刷新菜单
watch(() => route, () => {
  initMenu()
}, { deep: true, })

// 监听currentTopMenu,刷新菜单
watch(() => menuStore.currentTopMenu, (nv, ov) => {
  let routeName = nv.name
  let menuGroup = locateMenuGroup(routeName)
  setCurrentShow(menuGroup)
}, { deep: true })

watchEffect(() => {

})

// 设置菜单高亮和默认状态
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const opendMenu = computed(() => {
  const { meta, path } = route
  let menuArr = []
  if (meta.activeMenu) {
    menuArr.push(meta.activeMenu)
  } else {
    menuArr.push(path)
  }
})

defineExpose({ isVerticalCollapse })
// ^
</script>

<style lang="scss" scoped>
// 样式2：set菜单
.left-nav-vue.style2 {
  width: 220px;
  flex: 1;
  margin: 10px;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
  border-radius: 2px;

  &.is-vertical-collapse {
    flex: initial;
    height: 40px;
  }

  &.is-horizontal-collapse {
    display: none;
  }

  .part-header {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    overflow: hidden;
    height: 40px;
    padding: 0 10px;
    color: var(--tc);
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;

    .content {
      flex: 1;
      flex-shrink: 0;
      height: 100%;
      display: inline-flex;
      align-items: center;
      margin-left: 10px;

      &[hasBack=true] {
        width: calc(100% - 80px);
      }

      .text {
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    :deep(.c-icon) {
      color: var(--tc);
      font-size: 18px;
      margin: 0;

      &.menu-icon {
        transform: translateY(1px);
      }

      &.toggle-icon {
        transition: transform 0.5s ease;

        &.is-rotate {
          transform: rotate(-180deg);
        }
      }
    }

    .header-station {
      display: inline-flex;
      align-items: center;
      margin-left: 5px;
    }
  }

  :deep(.left-el-menu) {
    width: 100%;
    height: calc(100% - 40px);
    border-right: 0;
    background-color: transparent;

    .el-scrollbar__view {
      padding-top: 5px;
    }

    .el-menu {
      background-color: transparent;
    }

    .menu-item-container {
      position: relative;
      min-height: 38px;
      // margin-bottom: 6px;
      margin: 0 10px 10px;

      .menu-item-container {
        margin: 0;
      }

      &.is-hidden {
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        min-height: 0;
      }

      a {
        display: block;
        text-decoration: none;
        height: 38px;
      }

      .svg-icon {
        flex-shrink: 0;
        font-size: 18px;
        font-weight: 400;
      }

      li {
        height: 100%;
        background-color: var(--bg-leftNav);

        .menu-title {
          overflow: hidden;
          flex-grow: 1;
          margin: 0 5px 0 5px;
          height: 100%;
          display: flex;
          align-items: center;
          color: inherit;
          font-size: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &.el-menu-item {
          display: flex;
          align-items: center;
          min-width: 0;
          color: #999;
          box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
          border-radius: 2px 2px 2px 2px;

          :root[theme-style='light'] & {
            background: #fff;
          }

          :root[theme-style='dark'] & {
            background: #414141;
          }

          &:hover {
            background-color: var(--bg-hover) !important;
          }

          &.is-active {
            font-weight: 500;
            background-color: var(--tc) !important;

            & * {
              color: #fff;
            }
          }

          .go-in {
            position: absolute;
            right: 20px;
            cursor: pointer;
          }

        }

        &.el-sub-menu {
          // position: relative;
          // margin: 0 10px;
          // background: #FFFFFF;
          box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
          border-radius: 2px 2px 2px 2px;
          overflow: hidden;

          :root[theme-style='light'] & {
            background: #fff;
          }

          :root[theme-style='dark'] & {
            background: #414141;
          }

          .el-sub-menu__title {
            // position: static;
            display: flex;
            align-items: center;
            height: 38px;
            color: #999;

            &:hover {
              background-color: var(--bg-hover);
            }

            .el-sub-menu__icon-arrow {
              right: 10px;
            }

            .go-in {
              position: absolute;
              right: 20px;
              cursor: pointer;
            }
          }

          &.n-o-i {
            .el-sub-menu__icon-arrow {
              display: none;
            }
          }

          &.is-active {
            &>.el-sub-menu__title {
              font-weight: 500;
              color: var(--tc);
            }
          }
        }
      }
    }

  }

  .contextmenu {
    position: absolute;
    margin: 0;
    padding: 5px 0;
    background: var(--bg-inner-primary);
    z-index: 3000;
    list-style-type: none;
    border-radius: 4px;
    color: var(--fcs);
    font-size: 12px;
    font-weight: 400;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.4);

    li {
      display: flex;
      align-items: center;
      height: 30px;
      margin: 0;
      padding: 0 15px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;

      .operate-text {
        font-size: 12px;
      }

      svg {
        margin-right: 5px;
      }

      &:hover {
        background: var(--bg-hover);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#left-nav-vue {
  :deep(.left-el-menu) {

    // --el-menu-base-level-padding: 5px;


    .jzjj-1,
    .jzjjbd-1,
    .jzjjbt-1,
    .sbxs-1,
    .gpjy-1,
    .cyqx-1,
    .gdch-1 {
      &.is-opened {
        padding-bottom: 1px;
      }

      &.is-active>.el-sub-menu__title {
        background-color: var(--tc) !important;
        color: #fff;
      }

      .el-sub-menu {
        box-shadow: none;
        background-color: transparent;
        border-radius: 0;
      }

      .el-menu-item {
        box-shadow: none;
        background-color: transparent;
        border-radius: 0;

        &:hover {
          background-color: var(--bg-hover);
        }

        &.is-active {
          & * {
            color: var(--tc);
          }
        }
      }

      .menu-item-container {
        min-height: 33px;
        margin-bottom: 4px;

        a {
          height: 33px;
        }
      }

    }

    .jzjj-2,
    .jzjjbd-2,
    .jzjjbt-2,
    .sbxs-2,
    .gpjy-2,
    .cyqx-2,
    .gdch-2 {
      .el-sub-menu__title {
        height: 33px;
        padding: 0 20px 0 30px;


        .menu-title {
          font-size: 14px;
        }
      }

      &.el-menu-item {
        height: 33px;
        padding: 0 20px 0 30px;
        background-color: transparent !important;

        .menu-title {
          font-size: 14px;
        }

        &:hover {
          background-color: var(--bg-hover) !important;
        }
      }

      .menu-item-container {
        height: 26px;
        min-height: 26px;
        margin: 4px 0;

        a {
          height: 100%;
        }
      }
    }

    .jzjj-3,
    .jzjjbd-3,
    .jzjjbt-3,
    .sbxs-3,
    .gpjy-3,
    .gdch-3 {
      &.el-menu-item {
        height: 26px;
        padding: 0 20px 0 50px;
        background-color: transparent !important;

        &:hover {
          background-color: var(--bg-hover) !important;
        }
      }

      .menu-title {
        font-size: 12px;
      }
    }

    .jzjj-1,
    .jzjjbt-1 {
      --tc: #ffb133;
      --bg-hover: rgba(255, 177, 51, 0.1);

      :root[theme-style='light'] & {
        background: #fffbf4;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
      }

      >.el-sub-menu__title {
        background: #fff1db;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }
    }

    .jzjjbd-1 {
      --tc: #f4770a;
      --bg-hover: rgba(244, 119, 10, 0.1);

      :root[theme-style='light'] & {
        background: #fffefd;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
      }

      >.el-sub-menu__title {
        background: #ffe8d4;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }
    }

    .sbxs-1 {
      --tc: #28c7eb;
      --bg-hover: rgba(40, 199, 235, 0.1);

      :root[theme-style='light'] & {
        background: #f7feff;
        box-shadow: 0px 0px 5px 0px rgba(11, 128, 155, 0.25);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 5px 0px rgba(11, 128, 155, 0.25);
      }

      &.is-opened {
        padding-bottom: 1px;
      }

      >.el-sub-menu__title {
        background: #e1faff;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }

    }

    .gpjy-1 {
      --tc: #37b29c;
      --bg-hover: rgba(55, 178, 156, 0.1);

      :root[theme-style='light'] & {
        background: #fafffe;
        box-shadow: 0px 0px 4px 0px rgba(0, 80, 66, 0.23);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 4px 0px rgba(0, 80, 66, 0.23);
      }

      &.is-opened {
        padding-bottom: 1px;
      }

      >.el-sub-menu__title {
        background: #d0f1eb;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }
    }

    .gdch-1 {
      --tc: #ff5e31;
      --bg-hover: rgba(255, 94, 49, 0.1);

      :root[theme-style='light'] & {
        background: #fffdfd;
        box-shadow: 0px 0px 5px 0px rgba(0, 45, 107, 0.26);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 5px 0px rgba(0, 45, 107, 0.26);
      }

      &.is-opened {
        padding-bottom: 1px;
      }

      >.el-sub-menu__title {
        background: #ffefeb;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }

    }

    .cyqx-1 {
      --tc: #8176FF;
      --bg-hover: rgba(129, 118, 255, 0.1);

      :root[theme-style='light'] & {
        background: #E0EDFF;
        box-shadow: 0px 0px 5px 0px rgba(0, 45, 107, 0.26);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
        box-shadow: 0px 0px 5px 0px rgba(0, 45, 107, 0.26);
      }

      &.is-opened {
        padding-bottom: 1px;
      }

      >.el-sub-menu__title {
        background: #E0EDFF;
        color: var(--tc);

        :root[theme-style='dark'] & {
          background: transparent;
        }
      }

    }

    .jyzl-1 {
      --tc: #3886F2;
      --bg-hover: rgba(56, 134, 242, 0.1);

      :root[theme-style='light'] & {
        background: #E5F0FF;
        box-shadow: 0px 0px 5px 0px rgba(23, 83, 164, 0.28);
      }

      :root[theme-style='dark'] & {
        background: transparent;
        border: 1px solid var(--tc);
      }


      &.el-menu-item {
        background: #E5F0FF;
        color: var(--tc);
      }

      &.is-active {
        background-color: var(--tc) !important;
        color: #fff;
      }


    }


  }
}
</style>