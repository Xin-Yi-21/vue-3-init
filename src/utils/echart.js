// echart 创建系列
import { $getEnumsLabel } from './common'
export function $makeChartSeries(chart, apiData, { factor = [], kind = [], xHeader, sortType = 'fk', isUnit = true } = {}) {
  // 初始化
  chart.lData = []
  chart.sData = []
  if (!chart.tableHeader) { chart.tableHeader = {} }
  if (!chart.tableHeader.columnList || JSON.stringify(chart.tableHeader.columnList) == '[]') { chart.tableHeader.columnList = xHeader ? [xHeader] : [{ nameC: '时间', nameT: '时间', fieldT: 'dataTime', fieldN: 'time' }] }
  if (!chart.tableHeader.matchField || JSON.stringify(chart.tableHeader.matchField) == '{}') { chart.tableHeader.matchField = { nameField: 'nameT', fieldField: 'fieldN' } }
  if (!chart.color) { chart.color = $getEchartSeriesColor() }

  // factor-kind 排序
  if (sortType === 'fk') {
    factor.forEach(factorItem => {
      // 特殊配置：A代表适应接口改装
      for (var k in apiData) {
        let kindItem = {
          name: $getEnumsLabel(kind, k, 'name', 'fieldT') || (k === 'A' ? '' : k),
          fieldT: $getEnumsLabel(kind, k, 'fieldT', 'fieldT') || (k === 'A' ? '' : k),
          fieldN: $getEnumsLabel(kind, k, 'fieldN', 'fieldT') || (k === 'A' ? '' : k)
        }
        let thItem = {
          nameC: factorItem.name + (kindItem.name ? `-${kindItem.name}` : ''),                                                // 图表例常规名
          nameT: factorItem.name + (kindItem.name ? `-${kindItem.name}` : '') + (isUnit ? `${factorItem.unit ? `(${factorItem.unit})` : ''}` : ''),    // 表格列常规名
          fieldT: `${factorItem.fieldT}`,                                                                           // api数据的目标字段
          fieldN: factorItem.fieldN + (kindItem.fieldN ? `-${kindItem.fieldN}` : ''),                                         // handle数据的新字段
          unit: `${factorItem.unit}`,                                                                               // 数据单位
          factor: factorItem,                                                                                       // 要素性质
          kind: kindItem,                                                                                           // 种类性质
        }
        chart.lData.push(thItem.nameC)
        chart.sData.push(Object.assign({}, factorItem, { name: thItem.nameC, id: thItem.fieldN }))
        chart.tableHeader.columnList.push(thItem)
      }
    })
  }
  // kind-factor 排序
  else if (sortType === 'kf') {
    for (var k in apiData) {
      let kindItem = {
        name: $getEnumsLabel(kind, k, 'name', 'fieldT') || (k === 'A' ? '' : k),
        fieldT: $getEnumsLabel(kind, k, 'fieldT', 'fieldT') || (k === 'A' ? '' : k),
        fieldN: $getEnumsLabel(kind, k, 'fieldN', 'fieldT') || (k === 'A' ? '' : k)
      }
      factor.forEach(factorItem => {
        let thItem = {
          nameC: (kindItem.name ? `${kindItem.name}-` : '') + factorItem.name,                                                    // 图表例常规名
          nameT: (kindItem.name ? `${kindItem.name}-` : '') + factorItem.name + (isUnit ? `${factorItem.unit ? `(${factorItem.unit})` : ''}` : ''),        // 表格列常规名
          fieldT: `${factorItem.fieldT}`,                                                                                         // api数据的目标字段
          fieldN: (kindItem.fieldN ? `${kindItem.fieldN}-` : '') + factorItem.fieldN,                                             // handle数据的新字段
          unit: `${factorItem.unit}`,                                                                                             // 数据单位
          factor: factorItem,                                                                                                     // 要素性质
          kind: kindItem,                                                                                                         // 种类性质
        }
        chart.lData.push(thItem.nameC)
        chart.sData.push(Object.assign({}, factorItem, { name: thItem.nameC, id: thItem.fieldN }))
        chart.tableHeader.columnList.push(thItem)
      })
    }
  }
}

