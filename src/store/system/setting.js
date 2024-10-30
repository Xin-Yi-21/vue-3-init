import defaultSettings from '@/settings'
// import { useDynamicTitle } from '@/utils/dynamicTitle'

const { themeStyle, themeColor, isLeftNav, isTopNav, isTopBar, isTopTag, fixedHeader, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingStore = defineStore('setting', {
  state: () => ({
    title: '',
    // theme: storageSetting.theme || '#409EFF',
    // sideTheme: storageSetting.sideTheme || sideTheme,
    // showSettings: showSettings,

    themeStyle: storageSetting.themeStyle === undefined ? themeStyle : storageSetting.themeStyle,
    themeColor: storageSetting.themeColor === undefined ? themeColor : storageSetting.themeColor,
    isLeftNav: storageSetting.isLeftNav === undefined ? isLeftNav : storageSetting.isLeftNav,
    isTopNav: storageSetting.isTopNav === undefined ? isTopNav : storageSetting.isTopNav,
    isTopBar: storageSetting.isTopBar === undefined ? isTopBar : storageSetting.isTopBar,
    isTopTag: storageSetting.isTopTag === undefined ? isTopTag : storageSetting.isTopTag,

    fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
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
    }
  }
})

export default useSettingStore
