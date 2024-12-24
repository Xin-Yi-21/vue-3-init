<template>
  <div class="integration-echart-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore?.themeColor" :hoverColor="settingStore?.theme?.tc" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="integration-echart"> </div>
  </div>
</template>

<script setup>
// # 一、综合
import * as echarts from 'echarts'
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
// ^

// # 二、模块功能
// # 模拟api
function lineEchartInfoGet() {
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
  const res = await lineEchartInfoGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let chart = { lData: [], xyData: {}, sData: [], }
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  for (var k in newApiData) {
    chart.lData.push(k)
    chart.xyData[k] = []
    newApiData[k].forEach(item => { chart.xyData[k].push({ value: [item.time, proxy.$accurate(item.temperature, 2, false)] }) })
  }
  proxy.$completeEchart(chart)
  let common = { smooth: true, showAllSymbol: true, symbol: 'circle', symbolSize: 4, connectNulls: false }
  let color = ['#549BDD', '#59D7D7', '#5ABCAA', '#93E42B', '#2ADE26', '#2981D2', '#C274E7']
  chart.lData.forEach((item, index) => {
    let sItem = {
      ...common,
      type: 'line',
      name: item,
      itemStyle: {
        color: '#fff',
        borderWidth: '2',
        borderColor: color[index],
      },
      lineStyle: { color: color[index] },
      data: chart.xyData[item]
    }
    chart.sData.push(sItem)
  })
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
  let chartDom = document.getElementById('integration-echart')
  if (!chartDom) return
  chartDom && chartDom.removeAttribute('_echarts_instance_')
  let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  let option = {
    title: { text: '折线图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
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
          let unit = ' ℃'
          let text = `<div class="content-item">
                            <div class="item-cycle" style="background: ${item.borderColor}"></div>
                            <div class="item-text">
                              <div class="text-left">${item.seriesName}</div>
                              <div class="text-right">${item.data.value?.[1] || item.data.value?.[1] === 0 ? item.data?.value[1] + unit : '暂无数据'}</div>
                            </div>
                           </div>`
          content = content + text
        })
        return start + content + end
      }
    },
    legend: {
      top: 30,
      textStyle: { color: settingStore.theme.echartTheme.fcs },
      data: echartInfo.value.lData
    },
    xAxis: {
      type: 'category',
      axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
      axisTick: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs }, alignWithLabel: true },
      axisLabel: {
        show: true, color: settingStore.theme.echartTheme.fcp, align: 'center',
        showMinLabel: true,
        showMaxLabel: true,
        formatter: (value) => {
          const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'
          return time
        }
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '气温 ( ℃ )',
        nameTextStyle: {
          color: settingStore.theme.echartTheme.fcs,
          fontFamily: 'Alibaba PuHuiTi',
          fontSize: 14,
          fontWeight: 600,
          padding: [0, 0, 0, -30]
        },
        nameGap: 15,
        max: function (value) { return value.max + 5 },
        axisLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcp } },
        axisTick: { show: false },
        axisLabel: { color: settingStore.theme.echartTheme.fcp, fontSize: 14 },
        splitLine: { show: true, lineStyle: { color: settingStore.theme.echartTheme.bcs, type: 'dashed' } }
      }
    ],
    series: echartInfo.value.sData
  }
  option && myChart.setOption(option, true)
  // 实例化
  echartInfo.value.instance = myChart

  // 监听容器大小变化
  echartInfo.value.resizer = proxy.$newResizeObserver(() => myChart.resize(), true)
  echartInfo.value.resizer.observe(chartDom)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '折线图'
  proxy.$exportEchartImg(echartInfo.value.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: settingStore.theme.echartTheme.bg })
}
// ^
// ^

// # 三、生命周期
init()
const timer = ref(null)
timer.value = setInterval(() => { init() }, 60000)
onBeforeUnmount(() => {
  clearInterval(timer.value)
  echartInfo.value?.instance?.clear()
  echartInfo.value?.instance?.dispose()
  echartInfo.value?.resizer?.disconnect()
})
watch(() => settingStore.themeStyle, (nv, ov) => {
  nextTick(() => { initEchart() })
})
// ^
</script>

<style lang="scss" scoped>
.integration-echart-vue {
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

  #integration-echart {
    width: 100%;
    height: 100%;
  }
}
</style>