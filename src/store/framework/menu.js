import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { menuGet } from '@/router/menu.js'
import Layout from '@/layout/index'
import ParentView from '@/components/system/parent-view'
import InnerLink from '@/components/system/inner-link'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const useMenuStore = defineStore('menu', {
  state: () => ({
    allRoutes: [],
    addRoutes: [],
    currentTopMenu: {},
  }),
  actions: {
    // 设置 新访问路由
    setAddRoutes(routes) {
      this.addRoutes = routes
    },
    // 设置 结构路由
    setAllRoutes(routes) {
      this.allRoutes = routes
    },
    // 设置 导航路由
    setNavRoutes(routes) {
      this.navRoutes = routes
    },
    // 设置顶部当前选中
    setCurrentTopMenu(topMenu) {
      this.currentTopMenu = topMenu
    },
    // 生成路由
    generateRoutes(userInfo) {
      const { permission = [], role = [] } = userInfo
      return new Promise(resolve => {
        menuGet().then(res => {
          // 💡路由变量介绍：
          // constantRoutes：前端常量路由，前端router的index.js文件配置
          // dynamicRoutes：前端动态路由，前端router的index.js文件配置
          // backendRoutes：后端接口路由，

          // dynamicFilterRoutes：前端权限过滤后的动态路由
          // backendFilterRoutes：后端权限过滤后的接口路由

          // addRoutes（新访问路由）= dynamicFilterRoutes（前端权限过滤后的动态路由） + backendFilterRoutes（后端权限过滤后的接口路由）
          // addFlattenRoutes（扁平化新访问路由）= addRoutes 扁平化处理

          // allRoutes（全部路由） = constantRoutes（前端常量路由） + addRoutes（新访问路由）
          // navRoutes（导航路由）=  全部路由筛选的导航菜单部分
          // 🤘

          // 1、前端权限过滤后的动态路由
          let dynamicFilterRoutes = handleFilterRoutes(dynamicRoutes)
          // 2、后端接口路由 + 后端权限过滤后的接口路由
          let resData = JSON.parse(JSON.stringify(res.data))
          let backendRoutes = handleAdjustRoutes(resData)
          let backendFilterRoutes = handleFilterRoutes(backendRoutes)
          // 3、新访问路由
          let addRoutes = [...dynamicFilterRoutes, ...backendFilterRoutes]
          let addFlattenRoutes = handleFlattenRoutes(addRoutes)
          this.setAddRoutes(addRoutes)
          // 4、全部路由
          let allRoutes = handleCompleteRoutes([...constantRoutes, ...dynamicFilterRoutes, ...backendFilterRoutes])
          this.setAllRoutes(allRoutes)
          // 5、导航路由
          let navRoutes = allRoutes.filter(item => !item.hidden)
          this.setNavRoutes(navRoutes)

          // console.log('dynamicRoutes（前端动态路由）', dynamicRoutes)
          // console.log('dynamicFilterRoutes（前端权限过滤后的动态路由）', dynamicFilterRoutes)
          // console.log('backendRoutes（后端接口路由）', backendRoutes)
          // console.log('backendFilterRoutes（后端权限过滤后的接口路由）', backendFilterRoutes)
          // console.log('addRoutes（新访问路由）', addRoutes)
          // console.log('addFlattenRoutes（扁平化新访问路由）', addFlattenRoutes)
          // console.log('allRoutes（全部路由）', allRoutes)
          // console.log('navRoutes（导航路由）', navRoutes)

          resolve(addRoutes)
        })
      })
    }
  }
})