// echart 补全数据
export function $completeChartData(chart, apiData, callback = null, getOption) {
  chart.xData = []
  chart.tableData = []

  let xFieldT = chart.tableHeader?.columnList[0]?.fieldT
  let xFieldN = chart.tableHeader?.columnList[0]?.fieldN

  // 处理x轴
  for (var k in apiData) {
    apiData[k].forEach(item => { chart.xData.push(item[xFieldT]) })
  }
  chart.xData = this.$uniqueArray(chart.xData)
  let isTimeField = chart.xData.some(item => this.$dayjs(item).isValid())
  this.$sortArray(chart.xData, isTimeField ? 'time' : '')
  // 处理表格
  chart.xData.forEach((xDataItem, xDataIndex) => {
    chart.tableData[xDataIndex] = { [xFieldN]: xDataItem }
    for (var k in apiData) {
      // kind系列
      let matchData = apiData[k].find(apiDataItem => xDataItem === apiDataItem[xFieldT]) || {}
      if (callback && typeof callback === 'function') {
        callback(chart.tableData[xDataIndex], matchData, k)
      } else {
        chart.tableHeader.columnList.forEach(thcItem => {
          if (thcItem?.kind?.fieldT == k || k === 'A') {
            chart.tableData[xDataIndex][thcItem.fieldN] = matchData[thcItem.fieldT]
          }
        })
      }
    }
  })

  // 处理datasetObj数据
  if (!getOption || getOption.includes('datasetObj')) {
    chart.datasetObj = { dimensions: chart.tableHeader.columnList.map(item => item.fieldN), source: JSON.parse(JSON.stringify(chart.tableData)) }
  }
  // 处理datasetArr数据
  if (!getOption || getOption.includes('datasetArr')) {
    if (!chart.datasetObj) { chart.datasetObj = { dimensions: chart.tableHeader.columnList.map(item => item.fieldN), source: JSON.parse(JSON.stringify(chart.tableData)) } }
    chart.datasetArr = { source: this.$transformEchartDataset(chart.datasetObj.source) }
  }
  // 处理xyData
  if (!getOption || getOption.includes('xyData')) {
    chart.xyData = {}
    chart.tableHeader.columnList.slice(1).forEach(item1 => {
      chart.xyData[item1.fieldN] = []
      chart.tableData.forEach(item2 => {
        chart.xyData[item1.fieldN].push({ value: [item2[xFieldT], item2[item1.fieldN]] })
      })
    })
  }
  return chart
}

// 初始化echart
import { shallowRef } from 'vue'
import * as echarts from 'echarts'
export function $initEchart(echartInfo, option) {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
  let chartDom = document.getElementById(echartInfo.value.id)
  if (!chartDom) return
  chartDom && chartDom.removeAttribute('_echarts_instance_')
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  echartInfo.value.instance = shallowRef(myChart)    // 浅响应式引用

  option && myChart.setOption(option, true)
  echartInfo.value.resizer = this.$newResizeObserver(() => myChart.resize(), true)
  echartInfo.value.resizer.observe(chartDom)
}

// 容器大小变化监听
export function $newResizeObserver(fn = () => { }, isFirstResize = true) {
  return new ResizeObserver(() => {
    if (isFirstResize) {
      isFirstResize = false
      return
    }
    fn()
  })
}

// 销毁echart
export function $destroyEchart(echartInfo) {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
}

// echart 数据集转换
export function $transformEchartDataset(data) {
  const header = [...new Set(data.flatMap(Object.keys))]                        // 合并字段名并去重
  const dataRows = data.map(item => header.map(field => item[field] ?? null))  // 提取字段值，缺失字段用 null 填充
  return [header, ...dataRows]
}


