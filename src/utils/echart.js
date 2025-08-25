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
      for (var k in apiData) {
        let kindItem = {
          name: $getEnumsLabel(kind, k, 'name', 'fieldT') || (k === 'A' ? '' : k),
          fieldT: $getEnumsLabel(kind, k, 'fieldT', 'fieldT') || (k === 'A' ? '' : k),
          fieldN: $getEnumsLabel(kind, k, 'fieldN', 'fieldT') || (k === 'A' ? '' : k)
        }
        let thItem = {
          nameC: factorItem.name + (kindItem.name ? `-${kindItem.name}` : ''),                                                                         // 图表例常规名
          nameT: factorItem.name + (kindItem.name ? `-${kindItem.name}` : '') + (isUnit ? `${factorItem.unit ? `(${factorItem.unit})` : ''}` : ''),    // 表格列常规名
          fieldT: `${factorItem.fieldT}`,                                                                                                              // api数据的目标字段
          fieldN: factorItem.fieldN + (kindItem.fieldN ? `-${kindItem.fieldN}` : ''),                                                                  // handle数据的新字段
          unit: `${factorItem.unit}`,                                                                                                                  // 数据单位
          factor: factorItem,                                                                                                                          // 要素性质
          kind: kindItem,                                                                                                                              // 种类性质
        }

        if (kind.length == 0 || (kind.length > 0 && kind.find(item => item.fieldT === k))) {
          chart.lData.push(thItem.nameC)
          chart.sData.push(Object.assign({}, factorItem, { name: thItem.nameC, id: thItem.fieldN }))
          chart.tableHeader.columnList.push(thItem)
        }
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
          nameC: (kindItem.name ? `${kindItem.name}-` : '') + factorItem.name,                                                                         // 图表例常规名
          nameT: (kindItem.name ? `${kindItem.name}-` : '') + factorItem.name + (isUnit ? `${factorItem.unit ? `(${factorItem.unit})` : ''}` : ''),    // 表格列常规名
          fieldT: `${factorItem.fieldT}`,                                                                                                              // api数据的目标字段
          fieldN: (kindItem.fieldN ? `${kindItem.fieldN}-` : '') + factorItem.fieldN,                                                                  // handle数据的新字段
          unit: `${factorItem.unit}`,                                                                                                                  // 数据单位
          factor: factorItem,                                                                                                                          // 要素性质
          kind: kindItem,                                                                                                                              // 种类性质
        }
        chart.lData.push(thItem.nameC)
        chart.sData.push(Object.assign({}, factorItem, { name: thItem.nameC, id: thItem.fieldN }))
        chart.tableHeader.columnList.push(thItem)
      })
    }
  }
}

// echart 完善数据
export function $completeChartData(chart, apiData, callback = null, { getDataType, isSort = true } = {}) {
  chart.xData = []
  chart.tableData = []

  let xFieldT = chart.tableHeader?.columnList[0]?.fieldT
  let xFieldN = chart.tableHeader?.columnList[0]?.fieldN

  // // 步骤 1：为 apiData 创建高效的查找映射
  const apiDataMap = {}
  for (var k in apiData) {
    apiDataMap[k] = apiData[k].reduce((accumulator, item) => {
      accumulator[item[xFieldT]] = item
      return accumulator
    }, {})
  }

  // 步骤 2：使用 Set 代替 Array 来去重 xData
  const xDataSet = new Set();
  for (var k in apiData) {
    apiData[k].forEach(item => {
      xDataSet.add(item[xFieldT]);  // O(1) 时间复杂度
    })
  }

  chart.xData = Array.from(xDataSet);  // 将 Set 转回数组
  if (isSort) {
    let isTimeField = chart.xData.some(item => this.$dayjs(item).isValid())
    this.$sortArray(chart.xData, isTimeField ? 'time' : '')
  }
  // 步骤 3：优化 tableData 的构建
  chart.xData.forEach((xDataItem, xDataIndex) => {
    chart.tableData[xDataIndex] = { [xFieldN]: xDataItem }
    for (const k in apiDataMap) {
      let matchData = apiDataMap[k][xDataItem] || {}
      if (callback && typeof callback === 'function') {
        callback(chart.tableData[xDataIndex], matchData, k)
      } else {
        chart.tableHeader.columnList.forEach(thcItem => {
          if (thcItem?.kind?.fieldT === k || k === 'A') {
            chart.tableData[xDataIndex][thcItem.fieldN] = matchData[thcItem.fieldT]
          }
        })
      }
    }
  })

  // 步骤 4：优化 datasetObj 和 datasetArr 的处理
  if (!getDataType || getDataType.includes('datasetObj')) {
    chart.datasetObj = {
      dimensions: chart.tableHeader.columnList.map(item => item.fieldN),
      source: chart.tableData
    }
  }

  if (!getDataType || getDataType.includes('datasetArr')) {
    if (!chart.datasetObj) {
      chart.datasetObj = {
        dimensions: chart.tableHeader.columnList.map(item => item.fieldN),
        source: chart.tableData
      }
    }
    chart.datasetArr = {
      source: this.$transformEchartDataset(chart.datasetObj.source)
    }
  }

  // 步骤 5：优化 xyData 的处理
  if (!getDataType || getDataType.includes('xyData')) {
    chart.xyData = {}
    chart.tableHeader.columnList.slice(1).forEach(item1 => {
      chart.xyData[item1.fieldN] = chart.tableData.map(item2 => ({
        value: [item2[xFieldN], item2[item1.fieldN]]
      }));
    })
  }
  // console.timeEnd('新时间复杂')
  return chart
}

