import defaultSetting from '@/setting'
// import { useDynamicTitle } from '@/utils/dynamicTitle'

const { themeStyle, themeColor, themeSize, isLeftNav, isTopNav, isTopBar, isTopTag, fixedHeader, dynamicTitle } = defaultSetting

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingStore = defineStore('setting', {
  state: () => ({
    title: '',
    leftNav: {
      isCollapse: false,
      withoutAnimation: false,
      isHide: false
    },
    // theme: storageSetting.theme || '#409EFF',
    // sideTheme: storageSetting.sideTheme || sideTheme,
    // showSettings: showSettings,
    // fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    // dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
    themeStyle: storageSetting.themeStyle === undefined ? themeStyle : storageSetting.themeStyle,
    themeColor: storageSetting.themeColor === undefined ? themeColor : storageSetting.themeColor,
    themeSize: storageSetting.themeSize === undefined ? themeSize : storageSetting.themeSize,
    isLeftNav: storageSetting.isLeftNav === undefined ? isLeftNav : storageSetting.isLeftNav,
    isTopNav: storageSetting.isTopNav === undefined ? isTopNav : storageSetting.isTopNav,
    isTopBar: storageSetting.isTopBar === undefined ? isTopBar : storageSetting.isTopBar,
    isTopTag: storageSetting.isTopTag === undefined ? isTopTag : storageSetting.isTopTag,
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
      this.title = title
      // useDynamicTitle();
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
