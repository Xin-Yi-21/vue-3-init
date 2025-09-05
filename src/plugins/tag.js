import useTagStore from '@/store/tag'
import router from '@/router'

export default {
  // 刷新当前tab页签
  refreshPage(tag) {
    const { path, query, matched } = router.currentRoute.value
    if (tag === undefined) {
      matched.forEach((m) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
            tag = { name: m.components.default.name, path, query }
          }
        }
      })
    }
    const tagStore = useTagStore()
    if (tag.meta?.link) { tagStore.delIframeView }
    tagStore.delCachedView(tag)
    router.replace({ path: '/redirect' + tag.path, query: tag.query })
  },
  // 关闭当前tab页签，打开新页签
  closeOpenPage(obj) {
    useTagStore().delView(router.currentRoute.value)
    if (obj !== undefined) {
      return router.push(obj);
    }
  },
  // 关闭指定tab页签
  closePage(view) {
    const tagStore = useTagStore()
    if (!view) {
      tagStore.delView(router.currentRoute.value)
      const latestView = tagStore.visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        router.push('/')
      }
      return
    }
    // 传了 view，就删掉这个标签
    tagStore.delView(view)
  },
  // 关闭所有tab页签
  closeAllPage() {
    return useTagStore().delAllViews();
  },
  // 关闭左侧tab页签
  closeLeftPage(obj) {
    return useTagStore().delLeftTags(obj || router.currentRoute.value);
  },
  // 关闭右侧tab页签
  closeRightPage(obj) {
    return useTagStore().delRightTags(obj || router.currentRoute.value);
  },
  // 关闭其他tab页签
  closeOtherPage(obj) {
    return useTagStore().delOthersViews(obj || router.currentRoute.value);
  },
  // 打开tab页签
  openPage(url) {
    return router.push(url);
  },
  // 修改tab页签
  updatePage(obj) {
    return useTagStore().updateVisitedView(obj);
  }
}
