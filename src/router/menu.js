import request from '@/api/request'

// 菜单属性详解
const eg = {
  name: 'FrameworkSystemManage',        // 路由名称
  path: '/system-manage',               // 路由路径
  component: 'ParentView',              // 路由渲染组件：Layout、ParentView、InnerLink、、NormalView
  hidden: false,                        // 路由是否在菜单显示
  alwaysShow: true,                     // 路由是否在唯一子路由时显示
  redirect: '/system-manage/user',      // 路由重定向路径
  meta: {                               // 路由元信息
    title: '系统管理',                   // 路由标题
    icon: 'c-menu-manage',              // 路由图标

    cache: false,                       // 路由是否缓存，默认false
    affix: false,                       // 路由是否固定，默认false

    link: null,                         // 路由链接地址，默认null
    linkBlank: false,                   // 路由链接是否新浏览器标签页打开，默认false
    linkVirtual: false,                 // 路由链接是否虚拟，默认false

    clickIn: false,                     // 路由是否点入，默认false
    hideIn: [],                         // 路由隐藏区域，默认[],值有'top'和'left'。
    class: [],                          // 路由样式类名,
  },
  children: [],                         // 路由子项
}



// 获取路由
export const menuGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const routes = [
        // 外网链接
        {
          name: 'Website',
          path: '/website',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: 'noRedirect',
          meta: { title: '参考网址', icon: 'c-website', noCache: false, link: null, showIn: ['top', 'left'], },
          children: [
            {
              name: 'ElementPlus',
              path: 'element-plus',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'Element Plus', icon: 'c-element', noCache: false, link: 'https://element-plus.org/zh-CN/', linkBlank: false, linkVirtual: false, showIn: ['left',], }
            },

            {
              name: 'ECharts',
              path: 'echarts',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'ECharts', icon: 'c-echarts', noCache: false, link: 'https://echarts.apache.org/zh/index.html', linkBlank: true, linkVirtual: false, showIn: ['left',], }
            },
            {
              name: 'AntDesign',
              path: 'ant-design',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'AntDesign', icon: 'c-iconfont', noCache: false, link: 'https://www.antdv.com/components/overview-cn', linkBlank: false, linkVirtual: true, linkOpenType: 'self', showIn: ['left',], }
            },
            {
              name: 'Iconfont',
              path: 'iconfont',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'Iconfont', icon: 'c-echarts', noCache: false, link: 'https://www.iconfont.cn/', linkBlank: true, linkVirtual: true, showIn: ['left',], }
            },
          ]
        },
        // 基础框架
        {
          name: 'Framework',
          path: '/framework',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: '/framework/template-manage/element',
          meta: { title: '基础框架', icon: 'c-menu-framework', noCache: false, link: null, showIn: ['top', 'left'], },
          children: [
            {
              name: 'FrameworkTemplateManage',
              path: 'template-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/template-manage/element',
              meta: { title: '模版管理', icon: 'c-menu-template', noCache: false, link: null, showIn: ['top', 'left'], clickIn: false },
              children: [
                {
                  name: 'FrameworkElementTemplate',
                  path: 'element',
                  component: 'framework/template-manage/element/index',
                  hidden: false,
                  meta: { title: 'element 模板', icon: 'c-menu-element', noCache: false, link: null, showIn: ['left'], }
                },
                {
                  name: 'FrameworkEchartsTemplate',
                  path: 'echarts',
                  component: 'framework/template-manage/echarts/index',
                  hidden: false,
                  meta: { title: 'echarts 模板', icon: 'c-menu-echarts', noCache: false, link: null, showIn: ['left'], }
                },
                {
                  name: 'FrameworkMapTemplate',
                  path: 'map',
                  component: 'framework/template-manage/map/index',
                  hidden: false,
                  meta: { title: 'map 模版', icon: 'c-menu-map', noCache: false, link: null, showIn: ['left'], }
                },
              ]
            },
            {
              name: 'FrameworkSystemManage',
              path: 'system-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/system-manage/user',
              meta: { title: '系统管理', icon: 'c-menu-manage', noCache: false, link: null, showIn: ['top', 'left'], },
              children: [
                {
                  name: 'FrameworkUser',
                  path: 'user',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '用户管理', icon: 'c-menu-user', noCache: false, link: null, showIn: ['left'], },
                },
                {
                  name: 'FrameworkRole',
                  path: 'role',
                  component: 'framework/system-manage/role/index',
                  hidden: false,
                  meta: { title: '角色管理', icon: 'c-menu-role', noCache: false, link: null, showIn: ['left'], }
                },
                {
                  name: 'FrameworkPermission',
                  path: 'permission',
                  component: 'framework/system-manage/permission/index',
                  hidden: false,
                  meta: { title: '权限管理', icon: 'c-menu-permission', noCache: false, link: null, showIn: ['left'], }
                },
              ]
            },
            {
              name: 'Framework1',
              path: '/framework1',
              hidden: false,
              alwaysShow: true,
              meta: {
                title: '临时1', icon: 'c-framework', noCache: false, link: null, showIn: ['top', 'left'],
              },
            }
          ]
        },
      ]
      resolve({ code: 200, data: routes, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}
