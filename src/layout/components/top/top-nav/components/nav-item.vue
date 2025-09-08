<template>
  <div class="menu-item-container" v-if="!navInfo.hidden">
    <el-menu-item v-if="isNoChildShow()" :index="onlyOne.path" :class="[...(onlyOne.meta?.class || [])]" @click="handleClickMenuItem(onlyOne,)">
      <c-icon :i="onlyOne.meta?.icon || ''" class="menu-icon" />
      <template #title><span class="menu-title" :title="hasTitle(onlyOne.meta?.title)">{{ onlyOne.meta?.title }}</span></template>
    </el-menu-item>
    <el-sub-menu v-else ref="subMenu" :index="navInfo.meta?.fullPath" :class="[...(navInfo.meta?.class || [])]" teleported popper-class="top-nav-el-menu-vertical">
      <template v-if="navInfo.meta" #title>
        <c-icon :i="navInfo.meta?.icon || ''" class="menu-icon" />
        <span class="menu-title" :title="hasTitle(navInfo.meta?.title)">{{ navInfo.meta?.title }}</span>
      </template>
      <nav-item v-for="(item, index) in navInfo.children" :key="index" :isJump="isJump" :isNest="true" :navInfo="item" />
    </el-sub-menu>
  </div>
</template>

<script setup>
// # 一、综合
// 插件
import { isExternal } from '@/utils/validate'
// pinia
import useStore from '@/store'
// props
const props = defineProps({
  navInfo: { type: Object, required: true },
  isNest: { type: Boolean, default: false },
  isJump: { type: Boolean, default: false },
})

// 声明
const { menuStore } = useStore()
const emit = defineEmits()
const { proxy } = getCurrentInstance()
const isShowFirstIcon = ref(false)
const isShowNestIcon = ref(false)
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
    onlyOne.value = { ...self, path: handleLinkPath(props.navInfo?.meta?.fullPath), }
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
  //   onlyOne.value = { ...self, path: handlePath(props.navInfo?.meta?.fullPath), noshowChildren: true }
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
  if (props.isJump) {
    if (onlyOne.value.meta?.link && onlyOne.value.meta?.linkBlank) {
      const link = document.createElement('a')
      link.href = onlyOne.value.meta.link
      link.target = '_blank'
      link.click()
    }
    router.push(onlyOne.value.path)
  }
  menuStore.setCurrentTopMenu(self)
}
// ^
// ^
// ^
// ^
</script>
