<template>
  <div class="top-tag-container">
    <scroll-pane ref="scrollPaneRef" class="top-tag-scroll-pane" @scroll="handleCloseContextMenu">
      <router-link v-for="(item, index) in visitedViews"
        :key="index"
        :class="['tag-view-item', item.path === route.path ? 'is-actived' : '', item.meta?.affix ? 'is-affix' : '']"
        :data-path="item.path"
        :to="{ path: item.path, query: item.query, }"
        @click.middle="handleMiddleClickTag(item)"
        @contextmenu.prevent="handleOpenContextMenu(item, $event)">
        <span class="tag-title"> {{ item.title }}</span>
        <c-icon v-if="!item.meta?.affix" i="c-operate-close" button @click.prevent.stop="hanleCloseSelectedTag(item)"> </c-icon>
      </router-link>
    </scroll-pane>

    <c-icon i="c-operate-add" class="add-tag-icon" button tip="新增标签页" :hoverColor="settingStore.themeColor" showType="el"> </c-icon>

    <ul v-show="isContextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="handleRefreshSelectedTag(selectedTag)"><c-icon i="c-operate-refresh"></c-icon>刷新页面</li>
      <li v-if="handleOperateShow('关闭当前')" @click="hanleCloseSelectedTag(selectedTag)"><c-icon i="c-operate-close"></c-icon>关闭当前</li>
      <li @click="handleCloseOtherTag(selectedTag)"> <c-icon i="c-operate-close"></c-icon>关闭其他</li>
      <li v-if="handleOperateShow('关闭左侧')" @click="handleCloseLeftTag(selectedTag)"> <c-icon i="c-operate-close"></c-icon>关闭左侧</li>
      <li v-if="handleOperateShow('关闭右侧')" @click="handleCloseRightTag(selectedTag)"> <c-icon i="c-operate-close"></c-icon>关闭右侧</li>
      <li @click="handleCloseAllTag(selectedTag)"><c-icon i="c-operate-close"></c-icon>关闭全部</li>
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
const { tagStore, menuStore, settingStore } = useStore()
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
  if (!tagStore.visitedViews.find(item => item.path === route.path)) { handleMoveToLastTag() }
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
  tagStore.deleteOtherViews(tag || router.currentRoute.value)
  if (!tagStore.visitedViews.find(item => item.fullPath === route.fullPath)) { handleMoveToLastTag() }
}
// ^
// # (8) 关闭全部标签
function handleCloseAllTag() {
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
.top-tag-container {
  flex: 1;
  height: 24px;
  display: flex;
  align-items: center;

  .top-tag-scroll-pane {
    height: 100%;
    width: auto;

    :deep(.el-scrollbar__wrap) {

      height: 100%;

      .el-scrollbar__view {
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .tag-view-item {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 100%;
          margin-right: 10px;
          padding: 0 30px 0 20px;
          border-radius: 4px 4px 0 0;
          background-color: var(--bg-card);
          color: var(--fcs);
          font-size: 12px;
          text-decoration: none;
          cursor: pointer;

          &:first-of-type {
            margin-left: 0px;
          }

          &:last-of-type {
            margin-right: 10px;
          }

          &.is-affix {
            padding: 0 20px;
          }

          .c-operate-close {
            font-size: 12px;
            padding: 2px;
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--fcs);
            margin: 0;

            &:hover {
              background-color: var(--tc-light-4);
              border-radius: 50%;
            }
          }

          &.is-actived {
            background-color: var(--tc);
            border-color: var(--tc);
            color: #fff;

            .c-operate-close {
              color: #fff;
            }
          }






        }
      }
    }
  }

  :deep(.add-tag-icon) {
    font-size: 14px;
    color: var(--fcs);

    &:hover {
      color: var(--tc);
    }
  }

  .contextmenu {
    position: absolute;
    margin: 0;
    padding: 5px 0;
    border-radius: 4px;
    background: var(--bg-inner-primary);
    z-index: 3000;
    list-style-type: none;
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

      .c-icon {
        font-size: 10px;
        margin: 0 5px 0 0;
        transform: translateY(1px);
      }


      &:hover {
        background: var(--bg-hover);
        color: var(--tc);
      }
    }
  }
}
</style>