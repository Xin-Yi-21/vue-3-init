import { cENV } from '@/api/system/config'
export default {
  // 网页标题
  defaultTitle: cENV.VITE_APP_TITLE || '',
  // 动态标题
  isDynamicTitle: true,
  // 主题风格
  themeStyle: 'light',
  // 主题颜色
  themeColor: '#55c791',
  // 主题大小
  elSize: 'default',
  // 主题轻量级颜色
  themeLightColor: '#55c79166',
  // 显示布局
  showSettings: true,
  // 左侧导航
  isLeftNav: true,
  // 顶部导航
  isTopNav: true,
  // 顶部面包屑
  isBreadcrumb: true,
  // 面包栏
  isTopBar: true,
  // 标签
  isTopTag: true,
  // 固定头部
  isFixHeader: false,
  // 是否全屏
  isFullScreen: false,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
