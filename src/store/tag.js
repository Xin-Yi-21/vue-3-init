const useTagStore = defineStore('tag', {
  state: () => ({
    visitedViews: [],   // 已访路由
    cachedViews: [],    // 缓存路由
    iframeViews: [],    // 链接路由
  }),
  actions: {
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
      this.addIframeView(view)
    },
    // 添加已访路由
    addVisitedView(view) {
      if (this.visitedViews.some(item => item.path === view.path)) return
      this.visitedViews.push(Object.assign({}, view, { title: view.meta.title || '' }))
    },
    // 添加缓存路由
    addCachedView(view) {
      if (view.meta?.cache || this.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) { this.cachedViews.push(view.name) }
    },
    // 添加链接路由
    addIframeView(view) {
      if (this.iframeViews.some(v => v.path === view.path)) return
      this.iframeViews.push(Object.assign({}, view, { title: view.meta.title || '' }))
    },
    // 删除路由
    delView(view) {
      return new Promise(resolve => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({ visitedViews: [...this.visitedViews], cachedViews: [...this.cachedViews] })
      })
    },
    // 删除访问路由
    delVisitedView(view) {
      return new Promise(resolve => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
        resolve([...this.visitedViews])
      })
    },
    // 删除链接路由
    delIframeView(view) {
      return new Promise(resolve => {
        this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
        resolve([...this.iframeViews])
      })
    },
    // 删除缓存路由
    delCachedView(view) {
      return new Promise(resolve => {
        const index = this.cachedViews.indexOf(view.name)
        index > -1 && this.cachedViews.splice(index, 1)
        resolve([...this.cachedViews])
      })
    },
    // 删除其他路由
    delOthersViews(view) {
      return new Promise(resolve => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    // 删除其他已访路由
    delOthersVisitedViews(view) {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(v => {
          return v.meta.affix || v.path === view.path
        })
        this.iframeViews = this.iframeViews.filter(item => item.path === view.path)
        resolve([...this.visitedViews])
      })
    },
    // 删除其他缓存路由
    delOthersCachedViews(view) {
      return new Promise(resolve => {
        const index = this.cachedViews.indexOf(view.name)
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1)
        } else {
          this.cachedViews = []
        }
        resolve([...this.cachedViews])
      })
    },
    // 删除全部路由
    delAllViews(view) {
      return new Promise(resolve => {
        this.delAllVisitedViews(view)
        this.delAllCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    // 删除全部已访路由
    delAllVisitedViews(view) {
      return new Promise(resolve => {
        const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
        this.visitedViews = affixTags
        this.iframeViews = []
        resolve([...this.visitedViews])
      })
    },
    // 删除全部缓存路由
    delAllCachedViews(view) {
      return new Promise(resolve => {
        this.cachedViews = []
        resolve([...this.cachedViews])
      })
    },
    // 更新已访路由
    updateVisitedView(view) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    // 删除右侧标签
    delRightTags(view) {
      return new Promise(resolve => {
        const index = this.visitedViews.findIndex(v => v.path === view.path)
        if (index === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, idx) => {
          if (idx <= index || (item.meta && item.meta.affix)) {
            return true
          }
          const i = this.cachedViews.indexOf(item.name)
          if (i > -1) {
            this.cachedViews.splice(i, 1)
          }
          if (item.meta.link) {
            const fi = this.iframeViews.findIndex(v => v.path === item.path)
            this.iframeViews.splice(fi, 1)
          }
          return false
        })
        resolve([...this.visitedViews])
      })
    },
    // 删除左侧标签
    delLeftTags(view) {
      return new Promise(resolve => {
        const index = this.visitedViews.findIndex(v => v.path === view.path)
        if (index === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((item, idx) => {
          if (idx >= index || (item.meta && item.meta.affix)) {
            return true
          }
          const i = this.cachedViews.indexOf(item.name)
          if (i > -1) {
            this.cachedViews.splice(i, 1)
          }
          if (item.meta.link) {
            const fi = this.iframeViews.findIndex(v => v.path === item.path)
            this.iframeViews.splice(fi, 1)
          }
          return false
        })
        resolve([...this.visitedViews])
      })
    }
  }
})

export default useTagStore