// echart 搭建框架
export function $makeChartFramework(chart) {
  // 初始化
  chart.lData = []
  chart.sData = []
  let xHeader = chart?.config?.xHeader || { nameC: '时间', nameT: '时间', field: 'time', unit: '' }
  let series = chart?.series || []
  let isUnit = chart?.config?.isUnit === false ? false : true
  if (!chart.tableHeader) { chart.tableHeader = {} }
  if (!chart.tableHeader.columnList || JSON.stringify(chart.tableHeader.columnList) == '[]') { chart.tableHeader.columnList = [xHeader] }
  if (!chart.tableHeader.matchField || JSON.stringify(chart.tableHeader.matchField) == '{}') { chart.tableHeader.matchField = { nameField: 'nameT', fieldField: 'field' } }
  if (!chart.config.color) { chart.config.color = $getEchartSeriesColor() }

  series.forEach(seriesItem => {
    let thItem = {
      nameC: seriesItem.name,
      nameT: seriesItem.name + (isUnit ? `${seriesItem.unit ? `(${seriesItem.unit})` : ''}` : ''),
      field: seriesItem.field,
      unit: seriesItem.unit,
      type: seriesItem.type,
    }
    chart.lData.push(thItem.nameC)
    chart.sData.push(Object.assign({}, seriesItem, { id: seriesItem.field }))
    chart.tableHeader.columnList.push(thItem)
  })
}

// echart 完善数据
export function $completeChartData1(chart) {
  chart.xData = []
  chart.tableData = []
  let series = chart.series || []
  let getDataType = chart?.config?.getDataType || ''
  let isSort = chart?.config?.isSort === false ? false : true
  let dataStructure = chart?.config?.dataStructure || 's'
  let xField = chart.tableHeader?.columnList[0]?.field
  // 完善xData并排序
  if (dataStructure === 's') {
    const xDataSet = new Set()
    series.forEach(item1 => {
      item1.initData?.forEach(item2 => { xDataSet.add(item2.x) })
    })
    chart.xData = Array.from(xDataSet);  // 将 Set 转回数组
  } else {
    chart.xData = series[0]?.initData.map(item => item.x)
  }
  if (isSort) {
    let isTimeField = chart.xData.some(item => this.$dayjs(item).isValid())
    this.$sortArray(chart.xData, isTimeField ? 'time' : '')
  }
  // 完善tableData
  chart.xData.forEach((xDataItem, xDataIndex) => {
    chart.tableData[xDataIndex] = { [xField]: xDataItem }
    series.forEach(item1 => {
      chart.tableData[xDataIndex][item1.field] = item1.initData?.find(item2 => item2.x === xDataItem)?.y
    })
  })

  // 完善 datasetObj
  if (!getDataType || getDataType.includes('datasetObj')) {
    chart.datasetObj = {
      dimensions: chart.tableHeader.columnList.map(item => item.field),
      source: chart.tableData
    }
  }
  // 完善 datasetArr
  if (!getDataType || getDataType.includes('datasetArr')) {
    if (!chart.datasetObj) {
      chart.datasetObj = {
        dimensions: chart.tableHeader.columnList.map(item => item.fieldN),
        source: chart.tableData
      }
    }
    chart.datasetArr = {
      source: this.$transformEchartDataset(chart.datasetObj.source)
    }
  }

  // 完善xyData
  if (!getDataType || getDataType.includes('xyData')) {
    chart.xyData = {}
    chart.tableHeader.columnList.slice(1).forEach(item1 => {
      chart.xyData[item1.field] = chart.tableData.map(item2 => ({
        value: [item2[xField], item2[item1.field]]
      }))
    })
  }
}