// 路由权限过滤
export function handleFilterRoutes(routes, isAllowNoPR = true) {
  const res = []
  // 辅助函数
  function checkRouteAccess(route, isAllowNoPR = true) {
    if (route.permissions) {
      return auth.hasPermiOr(route.permissions)
    }
    if (route.roles) {
      return auth.hasRoleOr(route.roles)
    }
    return isAllowNoPR === true
  }
  routes.forEach(route => {
    const newRoute = { ...route }
    // 先处理 children
    if (Array.isArray(newRoute.children) && newRoute.children.length) {
      newRoute.children = handleFilterRoutes(newRoute.children, isAllowNoPR)
    }
    // 是否允许这个路由
    const hasPermission = checkRouteAccess(newRoute, isAllowNoPR)
    // 是否有子路由被允许
    const hasChild = Array.isArray(newRoute.children) && newRoute.children.length
    if (hasPermission || hasChild) {
      res.push(newRoute)
    }
  })
  return res
}
// 路由调整
export function handleAdjustRoutes(routes) {
  const res = []
  routes.forEach(route => {
    const newRoute = { ...route }
    // 组件转换
    if (newRoute.component) {
      if (newRoute.component === 'Layout') {
        newRoute.component = Layout
      } else if (newRoute.component === 'ParentView') {
        newRoute.component = ParentView
      } else if (newRoute.component === 'InnerLink') {
        newRoute.component = InnerLink
      } else {
        newRoute.component = loadView(newRoute.component)
      }
    }
    // 子路由处理
    if (Array.isArray(newRoute.children) && newRoute.children.length) {
      newRoute.children = handleAdjustRoutes(newRoute.children)
    } else {
      delete newRoute['children']
      delete newRoute['redirect']
    }
    res.push(newRoute)
  })
  return res
}
// 路由扁平化
export function handleFlattenRoutes(routes, parentPath = '') {
  const res = []

  routes.forEach(route => {
    const newRoute = { ...route }

    // 拼接完整 path
    if (parentPath && !newRoute.path.startsWith('/')) {
      newRoute.path = `${parentPath}/${newRoute.path}`.replace(/\/+/g, '/')
    }

    // 如果是 ParentView 类型，扁平化其 children
    if (newRoute.component === ParentView && Array.isArray(newRoute.children) && newRoute.children.length) {
      const children = handleFlattenRoutes(newRoute.children, newRoute.path)
      res.push(...children)
    } else {
      // 正常保留节点
      if (Array.isArray(newRoute.children) && newRoute.children.length) {
        newRoute.children = handleFlattenRoutes(newRoute.children, newRoute.path)
      }
      res.push(newRoute)
    }
  })

  return res
}
// 路由信息完善
export function handleCompleteRoutes(routes, parentMeta = {}) {
  const { fullPath: parentFullPath = '', pathArr: parentPathArr = [], titleArr: parentTitleArr = [] } = parentMeta
  const res = []
  routes.forEach(route => {
    const newRoute = { ...route }
    newRoute.meta = { ...(newRoute.meta || {}) }

    // 当前path
    const currentPath = newRoute.path
    // 当前pathArr
    const currentPathArr = [...parentPathArr, currentPath]
    // 当前fullPath
    let currentFullPath
    if (currentPath.startsWith('/')) {
      currentFullPath = currentPath
    } else {
      const raw = parentFullPath ? `${parentFullPath}/${currentPath}` : currentPath
      currentFullPath = raw.replace(/\/+/g, '/')
    }

    // 当前title
    const currentTitle = newRoute.meta.title || ''
    // 当前titleArr
    const currentTitleArr = [...parentTitleArr, currentTitle].filter(item => item !== '')
    // 当前fullTitle
    const currentFullTitle = currentTitleArr.join(' - ')

    // 挂载到 meta
    Object.assign(newRoute.meta, { pathArr: currentPathArr, titleArr: currentTitleArr, fullPath: currentFullPath, fullTitle: currentFullTitle, })

    // 递归处理子路由
    if (Array.isArray(newRoute.children) && newRoute.children.length) {
      newRoute.children = handleCompleteRoutes(newRoute.children, newRoute.meta)
    }
    res.push(newRoute)
  })

  return res
}
// 处理后台路由component
export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default useMenuStore