// echart 下载图片
// chartObject:echart实例对象
// options:配置参数。 type:导出图片类型；pixelRatio:放大倍数；backgroundColor:导出图片背景色；name:导出图片的名字
export function $exportEchartImage(chartObject, options) {
  let picInfo = chartObject.getDataURL({
    type: options.type ? options.type : 'png',
    pixelRatio: options.pixelRatio ? options.pixelRatio : 1,
    backgroundColor: options.backgroundColor ? options.backgroundColor : '#fff',
  });
  let a = document.createElement('a')
  a.download = options.name
  a.style.display = 'none'
  a.href = picInfo
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

// echart series颜色配置
export function $getEchartSeriesColor() {
  let res = ['#467FD3 ', '#6C3FD3', '#2BC6D1', '#38D95B', '#089F00', '#D2D218', '#E98726', '#D64633', '#B02F7D']
  return res
}

// 折线图配置 echart-line-option
import useSettingStore from '@/store/system/setting'
const $settingStore = useSettingStore()
export function $getLineEchartOption({ echartInfo, settingStore, getType, optionList }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 80, left: 50, right: 50, bottom: 10, containLabel: true, },
    legend: { top: 30, textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      // confine: true,
      appendTo: 'html',
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = ' ' + echartInfo.value?.sData?.[item.seriesIndex]?.unit
          let field = echartInfo.value?.sData?.[item.seriesIndex]?.id || (echartInfo.value?.tableHeader?.columnList?.find(thcItem => thcItem.nameC == item.seriesName))?.fieldN
          let itemData = ''
          if (echartInfo.value.dataRender === 'xyData') {
            itemData = item.data?.value?.[1] != undefined ? item.data?.value?.[1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetArr') {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetObj' || !echartInfo.value.dataRender) {
            itemData = item.data?.[field] != undefined ? item.data?.[field] + unit : '暂无数据'
          }
          let text = `<div class="content-item">
                            <div class="item-cycle" style="background: ${item.borderColor}"></div>
                            <div class="item-text">
                              <div class="text-left">${item.seriesName}</div>
                              <div class="text-right">${itemData}</div >
                            </div >
                           </div > `
          content = content + text
        })
        return start + content + end
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs }, alignWithLabel: true },
        axisLabel: {
          show: true, color: settingStore.theme.echartTheme.fcp, align: 'center',
          showMinLabel: true,
          showMaxLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: settingStore.theme.echartTheme.fcs,
          fontSize: 14,
          fontWeight: 600,
          padding: [0, 0, 0, -30]
        },
        nameGap: 15,
        max: function (value) {
          return value.max + 5
        },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      },
    ],
    series: [
      {
        smooth: true, showAllSymbol: true, symbol: 'circle', symbolSize: 0, connectNulls: false,
        itemStyle: { color: '#fff', borderWidth: '2', },
      }
    ],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// 柱状图配置 echart-bar-option
export function $getBarEchartOption({ echartInfo, settingStore, getType, optionList }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
    legend: { top: 30, textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      // confine: true,
      appendTo: 'html',
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = ' ' + echartInfo.value?.sData?.[item.seriesIndex]?.unit
          let field = echartInfo.value?.sData?.[item.seriesIndex]?.id || (echartInfo.value?.tableHeader?.columnList?.find(thcItem => thcItem.nameC == item.seriesName))?.fieldN
          let itemData = ''
          if (echartInfo.value.dataRender === 'xyData') {
            itemData = item.data?.value?.[1] != undefined ? item.data?.value?.[1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetArr') {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetObj' || !echartInfo.value.dataRender) {
            itemData = item.data?.[field] != undefined ? item.data?.[field] + unit : '暂无数据'
          }
          let text = `<div class="content-item">
                            <div class="item-cycle" style="background: ${item.borderColor}"></div>
                            <div class="item-text">
                              <div class="text-left">${item.seriesName}</div>
                              <div class="text-right">${itemData}</div >
                            </div >
                           </div > `
          content = content + text
        })
        return start + content + end
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs }, alignWithLabel: true },
        axisLabel: {
          show: true, color: settingStore.theme.echartTheme.fcp, align: 'center',
          showMinLabel: true,
          showMaxLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: settingStore.theme.echartTheme.fcs,
          fontSize: 14,
          fontWeight: 600,
          padding: [0, 0, 0, -30]
        },
        nameGap: 15,
        max: function (value) {
          return value.max + 5
        },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      },
    ],
    series: [
      {
        smooth: true, showAllSymbol: true, symbol: 'circle', symbolSize: 4, connectNulls: false,
        itemStyle: { borderWidth: '2', },
      }
    ],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// 缩放配置 echart-dataZoom-option
export function $getDataZoomEchartOption({ echartInfo, settingStore, getType, optionList }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    grid: { bottom: 40, },
    dataZoom: [{
      type: 'slider',
      height: 20,
      left: 140,
      right: 140,
      bottom: 10,
      start: 0,
      end: 100,
      moveHandleSize: 0,
      handleSize: '100%',
      realtime: true,
      backgroundColor: 'transparent',
      fillerColor: settingStore.themeColor,
      borderColor: settingStore.themeColor,
      textStyle: { color: settingStore.themeColor },
    }],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// 筛选option
export function filterOption(option, getType, optionList) {
  if (!getType) { return option }
  let res = {}
  for (var k in option) {
    if (getType === 'include' && optionList.includes(k)) {
      res[k] = option[k]
    }
    if (getType === 'exclude' && !optionList.includes(k)) {
      res[k] = option[k]
    }
  }
  return res
}

