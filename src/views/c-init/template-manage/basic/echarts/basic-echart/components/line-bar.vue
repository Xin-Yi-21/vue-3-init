<template>
  <div class="test-echart-vue">
    <c-echart :eId="echartInfo.id" :eInfo="echartInfo" :eInfoFs="echartInfoFs" @refresh="nextTick(() => { initEchart() })"></c-echart>
  </div>
</template>

<script setup>
// # 一、综合
import useSettingStore from '@/store/system/setting'
import { nextTick, onMounted } from 'vue'
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
const echartInfo = ref({ id: 'custom-echart', exportFileName: '折线-柱状' })
const echartInfoFs = ref({ id: 'custom-echart-fs', exportFileName: '折线-柱状' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  let chart = { lData: [], sData: [], tableData: [], tableHeader: { columnList: [], matchField: {} }, color: proxy.$getEchartSeriesColor(), dataRender: 'datasetObj' }
  // 创建系列头
  let factor = [
    { name: '气温', field: 'temperature', unit: '℃', type: 'line', yAxisIndex: 0 },
    { name: '降水', field: 'rain', unit: 'mm', type: 'bar', yAxisIndex: 1 }
  ]
  let kind = [{ name: '济南', field: 'jn' }, { name: '青岛', field: 'qd' }]
  let xHeader = { nameC: '时间', nameT: '时间', fieldT: 'time', fieldN: 'time', unit: '', }  // nameC-图表例常规名，nameT-表格列常规名，fieldT-api数据的目标字段，filedN-handle数据的新字段，unit-数据单位
  proxy.$makeChartSeries(chart, newApiData, { factor, kind, xHeader, sortType: 'fk' })

  // 完善数据
  proxy.$completeChartData(chart, newApiData, (rowItem, matchData, kindItem) => {
    chart.tableHeader.columnList.forEach(item => { if (item.kind == kindItem) { rowItem[item.fieldN] = matchData[item.fieldT] } })
  },)

  // 配置系列体
  let lineSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  let barSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  chart.sData.forEach((item, index) => {
    let color = chart.color[index]
    let addOption = {
      itemStyle: { borderColor: color, color: item.type === 'bar' ? color : '#fff' },
      lineStyle: { color: color },
    }
    let seriesOption = item.type === 'line' ? lineSeriesOption : item.type === 'bar' ? barSeriesOption : {}
    chart.sData[index] = proxy.$merge({}, seriesOption, addOption, item)
  })

  // 全局赋值
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  echartInfoFs.value = Object.assign({}, echartInfoFs.value, chart)
  // console.log('折线柱状图', echartInfo.value)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let lineOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let addOption = {
    title: { text: '折线-柱状图' },
    xAxis: [{ axisLabel: { formatter: (value) => { const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'; return time } }, }],
    yAxis: [{ name: '气温 ( ℃ )', }, { name: '降水 ( mm )', ...lineOption.yAxis[0] }],
    dataset: echartInfo.value.datasetObj,
    series: echartInfo.value.sData,
  }
  let option = proxy.$merge({}, lineOption, addOption)

  echartInfoFs.value.option = proxy.$merge({}, option)
  proxy.$initEchart(echartInfo, option)
}
// ^
// ^

// # 三、生命周期
onMounted(() => {
  init()
})
const timer = ref(null)
timer.value = setInterval(() => { init() }, 60000)
onBeforeUnmount(() => {
  clearInterval(timer.value)
  proxy.$destroyEchart(echartInfo)
  proxy.$destroyEchart(echartInfoFs)
})
watch(() => settingStore.themeStyle, (nv, ov) => {
  nextTick(() => { initEchart() })
})
// ^
</script>

<style lang="scss" scoped>
.test-echart-vue {
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

  #test-echart {
    width: 100%;
    height: 100%;
  }
}
</style>