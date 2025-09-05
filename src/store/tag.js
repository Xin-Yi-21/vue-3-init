import { defineStore } from 'pinia'

const useTagStore = defineStore('tag', {
  state: () => ({
    visitedViews: [],   // 已访路由
    cachedViews: [],    // 缓存路由
    iframeViews: [],    // 链接路由
  }),

  actions: {
    // 1、添加路由
    // (1) 添加路由
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
      this.addIframeView(view)
    },
    // (2) 添加已访路由
    addVisitedView(view) {
      if (this.visitedViews.some(item => item.path === view.path)) return
      this.visitedViews.push({
        ...view,
        title: view.meta.title || ''
      })
    },
    // (3) 添加缓存路由
    addCachedView(view) {
      if (view.meta?.cache || this.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) this.cachedViews.push(view.name)
    },
    // (4) 添加链接路由
    addIframeView(view) {
      if (this.iframeViews.some(item => item.path === view.path)) return
      this.iframeViews.push({
        ...view,
        title: view.meta.title || ''
      })
    },



    // 删除路由
    deleteView(view) {
      this.deleteVisitedView(view)
      this.deleteCachedView(view)
    },

    // 删除访问路由
    deleteVisitedView(view) {
      this.visitedViews = this.visitedViews.filter(item => item.path !== view.path)
      this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
    },

    // 删除链接路由
    deleteIframeView(view) {
      this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
    },

    // 删除缓存路由
    deleteCachedView(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) this.cachedViews.splice(index, 1)
    },

    // 删除其他路由
    deleteOthersViews(view) {
      this.deleteOthersVisitedViews(view)
      this.deleteOthersCachedViews(view)
    },

    deleteOthersVisitedViews(view) {
      this.visitedViews = this.visitedViews.filter(item => item.meta.affix || item.path === view.path)
      this.iframeViews = this.iframeViews.filter(item => item.path === view.path)
    },

    deleteOthersCachedViews(view) {
      const index = this.cachedViews.indexOf(view.name)
      this.cachedViews = index > -1 ? this.cachedViews.slice(index, index + 1) : []
    },

    // 删除全部路由
    deleteAllViews() {
      this.deleteAllVisitedViews()
      this.deleteAllCachedViews()
    },

    deleteAllVisitedViews() {
      const affixTags = this.visitedViews.filter(item => item.meta.affix)
      this.visitedViews = affixTags
      this.iframeViews = []
    },

    deleteAllCachedViews() {
      this.cachedViews = []
    },

    // 更新已访路由
    updateVisitedView(view) {
      const idx = this.visitedViews.findIndex(item => item.path === view.path)
      if (idx > -1) {
        this.visitedViews[idx] = { ...this.visitedViews[idx], ...view }
      }
    },

    // 删除右侧标签
    deleteRightTags(view) {
      const index = this.visitedViews.findIndex(item => item.path === view.path)
      if (index === -1) return

      this.visitedViews = this.visitedViews.filter((item, idx) => {
        if (idx <= index || item.meta?.affix) return true
        this.deleteCachedView(item)
        if (item.meta.link) this.deleteIframeView(item)
        return false
      })
    },

    // 删除左侧标签
    deleteLeftTags(view) {
      const index = this.visitedViews.findIndex(item => item.path === view.path)
      if (index === -1) return

      this.visitedViews = this.visitedViews.filter((item, idx) => {
        if (idx >= index || item.meta?.affix) return true
        this.deleteCachedView(item)
        if (item.meta.link) this.deleteIframeView(item)
        return false
      })
    }
  }
})

export default useTagStore
