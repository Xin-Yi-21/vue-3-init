import request from '@/utils/request'

// 获取路由
// export const getRouters = () => {
//   return request({
//     url: '/getRouters',
//     method: 'get'
//   })
// }

export const menuGet = () => {
  return new Promise((resolve, reject) => {
    try {
      const routes = [
        {
          name: 'System',
          path: '/system',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: 'noRedirect',
          meta: { title: '系统管理', icon: 'c-system-manage', noCache: false, link: null },
          children: [
            {
              name: 'User',
              path: 'user',
              component: 'c-init/system-manage/user/index',
              hidden: false,
              meta: { title: '用户管理', icon: 'c-user-manage', noCache: false, link: null },
            },
            {
              name: 'Role',
              path: 'role',
              component: 'c-init/system-manage/role/index',
              hidden: false,
              meta: { title: '角色管理', icon: 'c-role-manage', noCache: false, link: null }
            },
            {
              name: 'Menu',
              path: 'menu',
              component: 'c-init/system-manage/menu/index',
              hidden: false,
              meta: { title: '菜单管理', icon: 'c-menu-manage', noCache: false, link: null }
            },
          ]
        },
        {
          name: 'Template',
          path: '/template',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: 'noRedirect',
          meta: { title: '模版管理', icon: 'c-template', noCache: false, link: null },
          children: [
            {
              name: 'Model',
              path: 'modal',
              // component: 'c-init/template-manage/basic/index',
              component: 'ParentView',
              hidden: false,
              meta: { title: '基础模版', icon: 'c-basic-template', noCache: false, link: null },
              children: [
                {
                  name: 'ElementTemplate',
                  path: 'element',
                  component: 'c-init/template-manage/basic/element/index',
                  hidden: false,
                  meta: { title: 'element模板', icon: 'c-element', noCache: false, link: null }
                },
                {
                  name: 'EchartsTemplate',
                  path: 'echarts',
                  component: 'c-init/template-manage/basic/echarts/index',
                  hidden: false,
                  meta: { title: 'echarts模板', icon: 'c-echarts', noCache: false, link: null }
                },
              ]
            },
            {
              name: 'File',
              path: 'file',
              component: 'c-init/template-manage/file/index',
              hidden: false,
              meta: { title: '文件系统', icon: 'c-file-template', noCache: false, link: null }
            },
          ]
        },
        {
          name: 'Website',
          path: '/website',
          component: 'Layout',
          hidden: false,
          alwaysShow: true,
          redirect: 'noRedirect',
          meta: { title: '参考网址', icon: 'c-website', noCache: false, link: null },
          children: [
            {
              name: 'ElementPlus',
              path: 'https://element-plus.org/zh-CN',
              component: 'Layout',
              hidden: false,
              meta: { title: 'Element Plus', icon: 'c-element', noCache: false, link: null }
            },
            {
              name: 'ECharts',
              path: 'https://echarts.apache.org/zh/index.html',
              component: 'Layout',
              hidden: false,
              meta: { title: 'ECharts', icon: 'c-echarts', noCache: false, link: null }
            },
          ]
        },
        // {
        //   name: 'System',
        //   path: '/system',
        //   component: 'Layout',
        //   hidden: false,
        //   alwaysShow: true,
        //   redirect: 'noRedirect',
        //   meta: { title: '系统管理12312312312321', icon: 'c-system-manage', noCache: false, link: null },
        //   children: [
        //     {
        //       name: 'User',
        //       path: 'user',
        //       // component: 'system/user/index',
        //       component: 'ParentView',
        //       hidden: false,
        //       meta: { title: '用户管理12312312312123', icon: 'c-user-manage', noCache: false, link: null },
        //       children: [
        //         {
        //           name: 'Normal',
        //           path: 'normal',
        //           component: 'system/user/normal/index',
        //           hidden: false,
        //           meta: { title: '普通用户1231231231231312', icon: 'c-user', noCache: false, link: null }
        //         },
        //         {
        //           name: 'Admin',
        //           path: 'admin',
        //           component: 'system/user/admin/index',
        //           hidden: false,
        //           meta: { title: '管理员', icon: 'role', noCache: false, link: null }
        //         },
        //       ]
        //     },
        //     {
        //       name: 'Role',
        //       path: 'role',
        //       component: 'system/role/index',
        //       hidden: false,
        //       meta: { title: '角色管理', icon: 'c-role-manage', noCache: false, link: null }
        //     },
        //     {
        //       name: 'Menu',
        //       path: 'menu',
        //       component: 'system/menu/index',
        //       hidden: false,
        //       meta: { title: '菜单管理', icon: 'c-menu-manage', noCache: false, link: null }
        //     },
        //   ]
        // },
      ]
      resolve({ code: 200, data: routes, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: [], msg: '请求失败！' })
    }
  })
}
