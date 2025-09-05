import request from '@/api/request'

// 菜单属性详解
const eg = {
  name: 'FrameworkSystemManage',        // 路由名称
  path: '/system-manage',               // 路由路径
  component: 'LinkView',                // 路由渲染组件：Layout、ParentView、LinkView、NormalView
  hidden: false,                        // 路由是否菜单隐藏，默认false
  alwaysShow: true,                     // 路由是否在唯一子路由时显示，默认true
  redirect: '/system-manage/user',      // 路由重定向路径
  meta: {                               // 路由元信息
    title: '系统管理',                   // 路由标题
    icon: 'c-menu-manage',              // 路由图标

    cache: false,                       // 路由是否缓存，默认false
    affix: false,                       // 路由是否固定，默认false

    link: null,                         // 路由链接地址，默认null
    linkBlank: false,                   // 路由链接是否新浏览器标签页打开，默认false
    linkVirtual: false,                 // 路由链接组件是否虚拟，默认false

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
          meta: { title: '参考网址', icon: 'c-website', hideIn: [], },
          children: [
            {
              name: 'ElementPlus',
              path: 'element-plus',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'Element Plus', icon: 'c-element', link: 'https://element-plus.org/zh-CN/', linkBlank: false, linkVirtual: false, hideIn: ['top',], }
            },

            {
              name: 'ECharts',
              path: 'echarts',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'ECharts', icon: 'c-echarts', link: 'https://echarts.apache.org/zh/index.html', linkBlank: true, linkVirtual: false, hideIn: ['top',], }
            },
            {
              name: 'AntDesign',
              path: 'ant-design',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'AntDesign', icon: 'c-iconfont', link: 'https://www.antdv.com/components/overview-cn', linkBlank: false, linkVirtual: true, linkOpenType: 'self', hideIn: ['top',], }
            },
            {
              name: 'Iconfont',
              path: 'iconfont',
              component: 'LinkView',
              hidden: false,
              meta: { title: 'Iconfont', icon: 'c-echarts', link: 'https://www.iconfont.cn/', linkBlank: true, linkVirtual: true, hideIn: ['top',], }
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
          meta: { title: '基础框架', icon: 'c-menu-framework', hideIn: [], },
          children: [
            {
              name: 'FrameworkTemplateManage',
              path: 'template-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/template-manage/element',
              meta: { title: '模版管理', icon: 'c-menu-template', hideIn: [], clickIn: false },
              children: [
                {
                  name: 'FrameworkElementTemplate',
                  path: 'element',
                  component: 'framework/template-manage/element/index',
                  hidden: false,
                  meta: { title: 'element 模板', icon: 'c-menu-element', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkEchartsTemplate',
                  path: 'echarts',
                  component: 'framework/template-manage/echarts/index',
                  hidden: false,
                  meta: { title: 'echarts 模板', icon: 'c-menu-echarts', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkMapTemplate',
                  path: 'map',
                  component: 'framework/template-manage/map/index',
                  hidden: false,
                  meta: { title: 'map 模版', icon: 'c-menu-map', hideIn: ['top'], }
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
              meta: { title: '系统管理', icon: 'c-menu-manage', hideIn: [], },
              children: [
                {
                  name: 'FrameworkDepartmentManage',
                  path: 'department',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '登录系统', icon: 'c-menu-department', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkDepartmentManage',
                  path: 'department',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '部门管理', icon: 'c-menu-department', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkUserManage',
                  path: 'user',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '用户管理', icon: 'c-menu-user', hideIn: ['top'], },
                },
                {
                  name: 'FrameworkRoleManage',
                  path: 'role',
                  component: 'framework/system-manage/role/index',
                  hidden: false,
                  meta: { title: '角色管理', icon: 'c-menu-role', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkPermissionManage',
                  path: 'permission',
                  component: 'framework/system-manage/permission/index',
                  hidden: false,
                  meta: { title: '权限管理', icon: 'c-menu-permission', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkPermissionManage',
                  path: 'permission',
                  component: 'framework/system-manage/permission/index',
                  hidden: false,
                  meta: { title: '文件管理', icon: 'c-menu-permission', hideIn: ['top'], }
                },
              ]
            },
            {
              name: 'FrameworkAdaptation',
              path: '/adaptaion-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              meta: { title: '适配管理', icon: 'c-menu-adaptaion', hideIn: [], },
              children: [
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '常规适配', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '大屏适配', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '响应适配', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '移动适配', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '显示隐藏', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
              ],
            },
            {
              name: 'FrameworkAdaptation',
              path: '/adaptaion-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              meta: { title: '文档管理', icon: 'c-menu-adaptaion', hideIn: [], },
              children: [
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '前端规范', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '前端支持', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '多方协同', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
              ],
            },
            {
              name: 'FrameworkAdaptation',
              path: '/adaptaion-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              meta: { title: '布局管理', icon: 'c-menu-adaptaion', hideIn: [], },
              children: [
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '常规布局', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '菜单标签', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '主题样式', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
              ],
            },
            {
              name: 'FrameworkAdaptation',
              path: '/adaptaion-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              meta: { title: '工具管理', icon: 'c-menu-adaptaion', hideIn: [], },
              children: [
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '组件', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '插件', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '指令', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
                {
                  name: 'FrameworkBigScreen',
                  path: 'big-screen',
                  component: 'framework//permission/index',
                  hidden: false,
                  meta: { title: '函数', icon: 'c-menu-big-screen', hideIn: ['top'], }
                },
              ],
            },
          ]
        },
      ]
      resolve({ code: 200, data: routes, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}
