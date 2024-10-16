import { createWebHistory, createRouter } from 'vue-router'
import { cENV } from '@/api/system/config'
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
    component: () => import('@/components/system/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/components/system/error/401'),
    hidden: true
  },
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
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [
  //     {
  //       path: '/home',
  //       component: () => import('@/views/index'),
  //       name: 'Home',
  //       meta: { title: '首页', icon: 'home', affix: false, menu: ['home'], hidden: true },
  //     },
  //     {
  //       path: '/production-monitor',
  //       component: () => import('@/views/production-monitor/index'),
  //       name: 'ProductionMonitor',
  //       meta: { title: '生产监管', icon: 'production-monitor', affix: false, firstMenu: '/production-monitor', hidden: true },
  //     },
  //     {
  //       path: '/forecast-result',
  //       component: () => import('@/views/forecast-result/index'),
  //       name: 'ForecastResult',
  //       meta: { title: '预报结果', icon: 'forecast-result', affix: false, firstMenu: '/forecast-result', hidden: true },
  //     },
  //     {
  //       path: '/forecast-test',
  //       component: () => import('@/views/forecast-test/index'),
  //       name: 'ForecastTest',
  //       meta: { title: '预报检验', icon: 'forecast-test', affix: false, firstMenu: '/forecast-test', hidden: true },
  //     },
  //     {
  //       path: '/warning',
  //       component: () => import('@/views/warning/index'),
  //       name: 'Warning',
  //       meta: { title: '告警', icon: 'warning', affix: false, firstMenu: '/warning', hidden: true },
  //     },
  //     {
  //       path: '/site-manage',
  //       component: () => import('@/views/site-manage/index'),
  //       name: 'SiteManage',
  //       meta: { title: '', icon: 'site-manage', affix: false, firstMenu: '/site-manage', hidden: true },
  //     },
  //     {
  //       path: '/practice',
  //       component: () => import('@/views/practice/index'),
  //       name: 'Practice',
  //       meta: { title: '', icon: 'practice', affix: false, firstMenu: '/practice', hidden: true },
  //     },
  //   ],
  // }
]

const router = createRouter({
  history: createWebHistory(cENV.VITE_APP_PATH),
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
