import defaultSetting from '@/setting'
import { handleThemeStyle, handleThemeColor } from '@/utils/theme'
const { isDynamicTitle, themeStyle, themeColor, elSize, topHeader, leftNav, topNav, topBar, topTag, isFullScreen } = defaultSetting
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingStore = defineStore('setting', {
  state: () => ({
    routeTitle: '',
    topHeader: {
      isShow: storageSetting.topHeader?.isShow === undefined ? topHeader.isShow : storageSetting.topHeader.isShow,
      isBreadcrumbShow: storageSetting.topHeader?.isBreadcrumbShow === undefined ? topHeader.isBreadcrumbShow : storageSetting.topHeader.isBreadcrumbShow,
    },
    leftNav: {
      isShow: storageSetting.leftNav?.isShow === undefined ? leftNav.isShow : storageSetting.leftNav.isShow,
      isCollapse: storageSetting.leftNav?.isCollapse === undefined ? leftNav.isCollapse : storageSetting.leftNav.isCollapse,
      withoutAnimation: storageSetting.leftNav?.withoutAnimation === undefined ? leftNav.withoutAnimation : storageSetting.leftNav.withoutAnimation,
    },
    topNav: {
      isShow: storageSetting.topNav?.isShow === undefined ? topNav.isShow : storageSetting.topNav.isShow,
    },
    topBar: {
      isShow: storageSetting.topBar?.isShow === undefined ? topBar.isShow : storageSetting.topBar.isShow,
    },
    topTag: {
      isShow: storageSetting.topTag?.isShow === undefined ? topTag.isShow : storageSetting.topTag.isShow,
    },

    themeStyle: storageSetting.themeStyle === undefined ? themeStyle : storageSetting.themeStyle,
    themeColor: storageSetting.themeColor === undefined ? themeColor : storageSetting.themeColor,
    theme: {},
    elSize: storageSetting.elSize === undefined ? elSize : storageSetting.elSize,
    // isTopNav: storageSetting.isTopNav === undefined ? isTopNav : storageSetting.isTopNav,
    // isTopBar: storageSetting.isTopBar === undefined ? isTopBar : storageSetting.isTopBar,
    // isTopTag: storageSetting.isTopTag === undefined ? isTopTag : storageSetting.isTopTag,
    isDynamicTitle: storageSetting.isDynamicTitle === undefined ? isDynamicTitle : storageSetting.isDynamicTitle,
    // isFullScreen: storageSetting.isFullScreen === undefined ? isFullScreen : storageSetting.isFullScreen,
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    },
    // 设置顶部页头
    setTopHeader() {
      if (this.topHeader.isShow) {
        document.documentElement.setAttribute('topHeaderStatus', 'show')
      } else {
        document.documentElement.setAttribute('topHeaderStatus', 'hide')
      }
    },
    // 设置左侧导航
    setLeftNav(withoutAnimation) {
      if (this.leftNav.isShow) {
        document.documentElement.setAttribute('leftNavStatus', this.leftNav.isCollapse ? 'collapse' : 'expand')
      } else {
        document.documentElement.setAttribute('leftNavStatus', 'hide')
      }
    },
    // 设置主题风格
    setThemeStyle(value) {
      handleThemeStyle(this.themeStyle)
    },
    // 设置主题颜色
    setThemeColor(value) {
      handleThemeColor(this.themeColor)
    },
    // 设置网页标题
    setTitle(title) {
      this.routeTitle = title
      let defaultTitle = window?.cEnv?.VITE_APP_TITLE || ''
      if (this.isDynamicTitle) {
        document.title = this.routeTitle + (defaultTitle ? ` - ${defaultTitle}` : '')
      } else {
        document.title = defaultTitle
      }
    },
  }
})

export default useSettingStore
