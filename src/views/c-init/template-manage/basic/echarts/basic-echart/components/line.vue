<template>
  <div class="line-echart-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore?.themeColor" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="line-echart"> </div>
  </div>
</template>

<script setup>
// # 一、综合
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
// ^

// # 二、模块功能
// # 模拟api
function echartDataGet() {
  return new Promise((resolve, reject) => {
    try {
      const data = {
        '济南': [
          { time: '2024-01-01 12:00:00', temperature: 1, rain: 10, windDirection: 350, windSpeed: 4, humidity: 70, pressure: 1030, },
          { time: '2024-04-01 12:00:00', temperature: 10, rain: 30, windDirection: 220, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-07-01 12:00:00', temperature: 25, rain: 120, windDirection: 150, windSpeed: 2, humidity: 80, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 15, rain: 40, windDirection: 300, windSpeed: 4, humidity: 60, pressure: 1025, },
        ],
        '青岛': [
          { time: '2024-01-01 12:00:00', temperature: 5, rain: 20, windDirection: 320, windSpeed: 5, humidity: 70, pressure: 1020, },
          { time: '2024-04-01 12:00:00', temperature: 15, rain: 40, windDirection: 210, windSpeed: 4, humidity: 75, pressure: 1015, },
          { time: '2024-07-01 12:00:00', temperature: 22, rain: 180, windDirection: 180, windSpeed: 3, humidity: 85, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 16, rain: 50, windDirection: 310, windSpeed: 4, humidity: 70, pressure: 1020, },
        ],
      }
      resolve({ code: 200, data: data, msg: '请求成功！' })
    } catch {
      reject({ code: 500, data: {}, msg: '请求失败！' })
    }
  })
}
// ^
// # 0、初始化总调用
function init() {
  getEchartInfo()
}
// ^
// # 1、获取echart数据
const apiData = ref({})
const echartInfo = ref({})
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  let chart = { lData: [], sData: [], tableData: [], color: proxy.$getSeriesEchartColor() }
  let factor = [{ name: '', field: 'temperature', unit: '℃', type: 'line', yAxisIndex: 0 },]
  // 获取系列
  factor.forEach((item, index) => {
    for (var k in newApiData) {
      let name = k
      let sItem = Object.assign({}, item, { name })
      chart.lData.push(name)
      chart.sData.push(sItem)
    }
  })
  // 处理表格数据
  let ltField = 'time'
  chart.tableData = proxy.$completeEchartTableData(newApiData, (rowItem, matchData, k) => {
    factor.forEach(item => { rowItem[k + (item.name && '-' + item.name)] = matchData[item.field] })
  }, 'time', ltField)
  // 处理dataset数据
  chart.datasetObj = { dimensions: [ltField, ...chart.lData], source: JSON.parse(JSON.stringify(chart.tableData)) }
  chart.datasetArr = { source: proxy.$transformEchartDataset(chart.datasetObj.source) }
  // 定制系列样式
  let seriesOption = proxy.$getLineEchartOption(settingStore, echartInfo, 'include', ['series'])?.series[0] || {}
  chart.sData.forEach((item, index) => {
    let color = chart.color[index]
    let addOption = {
      itemStyle: { borderColor: color, },
      lineStyle: { color: color },
    }
    chart.sData[index] = proxy.$merge({}, seriesOption, addOption, item)
  })
  // 全局赋值
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  // console.log('查echartInfo', echartInfo.value)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let lineOption = proxy.$getLineEchartOption(settingStore, echartInfo, 'exclude', ['series']) || {}
  let addOption = {
    title: { text: '折线图' },
    xAxis: [{ axisLabel: { formatter: (value) => { const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'; return time } }, }],
    yAxis: [{ name: '气温 ( ℃ )', },],
    dataset: echartInfo.value.datasetObj,
    series: echartInfo.value.sData,
  }
  let option = proxy.$merge({}, lineOption, addOption)
  proxy.$initEchart(echartInfo, 'line-echart', option)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '折线图'
  proxy.$exportEchartImage(echartInfo.value.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: settingStore.theme.echartTheme.bg })
}
// ^
// ^

// # 三、生命周期
init()
const timer = ref(null)
timer.value = setInterval(() => { init() }, 60000)
onBeforeUnmount(() => {
  clearInterval(timer.value)
  proxy.$destroyEchart(echartInfo)
})
watch(() => settingStore.themeStyle, (nv, ov) => {
  nextTick(() => { initEchart() })
})
// ^
</script>

<style lang="scss" scoped>
.line-echart-vue {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  color: var(--fcp);

  .echart-export {
    position: absolute;
    top: 5px;
    right: 10px;
    font-weight: 700;
    z-index: 9;
  }

  #line-echart {
    width: 100%;
    height: 100%;
  }
}
</style>