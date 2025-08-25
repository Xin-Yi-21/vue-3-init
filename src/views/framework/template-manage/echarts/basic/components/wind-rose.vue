<template>
  <div class="wind-rose-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div :id="echartInfo.id"> </div>
  </div>
</template>
<script setup>
// # 一、综合
import useSettingStore from '@/store/framework/setting'
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
          { time: '2024-01-01 12:00:00', temperature: 1, rain: 10, windDirection: 11, windSpeed: 4, humidity: 70, pressure: 1030, },
          { time: '2024-01-02 12:00:00', temperature: 10, rain: 30, windDirection: 21, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-03 12:00:00', temperature: 10, rain: 30, windDirection: 31, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-04 12:00:00', temperature: 10, rain: 30, windDirection: 41, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-05 12:00:00', temperature: 10, rain: 30, windDirection: 51, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-06 12:00:00', temperature: 10, rain: 30, windDirection: 61, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-07 12:00:00', temperature: 10, rain: 30, windDirection: 71, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-08 12:00:00', temperature: 10, rain: 30, windDirection: 81, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-09 12:00:00', temperature: 10, rain: 30, windDirection: 91, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-10 12:00:00', temperature: 10, rain: 30, windDirection: 101, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-11 12:00:00', temperature: 10, rain: 30, windDirection: 111, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-12 12:00:00', temperature: 10, rain: 30, windDirection: 121, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-13 12:00:00', temperature: 10, rain: 30, windDirection: 131, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-14 12:00:00', temperature: 10, rain: 30, windDirection: 141, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-15 12:00:00', temperature: 10, rain: 30, windDirection: 151, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-16 12:00:00', temperature: 10, rain: 30, windDirection: 161, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-17 12:00:00', temperature: 10, rain: 30, windDirection: 171, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-18 12:00:00', temperature: 10, rain: 30, windDirection: 181, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-19 12:00:00', temperature: 10, rain: 30, windDirection: 191, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-20 12:00:00', temperature: 10, rain: 30, windDirection: 201, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-01-21 12:00:00', temperature: 25, rain: 120, windDirection: 211, windSpeed: 2, humidity: 80, pressure: 1010, },
          { time: '2024-01-22 12:00:00', temperature: 15, rain: 40, windDirection: 221, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-23 12:00:00', temperature: 15, rain: 40, windDirection: 231, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-24 12:00:00', temperature: 15, rain: 40, windDirection: 241, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-25 12:00:00', temperature: 15, rain: 40, windDirection: 251, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-26 12:00:00', temperature: 15, rain: 40, windDirection: 261, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-27 12:00:00', temperature: 15, rain: 40, windDirection: 271, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-28 12:00:00', temperature: 15, rain: 40, windDirection: 281, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-29 12:00:00', temperature: 15, rain: 40, windDirection: 291, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-30 12:00:00', temperature: 15, rain: 40, windDirection: 301, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-01-31 12:00:00', temperature: 15, rain: 40, windDirection: 311, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-02-01 12:00:00', temperature: 15, rain: 40, windDirection: 321, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-02-02 12:00:00', temperature: 15, rain: 40, windDirection: 331, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-02-03 12:00:00', temperature: 15, rain: 40, windDirection: 341, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-02-04 12:00:00', temperature: 15, rain: 40, windDirection: 351, windSpeed: 4, humidity: 60, pressure: 1025, },
          { time: '2024-02-05 12:00:00', temperature: 15, rain: 40, windDirection: 1, windSpeed: 4, humidity: 60, pressure: 1025, },
        ],
        // '青岛': [
        //   { time: '2024-01-01 12:00:00', temperature: 5, rain: 20, windDirection: 320, windSpeed: 5, humidity: 70, pressure: 1020, },
        //   { time: '2024-04-01 12:00:00', temperature: 15, rain: 40, windDirection: 210, windSpeed: 4, humidity: 75, pressure: 1015, },
        //   { time: '2024-07-01 12:00:00', temperature: 22, rain: 180, windDirection: 180, windSpeed: 3, humidity: 85, pressure: 1010, },
        //   { time: '2024-10-01 12:00:00', temperature: 16, rain: 50, windDirection: 310, windSpeed: 4, humidity: 70, pressure: 1020, },
        // ],
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
const echartInfo = ref({ id: 'wind-rose-echart', exportFileName: '风向玫瑰图' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let chart = { directionsLRV: [], lData: [], xyData: {}, sData: [], windInfo: {} }
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  let directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  chart.directionsLRV = directions.map((item, index) => {
    let angle = 22.5 * index
    let angleRange = [angle - 11.25, angle + 11.25]
    angleRange = angleRange.map(a => (a + 360) % 360)
    return { name: item, angle: angle, angleRange: angleRange }
  })

  for (var k in newApiData) {
    chart.lData.push(k)
    let kData = []
    newApiData[k].forEach(item => { kData.push({ windDirection: item.windDirection, windSpeed: item.windSpeed }) })
    let kInfo = getWindInfo(kData, chart.directionsLRV) || []
    chart.windInfo[k] = kInfo || []
    chart.xyData[k] = []
    chart.directionsLRV.forEach((item, index) => {
      chart.xyData[k].push([kInfo[index].frequency, kInfo[index].angle])
    })
    chart.xyData[k].push([kInfo[0].frequency, kInfo[0].angle]) // 首尾连接
  }

  let common = {
    coordinateSystem: 'polar',
    type: 'line',
    connectNulls: false,
    symbolSize: 0,
  }
  let color = ['#549BDD', '#59D7D7', '#5ABCAA', '#93E42B', '#2ADE26', '#2981D2', '#C274E7']
  chart.lData.forEach((item, index) => {
    let sItem = {
      ...common,
      type: 'line',
      name: item,
      itemStyle: { color: color[index], borderWidth: '2', borderColor: color[index], },
      lineStyle: { color: color[index] },
      data: chart.xyData[item]
    }
    chart.sData.push(sItem)
  })
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => { initEchart() })
}
// 获取风信息
function getWindInfo(data, directionsLRV) {
  if (!directionsLRV) {
    let directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    directionsLRV = directions.map((item, index) => {
      let angle = 22.5 * index
      let angleRange = [angle - 11.25, angle + 11.25]
      angleRange = angleRange.map(a => (a + 360) % 360)
      return { name: item, angle: angle, angleRange: angleRange }
    })
  }
  let res = directionsLRV.map(item => ({ angle: item.angle, frequencyCount: 0, frequency: 0, windSpeedSum: 0, windSpeedAvg: 0, }))
  data.forEach(item1 => {
    directionsLRV.forEach((item2, index2) => {
      if (
        (item2.angleRange[0] > item2.angleRange[1] && ((item1.windDirection >= item2.angleRange[0] && item1.windDirection < 360) || (item1.windDirection >= 0 && item1.windDirection < item2.angleRange[1])))
        ||
        ((item1.windDirection >= item2.angleRange[0] && item1.windDirection < item2.angleRange[1]))
      ) {
        res[index2].frequencyCount += 1
        res[index2].windSpeedSum += item1.windSpeed || 0
      }
    })
  })
  res.forEach(item => {
    item.frequency = proxy.$accurate(((item.frequencyCount / data.length) * 100), 2, false)
    item.windSpeedAvg = proxy.$accurate(item.frequencyCount != 0 ? item.windSpeedSum / item.frequencyCount : 0, 2, false)
  })
  return res
}
// ^
// # 3、渲染echart
function initEchart() {
  let option = {
    title: { text: '风向玫瑰图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    legend: {
      top: 30,
      textStyle: { color: settingStore.theme.echartTheme.fcs },
      data: echartInfo.value.lData
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', },
      backgroundColor: "rgba(255,255,255,0.55)",
      padding: [0, 0],
      confine: true,
      // appendToBody: true,
      formatter: (params) => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">风向频率统计</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        let hasIndex = [] // 记录已拼接过的数据索引，用于解决在数据末尾额外添加了一组数据使折线图形成闭环而造成的鼠标悬浮提示重复问题
        params.forEach((item, index) => {
          if (!hasIndex.includes(item.seriesIndex)) {
            let text = `<div class="content-item">
                            <div class="item-cycle" style="background: ${item.color}"></div>
                            <div class="item-text">
                              <div class="text-left">${item.seriesName}</div>
                              <div class="text-right">
                                 ${item.data[0] || item.data[0] === 0 ? item.data[0] + '%' : '暂无数据'}
                              </div>
                            </div>
                          </div>`
            content = content + text
            hasIndex.push(item.seriesIndex)
            // &nbsp;&nbsp;&nbsp;
            // 平均风速： ${this.echartInfo.windInfo?.[item.seriesName]?.[item.dataIndex]?.windSpeedAvg + ' m/s' || '暂无数据'}
          }
        })
        return start + content + end
      }
    },
    polar: {
      center: ['50%', '58%'],
      radius: '66%'
    },
    angleAxis: {
      type: 'value',
      startAngle: 90,
      min: 0,
      max: 360,
      interval: 360 / echartInfo.value.directionsLRV.length,
      axisLabel: { formatter: (value, index) => { return echartInfo.value.directionsLRV[index]?.name } },
    },
    radiusAxis: {
      // min: function (value) { return value.min - 5 < 0 ? 0 : value.min - 5 },
      // max: function (value) { return value.max + 5 > 100 ? 100 : value.max + 5 },
      axisPointer: { show: false },
    },
    series: echartInfo.value.sData
  }
  proxy.$initEchart(echartInfo, option)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '风向玫瑰图'
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
.wind-rose-vue {
  width: 100%;
  height: 100%;
  position: relative;
  color: var(--fcp);

  .echart-export {
    position: absolute;
    top: 5px;
    right: 10px;
    font-weight: 700;
    z-index: 9;
  }

  #wind-rose-echart {
    width: 100%;
    height: 100%;
  }
}
</style>