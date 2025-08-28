window.vEnv = import.meta.env
import { setConfig } from '@/api/request/config'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
// ⭐ element-plus 相关文件
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
app.use(ElementPlus, { locale: locale, size: 'default' })
// app.use(ElementPlus, { locale: locale, size: !storageSetting.themeSize ? 'large' : storageSetting.themeSize == 'normal' ? 'default' : storageSetting.themeSize })

// ⭐ svg图标 相关文件 
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/f-svg-icon'
import elementIcons from '@/components/f-svg-icon/svgicon'
import '@/assets/iconfont/iconfont.css'
// import 'default-passive-events' // 解决wheel控制台警告信息
app.component('svg-icon', SvgIcon)
app.use(elementIcons)
// ⭐ 常用样式
import '@/assets/styles/index.scss' // 全局样式

// import '@/mock/index.js'

setConfig().then(async (cEnv) => {
  try {
    document.title = cEnv.VITE_APP_TITLE
    // await import('./api/request/index.js')                                                            // import('./utils/request')
    await import('./router/guard.js')                                                            // import('./permission')
    const directives = (await import('./directives')).default                                    // import directive from './directive'
    const plugins = (await import('./plugins')).default                                        // import plugins from './plugins'
    const { store, useStore } = (await import('./store'))                                                // import store from './store'
    const router = (await import('./router')).default                                          // import router from './router'

    directives(app)
    app.use(plugins)
    app.use(store)
    app.use(router)

    const { settingStore } = useStore()
    settingStore.setInitSetting()

    // 全局方法
    const dayjs = (await import('dayjs')).default
    const $bus = (await import('@/utils/bus')).default
    const { $getEnumsLabel, $getEnumsLabelList, $uniqueArray, $sortArray, $accurate, $hasValue, $exportExcel, $readExcel, $getRouteClass, $exportDomToImage, $exportDomToExcel, $exportDataToExcel, $cConfirm, $addTableIndex, $downloadFile } = await import('@/utils/common.js')
    const { throttle, debounce, cloneDeep, merge } = await import('lodash')
    const { $makeChartSeries, $makeChartFramework, $completeChartData, $completeChartData1, $transformEchartDataset, $newResizeObserver, $initEchart, $linkageEchartTooltips, $echartsClickEvent, $destroyEchart, $completeEchartXY, $exportEchartImage, $getEchartSeriesColor, $getLineEchartOption, $getCrossLineEchartOption, $getBarEchartOption, $getDateHeatmapEchartOption, $getDataZoomEchartOption, $getXdataIntervalOption, $getXPosition, $getXDistance } = await import('@/utils/echart.js')

    // 基础公共方法
    app.config.globalProperties.$dayjs = dayjs
    app.config.globalProperties.$getEnumsLabel = $getEnumsLabel
    app.config.globalProperties.$getEnumsLabelList = $getEnumsLabelList
    app.config.globalProperties.$uniqueArray = $uniqueArray
    app.config.globalProperties.$sortArray = $sortArray
    app.config.globalProperties.$accurate = $accurate
    app.config.globalProperties.$hasValue = $hasValue
    app.config.globalProperties.$exportExcel = $exportExcel
    app.config.globalProperties.$exportDomToImage = $exportDomToImage
    app.config.globalProperties.$exportDomToExcel = $exportDomToExcel
    app.config.globalProperties.$exportDataToExcel = $exportDataToExcel
    app.config.globalProperties.$readExcel = $readExcel
    app.config.globalProperties.$getRouteClass = $getRouteClass
    app.config.globalProperties.$cConfirm = $cConfirm
    app.config.globalProperties.$addTableIndex = $addTableIndex
    app.config.globalProperties.$downloadFile = $downloadFile
    // loadsh 公共方法
    app.config.globalProperties.$throttle = throttle
    app.config.globalProperties.$debounce = debounce
    app.config.globalProperties.$deepClone = cloneDeep
    app.config.globalProperties.$merge = merge
    // echart 公共方法
    app.config.globalProperties.$makeChartSeries = $makeChartSeries
    app.config.globalProperties.$makeChartFramework = $makeChartFramework
    app.config.globalProperties.$completeChartData = $completeChartData
    app.config.globalProperties.$completeChartData1 = $completeChartData1
    app.config.globalProperties.$transformEchartDataset = $transformEchartDataset
    app.config.globalProperties.$newResizeObserver = $newResizeObserver
    app.config.globalProperties.$initEchart = $initEchart
    app.config.globalProperties.$linkageEchartTooltips = $linkageEchartTooltips
    app.config.globalProperties.$echartsClickEvent = $echartsClickEvent
    app.config.globalProperties.$destroyEchart = $destroyEchart
    app.config.globalProperties.$exportEchartImage = $exportEchartImage
    app.config.globalProperties.$getEchartSeriesColor = $getEchartSeriesColor
    app.config.globalProperties.$getLineEchartOption = $getLineEchartOption
    app.config.globalProperties.$getCrossLineEchartOption = $getCrossLineEchartOption
    app.config.globalProperties.$getDateHeatmapEchartOption = $getDateHeatmapEchartOption
    app.config.globalProperties.$getBarEchartOption = $getBarEchartOption
    app.config.globalProperties.$getDataZoomEchartOption = $getDataZoomEchartOption
    app.config.globalProperties.$getXdataIntervalOption = $getXdataIntervalOption
    app.config.globalProperties.$getXPosition = $getXPosition
    app.config.globalProperties.$getXDistance = $getXDistance
    app.config.globalProperties.$completeEchartXY = $completeEchartXY // 待弃用
    app.config.globalProperties.$bus = $bus
    // 待定
    // app.config.globalProperties.$downloadFile = $downloadFile
    // app.config.globalProperties.$previewFile = $previewFile
    // app.config.globalProperties.$loadingStart = $loadingStart
    // app.config.globalProperties.$loadingEnd = $loadingEnd

    // 全局组件
    const cTooltip = (await import('@/components/custom-tooltip')).default
    const cPagination = (await import('@/components/custom-pagination')).default
    const cButton = (await import('@/components/custom-button')).default
    const cIcon = (await import('@/components/custom-icon')).default
    const cTag = (await import('@/components/custom-tag')).default
    const cText = (await import('@/components/custom-text')).default
    // // const cPreview = (await import('@/components/custom-preview')).default
    // const cFileList = (await import('@/components/custom-file-list')).default
    const cCardCircle = (await import('@/components/custom-card-circle')).default
    const cCardRectangle = (await import('@/components/custom-card-rectangle')).default
    const cCardTitle = (await import('@/components/custom-card-title')).default
    const cCardHeader = (await import('@/components/custom-card-header')).default
    const cCardTip = (await import('@/components/custom-card-tip')).default
    const cTab = (await import('@/components/custom-tab')).default
    const cEchart = (await import('@/components/custom-echart')).default
    const cDataWithUnit = (await import('@/components/custom-data-with-unit')).default
    const cScroll = (await import('@/components/custom-scroll')).default
    const cConfirm = (await import('@/components/custom-confirm')).default
    const cSelection = (await import('@/components/custom-selection')).default
    const cSelectionTree = (await import('@/components/custom-selection-tree')).default
    const cAudit = (await import('@/components/custom-audit')).default
    app.component('cTooltip', cTooltip)
    app.component('cPagination', cPagination)
    app.component('cButton', cButton)
    app.component('cIcon', cIcon)
    app.component('cTag', cTag)
    app.component('cText', cText)
    // app.component('cPreview', cPreview)
    // app.component('cFileList', cFileList)
    app.component('cCardCircle', cCardCircle)
    app.component('cCardRectangle', cCardRectangle)
    app.component('cCardTitle', cCardTitle)
    app.component('cCardHeader', cCardHeader)
    app.component('cCardTip', cCardTip)
    app.component('cTab', cTab)
    app.component('cEchart', cEchart)
    app.component('cDataWithUnit', cDataWithUnit)
    // const { Vue3SeamlessScroll, VerticalScroll, HorizontalScroll } = (await import('vue3-seamless-scroll'))
    // app.component('cVScroll', Vue3SeamlessScroll)
    // app.component('cVScrollY', VerticalScroll)
    // app.component('cVScrollX', HorizontalScroll)
    app.component('cScroll', cScroll)
    app.component('cConfirm', cConfirm)
    app.component('cSelection', cSelection)
    app.component('cSelectionTree', cSelectionTree)
    app.component('cAudit', cAudit)





    app.mount('#app')
  } catch (error) {
    console.log('查error', error)
  }
})
// app.config.errorHandler = (err, instance, info) => {
//   console.error('全局捕获到 Vue 错误：', err, info);
//   // 这里可以做统一日志上报、埋点，或者强制跳转到一个错误提示页面
// };
export default app
