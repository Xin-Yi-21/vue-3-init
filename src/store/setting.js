import defaultSetting from '@/layout/setting'
import { handleThemeStyle, handleThemeColor, handleThemeSize } from '@/utils/theme'
const { isDynamicTitle, themeStyle, themeColor, themeSize, topHeader, leftSide, topNav, topBar, topTag, isTemplateManage, isFullScreen } = defaultSetting
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const useSettingStore = defineStore('setting', {
  state: () => ({
    routeTitle: '',
    topHeader: {
      isShow: storageSetting.topHeader?.isShow === undefined ? topHeader.isShow : storageSetting.topHeader.isShow,
      isBreadcrumbShow: storageSetting.topHeader?.isBreadcrumbShow === undefined ? topHeader.isBreadcrumbShow : storageSetting.topHeader.isBreadcrumbShow,
    },
    topNav: {
      isShow: storageSetting.topNav?.isShow === undefined ? topNav.isShow : storageSetting.topNav.isShow,
    },
    topTag: {
      isShow: storageSetting.topTag?.isShow === undefined ? topTag.isShow : storageSetting.topTag.isShow,
    },
    leftSide: {
      isShow: storageSetting.leftSide?.isShow === undefined ? leftSide.isShow : storageSetting.leftSide.isShow,
      isCollapse: storageSetting.leftSide?.isCollapse === undefined ? leftSide.isCollapse : storageSetting.leftSide.isCollapse,
      withoutAnimation: storageSetting.leftSide?.withoutAnimation === undefined ? leftSide.withoutAnimation : storageSetting.leftSide.withoutAnimation,
    },
    themeStyle: storageSetting.themeStyle === undefined ? themeStyle : storageSetting.themeStyle,
    themeColor: storageSetting.themeColor === undefined ? themeColor : storageSetting.themeColor,
    themeSize: storageSetting.themeSize === undefined ? themeSize : storageSetting.themeSize,
    theme: {},
    isTemplateManage: storageSetting.isTemplateManage === undefined ? isTemplateManage : storageSetting.isTemplateManage,
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
    // 设置左侧边栏
    setLeftSide(withoutAnimation) {
      if (this.leftSide.isShow) {
        document.documentElement.setAttribute('leftSideStatus', this.leftSide.isCollapse ? 'collapse' : 'expand')
      } else {
        document.documentElement.setAttribute('leftSideStatus', 'hide')
      }
    },
    // 设置主题风格
    setThemeStyle(value) {
      handleThemeStyle(this.themeStyle, this.theme)
    },
    // 设置主题颜色
    setThemeColor(value) {
      handleThemeColor(this.themeColor)
    },
    // 设置主题大小
    setThemeSize(value) {
      handleThemeSize(this.themeSize)
    },
    // 设置主题信息集合
    setTheme() {
      const el = document.documentElement

      // 公用函数：获取预设变量
      const getPresetCssV = (onlyElement = false) => {
        const vars = {}
        for (const sheet of document.styleSheets) {
          let rules
          try { rules = sheet.cssRules } catch (e) { continue } // 跨域忽略
          if (!rules) continue

          for (const rule of rules) {
            if (rule.selectorText && rule.selectorText.includes(':root')) {
              for (const prop of rule.style) {
                if (!prop.startsWith('--')) continue
                const value = rule.style.getPropertyValue(prop).trim()
                const cleanProp = prop.slice(2)
                if (onlyElement && prop.startsWith('--el-')) vars[cleanProp] = value
                if (!onlyElement && !prop.startsWith('--el-')) vars[cleanProp] = value
              }
            }
          }
        }
        return vars
      }

      // 1、echartCssV
      const echartCssV = (() => {
        if (this.themeStyle === 'light') {
          return { bg: '#fff', fcp: '#333', fcs: '#666', fct: '#999', bcp: '#ccc', bcs: '#ddd', bct: '#eee' }
        } else if (this.themeStyle === 'dark') {
          return { bg: '#333', fcp: '#fff', fcs: 'rgba(255, 255, 255, 0.8)', fct: 'rgba(255, 255, 255, 0.6)', bcp: '#efefef', bcs: '#5d5d5d', bct: '#666' }
        }
        return {}
      })()

      // 2、elementCssV
      const elementCssV = getPresetCssV(true)

      // 3、customCssV
      const customStyleCssV = {}
      for (let i = 0; i < el.style.length; i++) {
        const prop = el.style[i]
        if (prop.startsWith('--')) customStyleCssV[prop.slice(2)] = el.style.getPropertyValue(prop).trim()
      }
      const customPresetCssV = getPresetCssV(false)
      const customCssV = { ...customStyleCssV, ...customPresetCssV }

      // 4、设置 theme
      this.theme = {
        themeStyle: this.themeStyle,
        themeColor: this.themeColor,
        themeSize: this.themeSize,
        echartCssV,
        elementCssV,
        customCssV
      }
      // console.log('查settingStore.theme', this.theme)
    },
    // 设置网页标题
    setTitle(title) {
      this.routeTitle = title
      // let stationName = useStationStore().currentStation?.stationName || ''

      // let defaultTitle = window?.cEnv?.VITE_APP_TITLE || ''
      // if (this.isDynamicTitle) {
      //   document.title = (stationName ? `${stationName} - ` : '') + this.routeTitle + (defaultTitle ? ` - ${defaultTitle}` : '')
      // } else {
      //   document.title = defaultTitle
      // }
    },
    // 初始化
    setInitSetting() {
      this.setThemeStyle()
      this.setThemeColor()
      this.setThemeSize()
      this.setTopHeader()
      this.setLeftSide()
      this.setTheme()
    }
  },
  persist: {
    key: 'setting',                          // 默认store.$id
    storage: localStorage,                   // 默认localStorage存储
    pick: ['theme'],                         // 指定要持久化的state
    // omit: ['backendEnums.x'],             // 指定不持久化的state
  }
})

export default useSettingStore
