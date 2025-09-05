<template>
  <div class="top-bar-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleCloseContextMenu">
      <router-link v-for="(item, index) in visitedViews"
        :key="index"
        :class="['tags-view-item', item.path === route.path ? 'is-actived' : '']"
        :data-path="item.path"
        :to="{ path: item.path, query: item.query, }"
        @click.middle="handleMiddleClickTag(item)"
        @contextmenu.prevent="handleOpenContextMenu(item, $event)">
        <span class="tag-title"> {{ item.title }}</span>
        <c-icon v-if="!item.meta.affix" i="c-operate-close" button @click.prevent.stop="hanleCloseSelectedTag(item)"> </c-icon>
      </router-link>
    </scroll-pane>

    <ul v-show="isContextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="handleRefreshSelectedTag(selectedTag)">
        <c-icon class="operate-icon" i="c-operate-refresh"></c-icon>
        <span class="operate-text">刷新页面</span>
      </li>
      <li v-if="handleOperateShow('关闭当前')" @click="hanleCloseSelectedTag(selectedTag)">
        <c-icon class="operate-icon" i="c-operate-close"></c-icon>
        <span class="operate-text">关闭当前</span>
      </li>
      <li @click="handleCloseOtherTag">
        <c-icon class="operate-icon" i="c-operate-close"></c-icon>
        <span class="operate-text">关闭其他</span>
      </li>
      <li v-if="handleOperateShow('关闭左侧')" @click="handleCloseLeftTag">
        <c-icon class="operate-icon" i="c-operate-close"></c-icon>
        <span class="operate-text">关闭左侧</span>
      </li>
      <li v-if="handleOperateShow('关闭右侧')" @click="handleCloseRightTag">
        <c-icon class="operate-icon" i="c-operate-close"></c-icon>
        <span class="operate-text">关闭右侧</span>
      </li>
      <li @click="handleCloseAllTag(selectedTag)">
        <c-icon class="operate-icon" i="c-operate-close"></c-icon>
        <span class="operate-text">全部关闭</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import ScrollPane from './components/scroll-pane'
// store
import useStore from '@/store'
// 声明
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const { tagStore, menuStore } = useStore()
const routes = computed(() => menuStore.navRoutes)
const visitedViews = computed(() => tagStore.visitedViews)
// ^

