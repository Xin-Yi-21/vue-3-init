window.vEnv = import.meta.env
import { setConfig } from '@/api/system/config'
import app from './app.js'
// ⭐ element-plus 相关文件
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
app.use(ElementPlus, { locale: locale, size: !storageSetting.themeSize ? 'large' : storageSetting.themeSize == 'normal' ? 'default' : storageSetting.themeSize })
// ⭐ ant-design 相关文件
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/reset.css'
// import { message } from 'ant-design-vue'
// app.use(Antd)
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

    // 全局方法
    const dayjs = (await import('dayjs')).default
    const { $getEnumsLabel, $getEnumsLabelList, $exportDomTable, $uniqueArray, $sortArray, $accurate } = await import("@/utils/common.js")
    const { throttle, debounce, deepClone, merge } = await import("lodash")
    const { $completeEchartTableData, $transformEchartDataset, $newResizeObserver, $initEchart, $destroyEchart, $completeEchartXY, $exportEchartImage, $getSeriesEchartColor, $getLineEchartOption, $getBarEchartOption, $getDataZoomEchartOption } = await import("@/utils/echart.js")
    // 基础公共方法
    app.config.globalProperties.$dayjs = dayjs
    app.config.globalProperties.$getEnumsLabel = $getEnumsLabel
    app.config.globalProperties.$getEnumsLabelList = $getEnumsLabelList
    app.config.globalProperties.$uniqueArray = $uniqueArray
    app.config.globalProperties.$sortArray = $sortArray
    app.config.globalProperties.$accurate = $accurate
    // loadsh 公共方法
    app.config.globalProperties.$throttle = throttle
    app.config.globalProperties.$debounce = debounce
    app.config.globalProperties.$deepClone = deepClone
    app.config.globalProperties.$merge = merge
    // echart 公共方法
    app.config.globalProperties.$completeEchartTableData = $completeEchartTableData
    app.config.globalProperties.$transformEchartDataset = $transformEchartDataset
    app.config.globalProperties.$newResizeObserver = $newResizeObserver
    app.config.globalProperties.$initEchart = $initEchart
    app.config.globalProperties.$destroyEchart = $destroyEchart
    app.config.globalProperties.$exportEchartImage = $exportEchartImage
    app.config.globalProperties.$getSeriesEchartColor = $getSeriesEchartColor
    app.config.globalProperties.$getLineEchartOption = $getLineEchartOption
    app.config.globalProperties.$getBarEchartOption = $getBarEchartOption
    app.config.globalProperties.$getDataZoomEchartOption = $getDataZoomEchartOption
    app.config.globalProperties.$completeEchartXY = $completeEchartXY // 待弃用
    // 待定
    // app.config.globalProperties.$bus = new Vue()
    // app.config.globalProperties.$exportDomTable = $exportDomTable
    // app.config.globalProperties.$downloadFile = $downloadFile
    // app.config.globalProperties.$previewFile = $previewFile
    // app.config.globalProperties.$loadingStart = $loadingStart
    // app.config.globalProperties.$loadingEnd = $loadingEnd

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
    const cEchart = (await import('@/components/project/custom-echart')).default

    app.component('cTooltip', cTooltip)
    app.component('cPagination', cPagination)
    app.component('cButton', cButton)
    app.component('cIcon', cIcon)
    // app.component('cPreview', cPreview)
    // app.component('cFileList', cFileList)
    app.component('cCardCircle', cCardCircle)
    app.component('cCardRectangle', cCardRectangle)
    app.component('cCardTitle', cCardTitle)
    app.component('cCardHeader', cCardHeader)
    app.component('cTab', cTab)
    app.component('cEchart', cEchart)

    app.mount('#app')
  } catch (error) {
    console.log('查error', error)
  }
})
export default app
