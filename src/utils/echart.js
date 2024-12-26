// echart 表格数据补全
export function $completeEchartTableData(data, callback = null, xFieldT = 'time', xFieldN = 'time') {
  let apiData = JSON.parse(JSON.stringify(data))
  let res = []
  let xData = []
  for (var k in apiData) {
    apiData[k].forEach(item => { xData.push(item[xFieldT]) })
  }
  xData = this.$uniqueArray(xData)
  let isTimeField = xData.some(item => this.$dayjs(item).isValid())
  this.$sortArray(xData, isTimeField ? 'time' : '')

  xData.forEach((item1, index1) => {
    res[index1] = { [xFieldN]: item1 }
    for (var k in apiData) {
      let matchItem = apiData[k].find(item2 => item1 === item2[xFieldT]) || {}
      if (callback && typeof callback === 'function') {
        callback(res[index1], matchItem, k)
      }
    }
  })
  return res || []
}

// echart 数据集转换
export function $transformEchartDataset(data) {
  const header = [...new Set(data.flatMap(Object.keys))]                        // 合并字段名并去重
  const dataRows = data.map(item => header.map(field => item[field] ?? null))  // 提取字段值，缺失字段用 null 填充
  return [header, ...dataRows]
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

// 初始化echart
import * as echarts from 'echarts'
export function $initEchart(echartInfo, option) {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
  let chartDom = document.getElementById(echartInfo.value.id)
  if (!chartDom) return
  chartDom && chartDom.removeAttribute('_echarts_instance_')
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  option && myChart.setOption(option, true)
  echartInfo.value.instance = myChart
  echartInfo.value.resizer = this.$newResizeObserver(() => myChart.resize(), true)
  echartInfo.value.resizer.observe(chartDom)
}

// 销毁echart
export function $destroyEchart(echartInfo) {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
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


// echart数据补全（xyData版本，考虑弃用）
export function $completeEchartXY(chart) {
  try {
    let xyData = chart.xyData || {}
    let xData = []
    let isTime = false
    for (var k in xyData) {
      xyData[k].forEach(item => { xData.push(item.value?.[0] || item[0]) })
    }
    xData = $uniqueArray(xData)
    let isTimeField = xData.some(item => this.$dayjs(item).isValid())
    this.$sortArray(xData, isTimeField ? 'time' : '')
    for (var k in xyData) { xyData[k] = fill(xyData[k], xData) }
    function fill(arr, xList) {
      let result = []
      let arrObj = {}
      arr.forEach(item => {
        if (item.value?.[0]) {
          arrObj[item.value[0]] = { y: item.value[1], isValue: true }
          arrObj.kPropertyValue = true
        } else if (item[0]) {
          arrObj[item[0]] = { y: item[1], isValue: false }
        }
      })
      xList.forEach(item => {
        if (arrObj[item]) {
          result.push(arrObj[item].isValue ? { value: [item, arrObj[item].y] } : [item, arrObj[item].y])
        } else {
          result.push(arrObj.kPropertyValue ? { value: [item, null] } : [item, null])
        }
      })

      // let arrMap = new Map(arr.map(item => [item.value?.[0] || item[0], item.value?.[1] || item[1]]))  // 将原数组转为一个 Map，方便查找
      // xList.forEach(item => {
      //   if (arrMap.has(item)) {
      //     result.push({ value: [item, arrMap.get(item)] }) // 如果原数组中存在该时间，直接添加
      //   } else {
      //     result.push({ value: [item, null] })  // 如果原数组中没有该时间，填充 null
      //   }
      // })
      return result
    }

    let tableData = []
    xData.forEach(item1 => {
      let rowItem = { time: item1, }
      for (var k in xyData) {
        xyData[k].forEach(item2 => {
          if (item1 === (item2.value?.[0] || item2[0])) {
            rowItem[k] = (item2.value?.[1] || item2.value?.[1] === 0 || item2[1] || item2[1] === 0) ? item2.value?.[1] || item2[1] : '-'
          }
        })
      }
      tableData.push(rowItem)
    })
    chart.xData = xData
    chart.tableData = tableData
  } catch {
    this.$message.warning('数据补全出现问题！')
  }

}

// echart series颜色配置
export function $getSeriesEchartColor(settingStore, echartInfo, showType, operateList) {
  let res = ['#549BDD', '#59D7D7', '#5ABCAA', '#93E42B', '#2ADE26', '#2981D2', '#C274E7']
  return res
}
// 折线图配置 echart-line-option
export function $getLineEchartOption(settingStore, echartInfo, showType, operateList) {
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 80, left: 50, right: 50, bottom: 10, containLabel: true, },
    legend: { top: 30, textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = ' ' + echartInfo.value.sData?.[item.seriesIndex]?.unit
          let itemData = ''
          if (Array.isArray(item.data)) {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else {
            itemData = item.data?.[item.seriesName] != undefined ? item.data?.[item.seriesName] + unit : '暂无数据'
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
        itemStyle: { color: '#fff', borderWidth: '2', },
      }
    ],
  }
  let res = filterOption(option, showType, operateList)
  return res
}
// 柱状图配置 echart-bar-option
export function $getBarEchartOption(settingStore, echartInfo, showType, operateList) {
  let option = {
    title: { text: '', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
    legend: { top: 30, textStyle: { color: settingStore.theme.echartTheme.fcs }, },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params[0].name}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.forEach(item => {
          let unit = ' ' + echartInfo.value.sData?.[item.seriesIndex]?.unit
          let itemData = ''
          if (Array.isArray(item.data)) {
            itemData = item.data?.[item.seriesIndex + 1] != undefined ? item.data?.[item.seriesIndex + 1] + unit : '暂无数据'
          } else {
            itemData = item.data?.[item.seriesName] != undefined ? item.data?.[item.seriesName] + unit : '暂无数据'
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
  let res = filterOption(option, showType, operateList)
  return res
}
export function $getDataZoomEchartOption(settingStore, echartInfo, showType, operateList) {
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
  let res = filterOption(option, showType, operateList)
  return res
}
// 筛选option
export function filterOption(option, showType, operateList) {
  if (!showType) { return option }
  let res = {}
  for (var k in option) {
    if (showType === 'include' && operateList.includes(k)) {
      res[k] = option[k]
    }
    if (showType === 'exclude' && !operateList.includes(k)) {
      res[k] = option[k]
    }
  }
  return res
}

