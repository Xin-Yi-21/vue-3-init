import defaultSetting from '@/setting'
// import { useDynamicTitle } from '@/utils/dynamicTitle'

const { defaultTitle, themeStyle, themeColor, elSize, isLeftNav, isTopNav, isTopBar, isBreadcrumb, isTopTag, isDynamicTitle, isFixHeader, isFullScreen } = defaultSetting
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingStore = defineStore('setting', {
  state: () => ({
    routeTitle: '',
    leftNav: {
      isCollapse: false,
      withoutAnimation: false,
      isHide: false
    },
    // theme: storageSetting.theme || '#409EFF',
    // sideTheme: storageSetting.sideTheme || sideTheme,
    // showSettings: showSettings,
    // fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    themeStyle: storageSetting.themeStyle === undefined ? themeStyle : storageSetting.themeStyle,
    themeColor: storageSetting.themeColor === undefined ? themeColor : storageSetting.themeColor,
    elSize: storageSetting.elSize === undefined ? elSize : storageSetting.elSize,
    isLeftNav: storageSetting.isLeftNav === undefined ? isLeftNav : storageSetting.isLeftNav,
    isTopNav: storageSetting.isTopNav === undefined ? isTopNav : storageSetting.isTopNav,
    isTopBar: storageSetting.isTopBar === undefined ? isTopBar : storageSetting.isTopBar,
    isTopTag: storageSetting.isTopTag === undefined ? isTopTag : storageSetting.isTopTag,
    isBreadcrumb: storageSetting.isBreadcrumb === undefined ? isBreadcrumb : storageSetting.isBreadcrumb,
    isDynamicTitle: storageSetting.isDynamicTitle === undefined ? isDynamicTitle : storageSetting.isDynamicTitle,
    isFixHeader: storageSetting.isFixHeader === undefined ? isFixHeader : storageSetting.isFixHeader,
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
    // 设置网页标题
    setTitle(title) {
      this.routeTitle = title
      if (this.isDynamicTitle) {
        document.title = this.routeTitle + ' - ' + defaultTitle
      } else {
        document.title = defaultTitle
      }
    },
    // 切换左侧导航显示
    toggleLeftNav(withoutAnimation) {
      if (this.leftNav.isHide) { return false }
      this.leftNav.isCollapse = !this.leftNav.isCollapse
      this.leftNav.withoutAnimation = withoutAnimation
      Cookies.set('leftNavStatus', this.leftNav.isCollapse ? true : false)
    },
  }
})

export default useSettingStore
