<template>
  <div class="pie-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div :id="echartInfo.id"> </div>
    <div class="part-title-container">
      <span class="part-title" v-for="(item, index) in echartInfo.lData">{{ item }}今日天气</span>
    </div>
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
        '济南': { temperature: 10, rain: 10, humidity: 10, pressure: 10, },
        '青岛': { temperature: 5, rain: 10, humidity: 15, pressure: 20, },
        // '上海': { temperature: 5, rain: 10, humidity: 15, pressure: 20, },
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
const echartInfo = ref({ id: 'pie-echart', exportFileName: '扇形图' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let chart = { lData: [], xyData: {}, sData: [], color: proxy.$getEchartSeriesColor() }
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  for (var k in newApiData) {
    chart.lData.push(k)
    chart.xyData[k] = [
      { name: '气温', value: proxy.$accurate(newApiData[k].temperature, 2, false), itemStyle: { color: '#549BDD' }, unit: '℃' },
      { name: '降水', value: proxy.$accurate(newApiData[k].rain, 2, false), itemStyle: { color: '#59D7D7' }, unit: 'mm' },
      { name: '湿度', value: proxy.$accurate(newApiData[k].humidity, 2, false), itemStyle: { color: '#5ABCAA' }, unit: '%' },
      { name: '气压', value: proxy.$accurate(newApiData[k].pressure, 2, false), itemStyle: { color: '#93E42B' }, unit: 'hPa' },
    ]
    chart.xyData[k].forEach((item, index) => { item.itemStyle = { color: chart.color[index] } })
  }


  let common = {
    label: { show: false, position: 'outer', formatter: '{b}', color: 'inherit', width: 20, overflow: 'trunacate', ellipsis: '...', alignTo: 'labelLine', },
    labelLine: { show: false, length: 10, length2: 10, },
    emphasis: {
      label: { show: false, fontSize: 14, color: 'transparent', formatter: '{b}: {c}' },
      labelLine: { show: false, lineStyle: { color: 'transparent' }, },
    },
  }
  function getPositionConfig(numCharts) {
    const positionConfig = []
    for (let i = 0; i < numCharts; i++) {
      const left = (i === 0) ? '0%' : `${(100 / numCharts) * i}%`
      const right = (i === numCharts - 1) ? '100%' : `${(100 / numCharts) * (i + 1)}%`
      const center = [(parseFloat(left) + parseFloat(right)) / 2 + '%', '50%']
      const radius = ['25%', '50%']
      positionConfig.push({ radius: radius, center: center })
    }
    return positionConfig
  }
  let positionConfig = getPositionConfig(chart.lData.length)

  chart.lData.forEach((item, index) => {
    let sItem = {
      ...common,
      ...positionConfig[index],
      type: 'pie',
      name: item,
      data: chart.xyData[item],
    }
    chart.sData.push(sItem)
  })
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let option = {
    title: { text: '扇形图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                           <div class="tooltip-title">${params.seriesName}</div>
                           <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        let text = `<div class="content-item">
                            <div class="item-cycle" style="background: ${params.color}"></div>
                            <div class="item-text">
                              <div class="text-left">${params.name}</div>
                              <div class="text-right">${params.value != undefined ? params.value + ` ${params.data.unit}` : '暂无数据'}</div>
                            </div>
                        </div>`
        content = content + text
        return start + content + end
      }
    },
    legend: { top: 30, icon: 'circle', textStyle: { color: settingStore.theme.echartTheme.fcs, }, itemWidth: 14, itemHeight: 14, },
    avoidLabelOverlap: true,
    series: echartInfo.value.sData
  }
  proxy.$initEchart(echartInfo, option)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '扇形图'
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
.pie-vue {
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

  #pie-echart {
    width: 100%;
    height: 100%;
  }

  .part-title-container {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    font-weight: 700;
    z-index: 9;

    .part-title {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
    }
  }
}
</style>