import request from '@/api/request'

// 获取路由
export const menuGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const routes = [

        // // 外网链接
        // {
        //   name: 'Website',
        //   path: '/website',
        //   component: 'Layout',
        //   hidden: false,
        //   alwaysShow: true,
        //   redirect: 'noRedirect',
        //   meta: { title: '参考网址', icon: 'c-website', noCache: false, link: null },
        //   children: [
        //     {
        //       name: 'ElementPlus',
        //       path: 'https://element-plus.org/zh-CN',
        //       component: 'Layout',
        //       hidden: false,
        //       meta: { title: 'Element Plus', icon: 'c-element', noCache: false, link: null }
        //     },
        //     {
        //       name: 'ECharts',
        //       path: 'https://echarts.apache.org/zh/index.html',
        //       component: 'Layout',
        //       hidden: false,
        //       meta: { title: 'ECharts', icon: 'c-echarts', noCache: false, link: null }
        //     },
        //   ]
        // },


        // 基础框架
        {
          name: 'Framework',
          path: '/framework',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: '/framework/template-manage/element',
          meta: { title: '基础框架', icon: 'c-menu-framework', noCache: false, link: null, menu: ['top', 'left'], },
          children: [
            {
              name: 'FrameworkTemplateManage',
              path: 'template-manage',
              component: 'ParentView',
              hidden: false,
              alwaysShow: true,
              redirect: '/framework/template-manage/element',
              meta: { title: '模版管理', icon: 'c-menu-template', noCache: false, link: null, menu: ['top', 'left'], clickIn: false },
              children: [
                {
                  name: 'FrameworkElementTemplate',
                  path: 'element',
                  component: 'framework/template-manage/element/index',
                  hidden: false,
                  meta: { title: 'element 模板', icon: 'c-menu-element', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'FrameworkEchartsTemplate',
                  path: 'echarts',
                  component: 'framework/template-manage/echarts/index',
                  hidden: false,
                  meta: { title: 'echarts 模板', icon: 'c-menu-echarts', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'FrameworkMapTemplate',
                  path: 'map',
                  component: 'framework/template-manage/map/index',
                  hidden: false,
                  meta: { title: 'map 模版', icon: 'c-menu-map', noCache: false, link: null, menu: ['left'], }
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
              meta: { title: '系统管理', icon: 'c-menu-manage', noCache: false, link: null, menu: ['top', 'left'], },
              children: [
                {
                  name: 'FrameworkUser',
                  path: 'user',
                  component: 'framework/system-manage/user/index',
                  hidden: false,
                  meta: { title: '用户管理', icon: 'c-menu-user', noCache: false, link: null, menu: ['left'], },
                },
                {
                  name: 'FrameworkRole',
                  path: 'role',
                  component: 'framework/system-manage/role/index',
                  hidden: false,
                  meta: { title: '角色管理', icon: 'c-menu-role', noCache: false, link: null, menu: ['left'], }
                },
                {
                  name: 'FrameworkPermission',
                  path: 'permission',
                  component: 'framework/system-manage/permission/index',
                  hidden: false,
                  meta: { title: '权限管理', icon: 'c-menu-permission', noCache: false, link: null, menu: ['left'], }
                },
              ]
            },
            {
              name: 'Framework1',
              path: '/framework1',
              hidden: false,
              alwaysShow: true,
              meta: {
                title: '临时1', icon: 'c-framework', noCache: false, link: null, menu: ['top', 'left'],
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
