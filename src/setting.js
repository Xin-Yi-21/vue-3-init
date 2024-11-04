export default {
  // 网页标题
  title: import.meta.env.VITE_APP_TITLE,
  // 主题风格
  themeStyle: 'light',
  // 主题颜色
  themeColor: '#55c791',
  // 主题大小
  themeSize: '14',
  // 主题轻量级颜色
  themeLightColor: '#55c79166',
  // 显示布局
  showSettings: true,
  // 左侧导航
  isLeftNav: true,
  // 顶部导航
  isTopNav: true,
  // 面包屑
  isTopBar: true,
  // 标签
  isTopTag: true,
  // 动态标题
  dynamicTitle: false,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
