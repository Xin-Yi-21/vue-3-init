<template>
  <div class="menu-item-container" v-if="!navInfo.hidden">
    <!-- [ 当前导航无子导航 , 当前导航有1个子导航 && 子导航无子项  && alwaysShow为true ] -->
    <Link v-if="judgeChild(navInfo.children, navInfo) && (!onlyOne.children || onlyOne.noshowChildren) && !navInfo.alwaysShow && onlyOne.meta" :to="handlePath(onlyOne.path, onlyOne.query)">
    <el-menu-item :index="handlePath(onlyOne.path)" :class="{ 'submenu-title-noDropdown': !isNest }" @click="handleGo(onlyOne)">
      <svg-icon :icon-class="onlyOne.meta.icon || (navInfo.meta && navInfo.meta.icon)" />
      <template #title><span class="menu-title" :title="hasTitle(onlyOne.meta.title)">{{ onlyOne.meta.title }}</span></template>
    </el-menu-item>
    </Link>
    <!-- -->
    <el-sub-menu v-else ref="subMenu" :index="handlePath(navInfo.path)" :teleported="true" expand-close-icon="CaretBottom" expand-open-icon="CaretTop" collapse-close-icon="CaretRight" collapse-open-icon="CaretLeft" popper-class="top-nav-vertical-menu">
      <template v-if="navInfo.meta" #title>
        <svg-icon :icon-class="navInfo.meta && navInfo.meta.icon" />
        <span class="menu-title" :title="hasTitle(navInfo.meta.title)">{{ navInfo.meta.title }}</span>
      </template>
      <nav-item v-for="(item, index) in navInfo.children" :key="index" :isNest="true" :navInfo="item" :basePath="handlePath(navInfo.path)" />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import Link from './link'
// 一、综合初始化
const props = defineProps({
  navInfo: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  },
  isTopPath: {
    type: Boolean,
    default: false
  },
})
const router = useRouter()
// 二、模块功能
// console.log('查navInfo', props.navInfo.meta?.title, props.navInfo)
//  1、导航子项判断
const onlyOne = ref({})
function judgeChild(children = [], parent) {
  const showChildren = children?.filter(item => !item.hidden) || []
  if (showChildren.length === 1) {
    onlyOne.value = showChildren[0]
    // console.log('查onlyOne.value ', onlyOne.value)
    return true
  }
  if (showChildren.length === 0) {
    onlyOne.value = { ...parent, noshowChildren: true }
    return true
  }
  return false
}
// 2、处理index路径
function handlePath(routePath, routeQuery) {
  if (isExternal(routePath)) { return routePath }
  if (isExternal(props.basePath)) { return props.basePath }
  let path = getNormalPath(props.basePath + '/' + routePath)
  if (routeQuery) {
    return { path: path, query: JSON.parse(routeQuery) }
  }
  // console.log('查indexPath', getNormalPath(path))
  return getNormalPath(path)
}
// 3、路径规范化处理
function getNormalPath(p) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  }
  let res = p.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}
// 4、标题处理
function hasTitle(title) {
  return title.length > 5 ? title : ''
}
// 5、跳转
function handleGo(navItem) {
  let path = handlePath(navItem.path, navItem.query)
  if (isExternal(path)) {
    window.open(path, '_blank', 'noopener,noreferrer') // 出于安全考虑，防止新页面获取原页面的引用。
  } else {
    router.push(path)
  }
}
</script>
