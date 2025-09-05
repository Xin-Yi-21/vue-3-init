import { defineStore } from 'pinia'

const useTagStore = defineStore('tag', {
  state: () => ({
    visitedViews: [],   // 已访路由
    cachedViews: [],    // 缓存路由
    iframeViews: [],    // 链接路由
  }),

  actions: {
    // 1、添加路由页面
    // (1) 添加路由页面
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
      this.addIframeView(view)
    },
    // (2) 添加已访路由页面
    addVisitedView(view) {
      if (this.visitedViews.some(item => item.path === view.path)) return
      this.visitedViews.push({
        ...view,
        title: view.meta.title || ''
      })
    },
    // (3) 添加缓存路由页面
    addCachedView(view) {
      if (view.meta?.cache || this.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) this.cachedViews.push(view.name)
    },
    // (4) 添加链接路由页面
    addIframeView(view) {
      if (this.iframeViews.some(item => item.path === view.path)) return
      this.iframeViews.push({
        ...view,
        title: view.meta.title || ''
      })
    },

    // 2、删除路由页面
    // (1) 删除路由页面
    deleteView(view) {
      this.deleteVisitedView(view)
      this.deleteCachedView(view)
      this.deleteIframeView(view)
    },
    // (2) 删除访问路由页面
    deleteVisitedView(view) {
      this.visitedViews = this.visitedViews.filter(item => item.path !== view.path)
    },
    // (3) 删除缓存路由页面
    deleteCachedView(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) this.cachedViews.splice(index, 1)
    },
    // (4) 删除链接路由页面
    deleteIframeView(view) {
      this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
    },
    // (5) 删除其他路由页面
    deleteOtherViews(view) {
      // 访问
      this.visitedViews = this.visitedViews.filter(item => item.meta.affix || item.path === view.path)
      // 缓存
      const index = this.cachedViews.indexOf(view.name)
      this.cachedViews = index > -1 ? this.cachedViews.slice(index, index + 1) : []
      // 链接
      this.iframeViews = this.iframeViews.filter(item => item.meta.affix || item.path === view.path)
    },
    // (6) 删除全部路由页面
    deleteAllViews() {
      const affixTags = this.visitedViews.filter(item => item.meta.affix)
      // 访问
      this.visitedViews = affixTags
      // 缓存
      this.cachedViews = []
      // 链接
      this.iframeViews == affixTags
    },
    // (7) 删除左侧标签
    deleteLeftTags(view) {
      const matchIndex = this.visitedViews.findIndex(item => item.path === view.path)
      if (matchIndex === -1) return
      this.visitedViews = this.visitedViews.filter((item, index) => {
        if (matchIndex <= index || item.meta?.affix) return true
        this.deleteCachedView(item)
        this.deleteIframeView(item)
        return false
      })
    },
    // (8) 删除右侧标签
    deleteRightTags(view) {
      const matchIndex = this.visitedViews.findIndex(item => item.path === view.path)
      if (matchIndex === -1) return
      this.visitedViews = this.visitedViews.filter((item, index) => {
        if (matchIndex >= index || item.meta?.affix) return true
        this.deleteCachedView(item)
        this.deleteIframeView(item)
        return false
      })
    },

    // 3、更新已访路由
    updateVisitedView(view) {
      const matchIndex = this.visitedViews.findIndex(item => item.path === view.path)
      if (matchIndex > -1) {
        this.visitedViews[matchIndex] = { ...this.visitedViews[matchIndex], ...view }
      }
    },
  }
})

export default useTagStore
