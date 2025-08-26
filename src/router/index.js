import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout'
// 常量路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/login/redirect.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/components/f-error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/components/f-error/401'),
    hidden: true
  },
  // 这个可以访问
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'c-home', affix: true }
      }
    ]
  },
  // 这个不可以访问，404
  // {
  //   name: 'Framework',
  //   path: '/framework',
  //   component: Layout,
  //   hidden: false,
  //   alwaysShow: true,
  //   meta: { title: '基础框架', icon: 'c-framework', noCache: false, link: null, menu: ['top', 'left'], },
  //   children: [
  //     {
  //       name: 'ElementTemplate',
  //       path: 'element',
  //       // component: 'framework/template-manage/element/index',
  //       component: () => import('@/views/framework/template-manage/element/index'),
  //       hidden: false,
  //       meta: { title: 'element 模板', icon: 'c-element', noCache: false, link: null, }
  //     },
  //   ]
  // },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  // {
  //   path: '/system/user-auth',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['system:user:edit'],
  //   children: [
  //     {
  //       path: 'role/:userId(\\d+)',
  //       component: () => import('@/views/system/user/authRole'),
  //       name: 'AuthRole',
  //       meta: { title: '分配角色', activeMenu: '/system/user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system/role-auth',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['system:role:edit'],
  //   children: [
  //     {
  //       path: 'user/:roleId(\\d+)',
  //       component: () => import('@/views/system/role/authUser'),
  //       name: 'AuthUser',
  //       meta: { title: '分配用户', activeMenu: '/system/role' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system/dict-data',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['system:dict:list'],
  //   children: [
  //     {
  //       path: 'index/:dictId(\\d+)',
  //       component: () => import('@/views/system/dict/data'),
  //       name: 'Data',
  //       meta: { title: '字典数据', activeMenu: '/system/dict' }
  //     }
  //   ]
  // },
  // {
  //   path: '/monitor/job-log',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['monitor:job:list'],
  //   children: [
  //     {
  //       path: 'index/:jobId(\\d+)',
  //       component: () => import('@/views/monitor/job/log'),
  //       name: 'JobLog',
  //       meta: { title: '调度日志', activeMenu: '/monitor/job' }
  //     }
  //   ]
  // },
  // {
  //   path: '/tool/gen-edit',
  //   component: Layout,
  //   hidden: true,
  //   permissions: ['tool:gen:edit'],
  //   children: [
  //     {
  //       path: 'index/:tableId(\\d+)',
  //       component: () => import('@/views/tool/gen/editTable'),
  //       name: 'GenEdit',
  //       meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
  //     }
  //   ]
  // }
]


const router = createRouter({
  history: createWebHistory(window.cEnv.VITE_APP_PATH),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
