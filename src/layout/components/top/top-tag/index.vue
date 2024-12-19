<template>
  <div class="top-tag-vue">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleCloseContextMenu">
      <router-link v-for="(tag, index) in visitedViews" :key="index" :class="['tags-view-item', isActive(tag) ? 'active' : '']" :style="activeStyle(tag)"
        :dataPath="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        @click.middle="handleMiddleClickTag(tag)"
        @contextmenu.prevent="handleOpenContextMenu(tag, $event)">
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="el-icon-close" style="width: 1em; height: 1em;vertical-align: middle;" />
        </span>
      </router-link>
    </scroll-pane>

    <ul v-show="isContextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <refresh-right style="width: 1em; height: 1em;" /> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <close style="width: 1em; height: 1em;" /> 关闭当前
      </li>
      <li @click="closeOthersTags">
        <circle-close style="width: 1em; height: 1em;" /> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <back style="width: 1em; height: 1em;" /> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <right style="width: 1em; height: 1em;" /> 关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <circle-close style="width: 1em; height: 1em;" /> 全部关闭
      </li>
    </ul>
  </div>
</template>

<script setup>
import ScrollPane from './components/scroll-pane'
import { getNormalPath } from '@/utils/ruoyi'
import useTagStore from '@/store/system/tag'
import useSettingStore from '@/store/system/setting'
import useMenuStore from '@/store/system/menu'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const routes = computed(() => useMenuStore().routes)
const theme = computed(() => useSettingStore().themeColor)
const visitedViews = computed(() => useTagStore().visitedViews)

const selectedTag = ref({})
const affixTags = ref([])
const scrollPaneRef = ref(null)
// 一、初始化相关
// 监听路由
watch(route, () => {
  addTags()            // 添加当前路由标签
  moveToCurrentTag()   // 高亮当前路由标签
})
// 监听右键菜单
const isContextMenuVisible = ref(false)
const top = ref(0)
const left = ref(0)
watch(isContextMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', handleCloseContextMenu)
  } else {
    document.body.removeEventListener('click', handleCloseContextMenu)
  }
})
// dom加载
onMounted(() => {
  initTags()   // 初始化固定标签
  addTags()    // 添加当前路由标签
})
// 固定标签
function initTags() {
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  res.forEach(item => { item.name && useTagStore().addVisitedView(item) })
}
// 工具函数-筛选固定标签
function filterAffixTags(routes, basePath = '') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({ path: tagPath, fullPath: tagPath, name: route.name, meta: { ...route.meta } })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
// 添加当前路由标签
function addTags() {
  if (route.name) {
    useTagStore().addView(route)
    route.meta.link && useTagStore().addIframeView(route)
  }
  return false
}
// 视图移动至当前标签
function moveToCurrentTag() {
  nextTick(() => {
    visitedViews.value.forEach(item => {
      if (item.path === route.path) {
        scrollPaneRef.value.moveToTarget(item)
        // 用户当前标签进行操作或导航导致不同，更新访问记录为当前
        if (item.fullPath !== route.fullPath) {
          useTagStore().updateVisitedView(route)
        }
      }
    })
  })
}
// 视图跳转至最后标签
function moveToLastTag(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Home') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

// 二、操作类
// 打开右键菜单
function handleOpenContextMenu(tag, e) {
  const menuMinWidth = 105
  const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  // const l = e.clientX - offsetLeft + 15 // 15: margin right
  const l = e.clientX // 15: margin right
  // console.log('查宽度', e.clientX, offsetLeft, offsetWidth, l)

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY + 18
  isContextMenuVisible.value = true
  selectedTag.value = tag
}
// 关闭右键菜单
function handleCloseContextMenu() {
  isContextMenuVisible.value = false
}
// 中键点击标签
function handleMiddleClickTag(tag) {
  !isAffix(tag) && closeSelectedTag(tag)
}
// 刷新选中标签
function refreshSelectedTag(view) {
  proxy.$tag.refreshPage(view)
  if (route.meta.link) {
    useTagStore().delIframeView(route)
  }
}
// 关闭选中标签
function closeSelectedTag(view) {
  proxy.$tag.closePage(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      moveToLastTag(visitedViews, view)
    }
  })
}
// 关闭左侧标签
function closeLeftTags() {
  proxy.$tag.closeLeftPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) { moveToLastTag(visitedViews) }
  })
}
// 关闭右侧标签
function closeRightTags() {
  proxy.$tag.closeRightPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) { moveToLastTag(visitedViews) }
  })
}
// 关闭其他标签
function closeOthersTags() {
  router.push(selectedTag.value).catch(() => { });
  proxy.$tag.closeOtherPage(selectedTag.value).then(() => { moveToCurrentTag() })
}
// 关闭全部标签
function closeAllTags(view) {
  proxy.$tag.closeAllPage().then(({ visitedViews }) => {
    if (affixTags.value.some(tag => tag.path === route.path)) { return }
    moveToLastTag(visitedViews, view)
  })
}
// X、判断类
// 判断是否激活项
function isActive(rowItem) {
  return rowItem.path === route.path
}
// 激活项样式设置
function activeStyle(tag) {
  if (!isActive(tag)) return {}
  return {
    "background-color": theme.value,
    "border-color": theme.value
  }
}
// 判断是否不是
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}
// 判断是否首标签
function isFirstView() {
  try {
    return selectedTag.value.fullPath === '/index' || selectedTag.value.fullPath === visitedViews.value[1].fullPath
  } catch (err) {
    return false
  }
}
// 判断是否末标签
function isLastView() {
  try {
    return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
</script>

<style lang='scss' scoped>
.top-tag-vue {
  height: 34px;
  width: 100%;
  background: var(--bg-topTag);
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>