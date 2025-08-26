<template>
  <div class="menu-item-container" v-if="!navInfo.hidden">
    <Link v-if="isNoChildShow()" :to="handleLinkPath(onlyOne.path, onlyOne.query)">
    <el-menu-item :index="onlyOne.path" :class="[...(onlyOne.meta?.class || [])]" @click="handleClickMenuItem(onlyOne,)" @contextmenu.prevent="handleRightClickMenuItem($event, onlyOne)">
      <!-- <svg-icon :icon-class="onlyOne.meta?.icon || navInfo.meta?.icon || ''" /> -->
      <template #title><span class="menu-title" :title="hasTitle(onlyOne.meta?.title)">{{ onlyOne.meta?.title }}</span></template>
    </el-menu-item>
    </Link>

    <el-sub-menu v-else ref="subMenu" :index="navInfo.meta?.fullPath" :class="[...(navInfo.meta?.class || []), navInfo.meta?.clickIn && navInfo.name != currentIn && !isCollapse ? 'n-o-i' : '']" teleported popper-class="left-nav-el-vertical-menu" @click="handleClickSubMenu(navInfo, $event)">
      <template v-if="navInfo.meta" #title>
        <!-- <svg-icon :icon-class="navInfo.meta?.icon || ''" /> -->
        <span class="menu-title" :title="hasTitle(navInfo.meta?.title)">{{ navInfo.meta?.title }}</span>
        <!-- <svg-icon icon-class="p-go-in" class="go-in" v-if="navInfo.meta?.clickIn && navInfo.name != currentIn && !isCollapse" /> -->
      </template>
      <nav-item v-show="!navInfo.meta?.clickIn || navInfo.name == currentIn || isCollapse" v-for="(item, index) in navInfo.children" :currentIn="currentIn" :key="index" :isNest="true" :navInfo="item" @refresh="handleRefresh" @rightClick="handleRightClickMenuItem" />
    </el-sub-menu>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Link from './link'
// 插件
import { isExternal } from '@/utils/validate'
// import { getNormalPath } from '@/utils/ruoyi'
// pinia
import useStore from '@/store'
// props
const props = defineProps({
  navInfo: { type: Object, required: true },
  isNest: { type: Boolean, default: false },
  basePath: { type: String, default: '' },
  isTopPath: { type: Boolean, default: false },
  currentIn: { type: String, default: '' },
  isCollapse: { type: Boolean, default: false, }
})
// 声明
const { tagStore, stationStore } = useStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits()
const { proxy } = getCurrentInstance()
// ^

// # 二、模块功能
// # 1、判断没有可供显示的子项
const onlyOne = ref({})
function isNoChildShow() {
  const self = props.navInfo
  const children = props.navInfo?.children || []
  const showChildren = children?.filter(item => !item.hidden) || []
  // 可显示的children为0个
  if (showChildren.length === 0) {
    onlyOne.value = { ...self, path: handleLinkPath(props.navInfo?.meta?.fullPath), noshowChildren: true }
    return true
  }

  // 可显示的children为1个
  if (showChildren.length === 1) {
    if (!self.alwaysShow) {  // 作为menu-item覆盖
      onlyOne.value = { ...showChildren[0], path: handleLinkPath(props.navInfo?.meta?.fullPath + '/' + showChildren[0].path) }
      return true
    } else {
      return false
    }
  }

  // if (self.meta.clickIn && self.name != props.currentIn) {
  //   onlyOne.value = { ...self, path: handleLinkPath(props.navInfo?.meta?.fullPath), noshowChildren: true }
  //   return true
  // }
  return false
}
// ^
// # 2、处理路径
// # (1) link路径信息
function handleLinkPath(path, query,) {
  if (isExternal(path)) { return path }
  let newPath = getNormalPath(path)
  if (query) {
    return { path: newPath, query: JSON.parse(query) }
  } else {
    return newPath
  }
}
// ^
// # (2) 路径规范化处理
function getNormalPath(p) {
  // 异常判断
  if (p?.length === 0 || !p || p == 'undefined') { return p }
  // 双// 替换为 /
  let res = p.replace('//', '/')
  // 移除路径结尾的/
  if (res[res.length - 1] === '/') { return res.slice(0, res.length - 1) }
  return res
}
// ^
// ^
// # 3、标题悬浮提示
function hasTitle(title) {
  return title?.length > 5 ? title : ''
}
// ^
// # 4、el-menu-item 事件
// # (1) 单击
function handleClickMenuItem(self) {
  tagStore.updateTag(self, { station: stationStore.currentStation })
}
// ^
// # (2) 右击
const rightClickMenuItem = ref({})
function handleRightClickMenuItem(e, self,) {
  // console.log('右键被点击了',)
  rightClickMenuItem.value = self
  emit('rightClick', e, self)
}
// ^
// ^
// # 5、el-submenu 事件
function handleClickSubMenu(self, e) {
  // 阻止el-submenu点击冒泡
  e && e.stopPropagation()

  // 阻止el-menu-item点击冒泡
  if (e.target.closest('.el-menu-item')) {
    // console.log('阻止el-menu-item点击冒泡')
    return
  }
  if (self?.meta?.clickIn && self.name != props.currentIn && !props.isCollapse) {
    e && e.preventDefault()
    handleRefresh(self)
  }
}
// ^
// # 6、监听刷新
function handleRefresh(self) {
  emit('refresh', self)
}
// ^
// ^
</script>
