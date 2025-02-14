import defaultSetting from '@/setting'
import { handleThemeStyle, handleThemeColor, handleThemeSize } from '@/utils/theme'
import { objectEntries } from '@vueuse/core'
const { isDynamicTitle, themeStyle, themeColor, themeSize, topHeader, leftNav, topNav, topBar, topTag, isFullScreen } = defaultSetting
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
    themeSize: storageSetting.themeSize === undefined ? themeSize : storageSetting.themeSize,
    theme: {},
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
    // 设置主题大小
    setThemeSize(value) {
      handleThemeSize(this.themeSize)
    },
    // 设置主题信息集合
    setTheme() {
      // (1) 获取定义在root中的css变量
      function getRootCSSVariables() {
        const cssVariables = {}
        for (const sheet of document.styleSheets) {
          try {
            if (sheet.cssRules) {
              for (const rule of sheet.cssRules) {
                // 查找 :root 选择器
                if (rule.selectorText === ':root') {
                  const style = rule.style
                  for (let i = 0; i < style.length; i++) {
                    const propertyName = style[i]
                    if (propertyName.startsWith('--')) {
                      const cleanPropertyName = propertyName.slice(2)
                      cssVariables[cleanPropertyName] = style.getPropertyValue(propertyName).trim()
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.warn('无法访问样式表:', sheet.href)
          }
        }

        return cssVariables
      }
      const css1 = getRootCSSVariables()
      // console.log('定义在root中的CSS变量:', css1)
      // (2) 获取定义在root中的属性css变量
      function getRootPropertyCSSVariables(variables) {
        const root = document.documentElement
        const computedStyle = getComputedStyle(root)
        return variables.reduce((cssVariables, variable) => {
          const key = variable.startsWith('--') ? variable.slice(2) : variable
          const value = computedStyle.getPropertyValue(variable).trim()
          cssVariables[key] = value || null
          return cssVariables
        }, {})
      }
      const cssSupplement = ['--ch', '--cfs']
      const css2 = getRootPropertyCSSVariables(cssSupplement)
      // console.log('定义在root中的属性css变量', css2)

      // (3) 获取挂载至html中的css变量
      function getHtmlCSSVariables() {
        const htmlStyles = document.documentElement.style
        const cssVariables = {}
        for (let i = 0; i < htmlStyles.length; i++) {
          const property = htmlStyles[i]
          if (property?.startsWith('--')) {
            const value = htmlStyles.getPropertyValue(property).trim()
            const propertyName = property.slice(2)
            cssVariables[propertyName] = value
          }
        }
        return cssVariables
      }
      const css3 = getHtmlCSSVariables()
      // console.log('挂载至html的css变量', css3)
      // 设置主题对象
      let newTheme = {
        themeSyle: this.themeStyle,
        themeColor: this.themeColor,
        themeSize: this.themeSize,
        echartTheme: (function () {
          let echartTheme = {}
          if (this.themeStyle === 'light') {
            echartTheme = { bg: '#fff', fcp: '#333', fcs: '#666', fct: '#999', bcp: '#ccc', bcs: '#ddd', bct: '#eee', }
          } else if (this.themeStyle === 'dark') {
            echartTheme = { bg: '#333', fcp: '#fff', fcs: 'rgba(255, 255, 255, 0.8)', fct: 'rgba(255, 255, 255, 0.6)', bcp: '#efefef', bcs: '#5d5d5d', bct: '#666', }
          }
          return echartTheme
        }).call(this),
        cssV: Object.assign({}, css1, css2, css3)
      }
      this.theme = newTheme
      // console.log('查this.theme', this.theme)
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
  },
  persist: {
    key: 'setting',                          // 默认store.$id
    storage: localStorage,                 // 默认localStorage存储
    pick: ['theme'],              // 指定要持久化的state
    // omit: ['backendEnums.x'],           // 指定不持久化的state
  }
})

export default useSettingStore
