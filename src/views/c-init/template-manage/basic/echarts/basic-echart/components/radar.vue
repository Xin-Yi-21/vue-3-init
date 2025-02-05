<template>
  <div class="radar-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="radar-echart"> </div>
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
        '济南': { temperature: 90, rain: 80, humidity: 70, pressure: 60, },
        '青岛': { temperature: 92, rain: 71, humidity: 86, pressure: 77, },
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
const echartInfo = ref({ id: 'radar-echart', exportFileName: '雷达' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let chart = { lData: [], xyData: [], sData: [], radarInfo: {}, color: proxy.$getSeriesEchartColor() }
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  chart.indicator = [
    { name: '气温准确率', unit: '%', max: 100, field: 'temperature' },
    { name: '降水准确率', unit: '%', max: 100, field: 'rain' },
    { name: '湿度准确率', unit: '%', max: 100, field: 'humidity' },
    { name: '气压准确率', unit: '%', max: 100, field: 'pressure' },
  ]
  for (var k in newApiData) {
    chart.lData.push(k)
    let rowItem = { name: k, value: [], itemStyle: {} }
    chart.indicator.forEach((item, index) => {
      proxy.$accurate(rowItem.value.push(newApiData[k]?.[item.field]), 2, false)
    })
    chart.xyData.push(rowItem)
  }
  chart.xyData.forEach((item, index) => { item.itemStyle = { color: chart.color[index] } })

  let common = {
    symbolSize: 6,
    emphasis: {
      lineStyle: { width: 4 },
      // label: { show: true, fontSize: 14, formatter: '{b}: {c}' },
      // labelLine: { show: true, },
    },
  }

  let sItem = { ...common, type: 'radar', name: '预报准确率', data: chart.xyData, }
  chart.sData.push(sItem)
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let option = {
    title: { text: '雷达图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    grid: { top: 70, left: 50, right: 50, bottom: 10, containLabel: true, },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.55)',
      padding: [0, 0],
      formatter: params => {
        let start = `<div class="c-echart-tooltip">
                               <div class="tooltip-title">${params.name} - ${params.seriesName}</div>
                               <div class="tooltip-content">`
        let end = ` </div></div>`
        let content = ''
        params.data.value.forEach((item, index) => {
          let indicator = echartInfo.value.indicator[index]
          let itemText = `<div class="content-item">
                            <div class="item-cycle" style="background: ${params.color}"></div>
                            <div class="item-text">
                              <div class="text-left">${indicator.name}</div>
                              <div class="text-right">${item != undefined ? item + ` ${indicator.unit}` : '暂无数据'}</div>
                            </div>
                          </div>`;
          content += itemText
        })
        return start + content + end
      }
    },
    legend: { top: 30, icon: 'diamond', textStyle: { color: settingStore.theme.echartTheme.fcs, }, itemWidth: 14, itemHeight: 14, },
    radar: {
      splitNumber: 5,
      splitLine: { show: true, },
      axisLine: { show: true, },
      axisName: {
        show: true,
        fontSize: 14,
        fontWeight: "bold",
        color: settingStore.theme.echartTheme.fcs,
      },
      axisNameGap: 3,
      radius: 90,
      center: ['50%', '58%'],
      indicator: echartInfo.value.indicator,
    },
    series: echartInfo.value.sData
  }
  proxy.$initEchart(echartInfo, option)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '雷达图'
  proxy.$exportEchartImage(echartInfo.value.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: settingStore.theme.echartTheme.bg })
}
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
.radar-vue {
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

  #radar-echart {
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