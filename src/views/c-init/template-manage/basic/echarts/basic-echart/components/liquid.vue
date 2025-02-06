<template>
  <div class="liquid-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div :id="echartInfo.id"> </div>
  </div>
</template>

<script setup>
// # 一、综合
import 'echarts-liquidfill'
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
// ^
// # 二、模块功能
// # 模拟api
function echartDataGet() {
  return new Promise((resolve, reject) => {
    try {
      const data = { ratio: 36 }
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
const echartInfo = ref({ id: 'liquid-echart', exportFileName: '水球图' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let chart = { ratio: apiData.value.ratio }
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let option = {
    title: { text: '水球图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    series: [
      {
        type: "liquidFill",
        radius: "70%",
        center: ["50%", "52%"],
        data: [(echartInfo.value.ratio / 100), (echartInfo.value.ratio / 100)],       // 设置波浪高度
        // waveAnimation:false,     // 设置波浪静止
        // shape: 'roundRect',      // 设置水球图形（矩形[rect]，菱形[diamond]，三角形[triangle]，水滴状[pin],箭头[arrow]...） 默认为圆形
        amplitude: 6,
        backgroundStyle: {
          borderWidth: 1,
          color: "transparent",
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2,
            borderColor: "#5acef2",
          },
        },
        color: [
          {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 1, color: "rgba(0, 119, 169, 0.6)", },
              { offset: 0, color: "rgba(0, 240, 220, 0.6)", },
            ],
            globalCoord: false,
          },
          {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 1, color: "rgba(0, 119, 169, 1)", },
              { offset: 0, color: "rgba(0, 240, 220, 1)", },
            ],
            globalCoord: false,
          },
        ],
        label: {
          show: true,
          color: '#549bdd',
          insideColor: 'red'
        },
      },
    ],
  }
  proxy.$initEchart(echartInfo, option)
}
// ^
// # 4、导出echart
function handleExportEchart() {
  let exportFileName = '水球图'
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
.liquid-vue {
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

  #liquid-echart {
    width: 100%;
    height: 100%;
  }
}
</style>