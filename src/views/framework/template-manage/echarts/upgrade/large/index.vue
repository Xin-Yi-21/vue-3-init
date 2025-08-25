<template>
  <div class="large-echart-vue">
    <div id="large-echart"> </div>
  </div>
</template>

<script setup>
// # 一、综合
import useSettingStore from '@/store/setting'
const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
// ^

// # 二、模块功能
// # 模拟api
function echartDataGet() {
  return new Promise((resolve, reject) => {
    try {
      let data = []
      for (var i = 0; i < 5000; i++) {
        data.push({ time: i, temperature: i, rain: i })
      }
      console.log('数据量', data.length)
      resolve({ code: 200, data: data, msg: '请求成功！' })
    } catch (error) {
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
const echartInfo = ref({ id: 'large-echart', exportFileName: '大数据' })
async function getEchartInfo() {
  console.time('1-获取接口消耗时间')
  const res = await echartDataGet()
  apiData.value = res.data || {}
  console.timeEnd('1-获取接口消耗时间')
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  console.time('2.1-赋值消耗时间')
  let newApiData = { 'A': apiData.value || {} }
  let chart = { dataRender: 'datasetObj', color: ['#467fd3', '#38d95b'] }
  console.timeEnd('2.1-赋值消耗时间')

  // 创建系列头
  console.time('2.2-创建系列头消耗时间')
  let factor = [
    { name: '气温', fieldT: 'temperature', fieldN: 'temperature', unit: '℃', type: 'line', yAxisIndex: 0 },
    { name: '降水', fieldT: 'rain', fieldN: 'rain', unit: 'mm', type: 'bar', yAxisIndex: 1 },
  ]
  let xHeader = { nameC: '时间', nameT: '时间', fieldT: 'time', fieldN: 'time', unit: '', }
  proxy.$makeChartSeries(chart, newApiData, { factor, xHeader, sortType: 'kf' })
  console.timeEnd('2.2-创建系列头消耗时间')

  // 完善数据
  console.time('2.3-完善数据消耗时间')
  proxy.$completeChartData(chart, newApiData,)
  console.timeEnd('2.3-完善数据消耗时间')

  // 配置系列体
  console.time('2.4-配置系列体消耗时间')
  let lineSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  let barSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  chart.sData.forEach((item, index) => {
    let color = chart.color[index]
    let addOption = {
      // animation: false,
      // sampling: 'lttb',
      large: true,
      itemStyle: { borderColor: color, color: item.type === 'bar' ? color : '#fff' },
      lineStyle: { color: color },
    }
    if (index === 1) {
      // addOption.large = true
      // addOption.largeThreshold = 5000
      // addOption.progressive = 2000
      // addOption.progressiveThreshold = 5000
    }
    let seriesOption = item.type === 'line' ? lineSeriesOption : item.type === 'bar' ? barSeriesOption : {}
    chart.sData[index] = proxy.$merge({}, seriesOption, addOption, item)
  })
  console.timeEnd('2.4-配置系列体消耗时间')

  // 全局赋值
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => {
    console.time('2.5-渲染echart图消耗时间')
    initEchart()
    console.timeEnd('2.5-渲染echart图消耗时间')
  })
  console.log('大数据图', echartInfo.value)
}
// ^
// # 3、渲染echart
function initEchart() {
  let lineOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let dataZoomOption = proxy.$getDataZoomEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let addOption = {
    title: { text: '大数据图' },
    yAxis: [{ name: '气温 ( ℃ )', }, { name: '降水 ( mm )', ...lineOption.yAxis[0] }],
    dataset: echartInfo.value.datasetObj,
    series: echartInfo.value.sData,
    dataZoom: [{
      start: 0,
      end: 100,
      minSpan: 0,
      maxSpan: 20,
    }]
  }
  let option = proxy.$merge({}, lineOption, dataZoomOption, addOption)
  proxy.$initEchart(echartInfo, option)
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
.large-echart-vue {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  color: var(--fcp);

  #large-echart {
    width: 100%;
    height: 100%;
  }
}
</style>