// 初始化echart
import { shallowRef } from 'vue'
import * as echarts from 'echarts'
export function $initEchart(echartInfo, option, { resizerCallback } = {}) {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
  let chartDom = document.getElementById(echartInfo.value.id)
  if (!chartDom) return
  chartDom && chartDom.removeAttribute('_echarts_instance_')
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  echartInfo.value.instance = shallowRef(myChart)    // 浅响应式引用
  option && myChart.setOption(option, true)
  echartInfo.value.resizer = this.$newResizeObserver(() => {
    myChart.resize()
    resizerCallback && resizerCallback()
  }, true)
  echartInfo.value.resizer.observe(chartDom)
}

// 联动多个echarts的tooltips
export function $linkageEchartTooltips(echartInfo, groupName, { resizerCallback } = {}) {
  let chartDom = document.getElementById(echartInfo.value.id)
  if (!chartDom) return
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  myChart.group = groupName
  echarts.connect(groupName)
}

// 点击事件
export function $echartsClickEvent(echartInfo, { resizerCallback } = {}) {
  let chartDom = document.getElementById(echartInfo.value.id)
  if (!chartDom) return
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  myChart.on('click', (params) => {
    resizerCallback && resizerCallback(params)
  })
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
export function $getEchartSeriesColor(page) {
  let res = []
  const specifiedColors = ['#467FD3 ', '#6C3FD3', '#2BC6D1', '#38D95B', '#089F00', '#D2D218', '#E98726', '#D64633', '#B02F7D']
  // const specifiedColors = []
  // const supplementColors = ['#c35c5d', '#00a381', '#bc763c', '#68945c', '#507ea4', '#765c47', '#cf929e', '#5aa4ae', '#aa9649', '#206864', '#8b968d', '#615ea8', '#726d40']
  const supplementColors = ['#d50000', '#c51162', '#304ffe', '#aeea00', '#ffff00', '#eb2f96', '#18ffff', '#b2ff59', '#ff6f00', '#d81b60', '#651fff', '#b4a0ff', '#a80000']
  const defaultColors = ['#FF6633', '#FFCC33', '#CCFF33', '#66FF33', '#FF3366', '#F53D00', '#B82E00', '#33FF66', '#FF33CC', '#008AB8', '#00B8F5', '#33FFCC', '#CC33FF', '#6633FF', '#3366FF', '#33CCFF']
  res = [...specifiedColors, ...supplementColors]
  if (page == 'price-pre') {
    res = ['#3886f2', '#38dff2', ...defaultColors]
  } else if (page == 'on-year') {
    res = ['#3886f2', '#ffb133', '#17c600', '#ff6060', '#89c6ff', ...defaultColors]
  } else if (page == 'wind-solar-on-year') {
    res = ['#3886f2', '#ffb133', '#17c600', '#66FF33', '#2BC6D1', '#E98726', '#ff6060', '#89c6ff', '#F53D00', '#18ffff']
  } else if (page == 'coal-price') {
    res = ['#ff9d6c', '#56bbff', ...defaultColors]
  } else if (page == 'bidding') {
    res = ['#a773d9', '#31b0f0', ...defaultColors]
  } else if (page == 'direct-load') {
    res = ['#3e9bff', '#64e1db', ...defaultColors]
  } else if (page == 'province') {
    res = ['#75ead2', '#79aff0', ...defaultColors]
  } else if (page == 'tie-line') {
    res = ['#ffb133', ...defaultColors]
  } else if (page == 'elec-pre') {
    res = ['#3886f2', '#ffa545', ...defaultColors]
  } else if (page == 'price-difference') {
    res = ['#fc7d7f', '#3886f2']
  } else if (page == 'settle-overview') {
    res = ['#75b3fd', '#64e1db', '#3d9bff', '#04e38a']
  } else if (page == 'settle-overview-dark') {
    res = ['#fe8956', '#64e2dc', '#3d9bff', '#04e38a']
  } else if (page == 'ml-term-overview') {
    res = ['#3787f2', '#39e1f4', '#77ead3', '#99c4f3', '#3597dc', '#aa71d9', '#f5a74e', ...defaultColors]
  } else if (page == 'sopt-review') {
    res = ['#3886F2', '#FFA545', '#2BAF1A', '#1BEA00', '#0ADAFF', ...defaultColors]
  }
  return res
}

// 折线图配置 echart-line-option
import useSettingStore from '@/store/framework/setting'
const $settingStore = useSettingStore()
export function $getLineEchartOption({ echartInfo, settingStore, getType, optionList }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 80, left: 50, right: 50, bottom: 5, containLabel: true, },
    legend: { type: 'scroll', top: 30, orient: 'horizontal', width: '1000', height: '40', textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      padding: [0, 0],
      // confine: true,
      // alwaysShowContent: true,
      extraCssText: `background-color: transparent;border: none;box-shadow: none;`,
      appendTo: 'html',
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = echartInfo.value?.sData?.[item.seriesIndex]?.unit ? ' ' + echartInfo.value?.sData?.[item.seriesIndex]?.unit : ''
          let field = echartInfo.value?.sData?.[item.seriesIndex]?.id || (echartInfo.value?.tableHeader?.columnList?.find(thcItem => thcItem.nameC == item.seriesName))?.field
          let itemData = ''
          if (echartInfo.value.dataRender === 'xyData' || echartInfo.value.config?.dataRender === 'xyData') {
            itemData = item.data?.value?.[1] != undefined ? item.data?.value?.[1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetArr' || echartInfo.value.config?.dataRender === 'datasetArr') {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetObj' || (!echartInfo.value.dataRender && !echartInfo.value.config?.dataRender) || echartInfo.value.config?.dataRender === 'datasetObj') {
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
        max: function (value) { return Math.ceil(value.max) },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      },
    ],
    series: [
      {
        smooth: true, showAllSymbol: true, symbol: 'circle', symbolSize: 4, connectNulls: false,
        itemStyle: { color: '#fff', borderWidth: '2', },
      }
    ],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// 交叉着色折线图配置 echart-cross-line-option
export function $getCrossLineEchartOption({ echartInfo, settingStore, getType, optionList, bandData }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 80, left: 50, right: 50, bottom: 5, containLabel: true, },
    legend: { type: 'scroll', top: 30, orient: 'horizontal', width: '1000', height: '40', textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      padding: [0, 0],
      // confine: true,
      // alwaysShowContent: true,
      extraCssText: `background-color: transparent;border: none;box-shadow: none;`,
      appendTo: 'html',
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = echartInfo.value?.sData?.[item.seriesIndex]?.unit ? ' ' + echartInfo.value?.sData?.[item.seriesIndex]?.unit : ''
          let field = echartInfo.value?.sData?.[item.seriesIndex]?.id || (echartInfo.value?.tableHeader?.columnList?.find(thcItem => thcItem.nameC == item.seriesName))?.field
          let itemData = ''
          if (echartInfo.value.dataRender === 'xyData' || echartInfo.value.config?.dataRender === 'xyData') {
            itemData = item.data?.value?.[1] != undefined ? item.data?.value?.[1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetArr' || echartInfo.value.config?.dataRender === 'datasetArr') {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetObj' || (!echartInfo.value.dataRender && !echartInfo.value.config?.dataRender) || echartInfo.value.config?.dataRender === 'datasetObj') {
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
        max: function (value) { return Math.ceil(value.max) },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      },
    ],
    series: [
      {
        name: '交界区域',
        type: 'custom',
        renderItem: function (params, api) {
          const data = api.value(0);
          const item = bandData[params.dataIndex];
          const points = item.coords.map(p => api.coord(p));
          return {
            type: 'polygon',
            shape: { points },
            style: {
              fill: item.color,
              stroke: null
            }
          };
        },
        encode: {}, // 必须存在
        data: bandData,
        silent: true,
        z: 1
      },
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
      // alwaysShowContent: true,
      extraCssText: `background-color: transparent;border: none;box-shadow: none;`,
      appendTo: 'html',
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = echartInfo.value?.sData?.[item.seriesIndex]?.unit ? ' ' + echartInfo.value?.sData?.[item.seriesIndex]?.unit : ''
          let field = echartInfo.value?.sData?.[item.seriesIndex]?.id || (echartInfo.value?.tableHeader?.columnList?.find(thcItem => thcItem.nameC == item.seriesName))?.field
          let itemData = ''
          if (echartInfo.value.dataRender === 'xyData' || echartInfo.value.config?.dataRender === 'xyData') {
            itemData = item.data?.value?.[1] != undefined ? item.data?.value?.[1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetArr' || echartInfo.value.config?.dataRender === 'datasetArr') {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else if (echartInfo.value.dataRender === 'datasetObj' || (!echartInfo.value.dataRender && !echartInfo.value.config?.dataRender) || echartInfo.value.config?.dataRender === 'datasetObj') {
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
        max: function (value) { return Math.ceil(value.max) },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      },
    ],
    series: [
      {
        smooth: false, showAllSymbol: true, symbol: 'circle', symbolSize: 4, connectNulls: false,
        itemStyle: { color: '#fff', borderWidth: '1', },
      }
    ],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// 日期热力图配置 echart-dateHeatmap-option
export function $getDateHeatmapEchartOption({ echartInfo, settingStore, getType, optionList }) {
  !settingStore && (settingStore = $settingStore)
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
    legend: { top: 30, textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {},
    xAxis: [
      {
        type: 'category',
        splitArea: {
          show: true
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        splitArea: {
          show: true
        }
      },
    ],
    series: [
      {
        name: '',
        type: 'heatmap',
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    visualMap: { min: -20, max: 20, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%' },
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
      // left: 140,
      // right: 140,
      left: '3%',
      right: '3%',
      bottom: 10,
      start: 0,
      end: 100,
      minSpan: 0,
      maxSpan: 100,
      moveHandleSize: 0,
      handleSize: '100%',
      realtime: true,
      backgroundColor: settingStore.theme.cssV.tca005,
      // fillerColor: settingStore.theme.cssV.tca015,
      borderColor: settingStore.theme.cssV.tca015,
      textStyle: { color: settingStore.themeColor },
      borderRadius: 0,
      handleSize: '150%',
      handleStyle: {
        color: settingStore.themeColor,
        borderWidth: '-100%',
      },
      handleLabel: {
        show: false
      },
      showDataShadow: false,
    }],
  }
  let res = filterOption(option, getType, optionList)
  return res
}

// X轴间隔配置 echart-xData-interval
export function $getXdataIntervalOption({ echartInfo, settingStore, getType, optionList }) {
  let dataType = ''
  if (echartInfo.value.xData) {
    const length = echartInfo.value.xData.length
    if (length >= 0 && length < 32) {
      dataType = 'year'
    } else if (length >= 32 && length < 63) {
      dataType = 'month'
    } else if (length >= 63) {
      dataType = 'dayOrMinute'
    }
  }
  !settingStore && (settingStore = $settingStore)
  let option = {
    xAxis: [
      {
        axisLabel: {
          interval: dataType == 'dayOrMinute' ? 3 : dataType == 'month' ? 1 : 0
        },
      },
    ]
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

// 获取某x点坐标
export function $getXPosition(myChart, { xLabel, xIndex, xAxisIndex = 0 } = {}) {
  if (xLabel) {
    const position = myChart.convertToPixel({ xAxisIndex }, xLabel)
    // console.log(`${xLabel}坐标位置: ${position}`)
    return position
  }
  if (xIndex !== undefined) {
    const position = myChart.convertToPixel({ xAxisIndex }, xIndex)
    // console.log(`${xIndex}坐标位置: ${position}`)
    return position
  }
  // console.error('请提供有效的 xLabel 或 xIndex')
  return undefined
}

// 获取 x 轴相邻点的坐标距离
export function $getXDistance(myChart, { xAxisIndex = 0 } = {}) {
  const position1 = $getXPosition(myChart, { xIndex: 0, xAxisIndex })
  const position2 = $getXPosition(myChart, { xIndex: 1, xAxisIndex })
  if (position1 !== undefined && position2 !== undefined) {
    const distance = Math.abs(position2 - position1)
    // console.log(`x轴相邻点坐标距离：${distance}`)
    return distance
  }
  // console.error('无法计算x轴相邻点坐标距离')
  return undefined
}

