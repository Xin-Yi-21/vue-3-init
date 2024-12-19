window.vEnv = import.meta.env
import { setConfig } from '@/api/system/config'
import app from './app.js'
// ⭐ element-plus 相关文件
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
app.use(ElementPlus, { locale: locale, size: storageSetting.elSize || 'default' })
// ⭐ ant-design 相关文件
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// import { message } from 'ant-design-vue'
app.use(Antd)
// app.config.globalProperties.$message = message
// ⭐ svg图标 相关文件 
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/system/svg-icon'
import elementIcons from '@/components/system/svg-icon/svgicon'
import '@/assets/iconfont/iconfont.css'
app.component('svg-icon', SvgIcon)
app.use(elementIcons)
// ⭐ 常用样式
import '@/assets/styles/index.scss' // 全局样式
setConfig().then(async (cEnv) => {
  try {
    document.title = cEnv.VITE_APP_TITLE
    await import('./utils/request')                                                            // import('./utils/request')
    await import('./permission.js')                                                            // import('./permission')
    const directive = (await import('./directive')).default                                    // import directive from './directive'
    const plugins = (await import('./plugins')).default                                        // import plugins from './plugins'
    const store = (await import('./store')).default                                            // import store from './store'
    const router = (await import('./router')).default                                          // import router from './router'
    directive(app)
    app.use(plugins)
    app.use(store)
    app.use(router)
    // 全局组件
    const cTooltip = (await import('@/components/project/custom-tooltip')).default
    const cPagination = (await import('@/components/project/custom-pagination')).default
    const cButton = (await import('@/components/project/custom-button')).default
    const cIcon = (await import('@/components/project/custom-icon')).default
    // // const cPreview = (await import('@/components/project/custom-preview')).default
    // const cFileList = (await import('@/components/project/custom-file-list')).default
    const cCardCircle = (await import('@/components/project/custom-card-circle')).default
    const cCardRectangle = (await import('@/components/project/custom-card-rectangle')).default
    const cCardTitle = (await import('@/components/project/custom-card-title')).default
    const cCardHeader = (await import('@/components/project/custom-card-header')).default
    const cTab = (await import('@/components/project/custom-tab')).default

    app.component('cTooltip', cTooltip)
    app.component('cPagination', cPagination)
    app.component('cButton', cButton)
    app.component('cIcon', cIcon)
    // // app.component('cPreview', cPreview)
    // app.component('cFileList', cFileList)
    app.component('cCardCircle', cCardCircle)
    app.component('cCardRectangle', cCardRectangle)
    app.component('cCardTitle', cCardTitle)
    app.component('cCardHeader', cCardHeader)
    app.component('cTab', cTab)

    // // 全局方法
    // // getTableHeaderLRVByGlobal
    const dayjs = (await import('dayjs')).default
    // const { $getEnumsLabel, $getEnumsLabelList, $exportEchartImg, $exportDomTable, $uniqueArray, $sortArray, $completeEchart, $completeTable, $newResizeObserver, $accurate } = await import("@/utils/common.js")
    // const { throttle, debounce, deepClone } = await import("lodash")
    // app.config.globalProperties.$bus = new Vue()
    app.config.globalProperties.$dayjs = dayjs
    // app.config.globalProperties.$getEnumsLabel = $getEnumsLabel
    // app.config.globalProperties.$getEnumsLabelList = $getEnumsLabelList
    // app.config.globalProperties.$exportEchartImg = $exportEchartImg
    // app.config.globalProperties.$exportDomTable = $exportDomTable
    // app.config.globalProperties.$throttle = throttle
    // app.config.globalProperties.$debounce = debounce
    // app.config.globalProperties.$deepClone = deepClone
    // app.config.globalProperties.$downloadFile = $downloadFile
    // app.config.globalProperties.$previewFile = $previewFile
    // app.config.globalProperties.$loadingStart = $loadingStart
    // app.config.globalProperties.$loadingEnd = $loadingEnd
    // app.config.globalProperties.$uniqueArray = $uniqueArray
    // app.config.globalProperties.$sortArray = $sortArray
    // app.config.globalProperties.$completeEchart = $completeEchart
    // app.config.globalProperties.$completeTable = $completeTable
    // app.config.globalProperties.$newResizeObserver = $newResizeObserver
    // app.config.globalProperties.$accurate = $accurate
    app.mount('#app')
  } catch (error) {
    console.log('查error', error)
  }
})
export default app