// # 二、模块功能
// # 1、初始化
const selectedTag = ref({})
const scrollPaneRef = ref(null)
function init() {
  handleAffixTag()
  handleAddCurrentTag()
}
// # (1) 固定标签
const affixTag = ref([])
function handleAffixTag() {
  // 工具函数-筛选固定标签
  function filterAffixTags(targetRoutes) {
    let tags = []
    targetRoutes.forEach(item => {
      if (item.meta.affix) {
        tags.push(Object.assign({}, item, { path: item.meta.absolutePath, children: {}, fullPath: item.meta.absolutePath }))
      }
      if (item.children) {
        const tempTags = filterAffixTags(item.children)
        if (tempTags.length) { tags = [...tags, ...tempTags] }
      }
    })
    return tags
  }
  const res = filterAffixTags(routes.value)
  affixTag.value = res

  res.forEach(item => { tagStore.addView(item) })
}
// ^
// # (2) 添加当前标签
function handleAddCurrentTag() {
  if (route.name) {
    tagStore.addView(route)
  }
}
// ^
// ^
// # 2、右键菜单
// # (1) 右键菜单开关
const top = ref(0)
const left = ref(0)
const isContextMenuVisible = ref(false)
// # -A- 打开右键菜单
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
// ^
// # -B- 关闭右键菜单
function handleCloseContextMenu() {
  isContextMenuVisible.value = false
}
// ^
// ^
// # (2) 中键点击标签
function handleMiddleClickTag(tag) {
  !tag.meta.affix && hanleCloseSelectedTag(tag)
}
// ^
// # (3) 刷新选中标签
function handleRefreshSelectedTag(tag) {
  // 刷新当前页面
  if (tag === undefined) {
    const { path, query, matched } = router.currentRoute.value
    matched.forEach((m) => {
      if (m.components && m.components.default && m.components.default.name) {
        if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
          tag = { name: m.components.default.name, path, query }
        }
      }
    })
    refreshView(tag)
  }
  // 刷新选中页面
  else {
    refreshView(tag)
  }
  function refreshView(tag) {
    tagStore.deleteCachedView(tag)
    tag.meta?.link && tagStore.deleteIframeView(tag)
    router.replace({ path: '/redirect' + tag.path, query: tag.query })
  }
}
// ^
// # (4) 关闭选中标签
function hanleCloseSelectedTag(tag) {
  // 删除当前页面
  if (!tag) {
    tagStore.deleteView(router.currentRoute.value)
  }
  // 删除选中页面
  else {
    tagStore.deleteView(tag)
  }
  handleMoveToLastTag()
}
// ^
// # (5) 关闭左侧标签
function handleCloseLeftTag(tag) {
  tagStore.deleteLeftTags(tag || router.currentRoute.value)
  if (!tagStore.visitedViews.find(item => item.fullPath === route.fullPath)) { handleMoveToLastTag() }
}
// ^
// # (6) 关闭右侧标签
function handleCloseRightTag(tag) {
  tagStore.deleteRightTags(tag || router.currentRoute.value);
  if (!tagStore.visitedViews.find(item => item.fullPath === route.fullPath)) { handleMoveToLastTag() }
}
// ^
// # (7) 关闭其他标签
function handleCloseOtherTag(tag) {
  router.push(selectedTag.value).catch(() => { })
  tagStore.deleteOthersViews(tag || router.currentRoute.value)
  handleMoveToCurrentTag()
}
// ^
// # (8) 关闭全部标签
function handleCloseAllTag(tag) {
  tagStore.deleteAllViews()
  if (affixTag.value.some(tag => tag.path === route.path)) { return }
  handleMoveToLastTag()
}
// ^
// # (9) 工具函数 
// # -A- 视图跳转至最后标签
function handleMoveToCurrentTag() {
  nextTick(() => {
    visitedViews.value.forEach(item => {
      if (item.path === route.path) {
        scrollPaneRef.value.moveToTarget(item)
        if (item.fullPath !== route.fullPath) {
          tagStore.updateVisitedView(route)
        }
      }
    })
  })
}
// ^
// # -B- 视图跳转至最后标签
function handleMoveToLastTag() {
  const latestView = tagStore.visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    router.replace('/')
  }
}
// ^
// ^
// # (10) 操作显示
function handleOperateShow(type) {
  let flag = false
  switch (type) {
    case '关闭当前':
      flag = !selectedTag.value.meta?.affix
      break
    case '关闭左侧':
      flag = !(selectedTag.value.fullPath === visitedViews.value?.[0]?.fullPath)
      break
    case '关闭右侧':
      flag = !(selectedTag.value.fullPath === visitedViews.value?.[visitedViews.value.length - 1]?.fullPath)
      break
    default:
      break
  }
  return flag
}
// ^
// ^
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
  console.log('tagStore.visitedViews', tagStore.visitedViews,)
  console.log('tagStore.cachedViews', tagStore.cachedViews,)
  console.log('tagStore.iframeViews', tagStore.iframeViews,)
})
watch(route, () => {
  handleAddCurrentTag()
  handleMoveToCurrentTag()
})
watch(isContextMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', handleCloseContextMenu)
  } else {
    document.body.removeEventListener('click', handleCloseContextMenu)
  }
})
// ^

</script>

<style lang='scss' scoped>
.top-bar-container {

  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  :root[theme-style='dark'] & {
    background-color: var(--bg-card);
  }

  :root[theme-style='light'] & {
    background-color: var(--bg-card);
  }

  .tags-view-wrapper {
    height: 100%;

    :deep(.el-scrollbar__wrap) {
      height: 100%;

      .el-scrollbar__view {
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .tags-view-item {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 24px;
          margin-left: 10px;
          padding: 0 30px;
          cursor: pointer;
          border-radius: 3px;
          background-color: var(--bg-topTag);
          border: 1px solid var(--bcs);
          color: var(--fcs);
          font-size: 12px;
          text-decoration: none;

          &:first-of-type {
            margin-left: 15px;
          }

          &:last-of-type {
            margin-right: 15px;
          }

          &.is-actived {
            background-color: var(--tc);
            border-color: var(--tc);
            color: #fff;

            .tag-close {
              color: #fff;
            }
          }

          &:has(.tag-close) {
            padding: 0 30px 0 20px;
          }

          .tag-title {
            font-size: 12px;
          }

          .tag-close {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 1em;
            height: 1em;
            color: var(--fcs);

            &:hover {
              scale: 1.1;
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
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      display: flex;
      align-items: center;
      height: 30px;
      margin: 0;
      padding: 0 15px;
      font-size: 12px;
      cursor: pointer;

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
        // background-color: #b4bccc;
        scale: 1.1;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>