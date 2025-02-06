<template>
  <div class="dashbord-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <div :id="echartInfo.id"> </div>
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
const echartInfo = ref({ id: 'dashbord-echart', exportFileName: '水球图' })
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
    title: { text: '仪表图', top: 5, left: 'center', textStyle: { color: settingStore.theme.echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
    series: [{
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '80%',
      axisLine: { lineStyle: { width: 20, color: [[0.3, '#67e0e3'], [0.7, '#37a2da'], [1, '#fd666d']] } },
      axisTick: { distance: 0, length: 5, lineStyle: { color: 'transparent', width: 2 } },
      axisLabel: { color: 'inherit', distance: 30, fontSize: 16 },
      splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 1 } },
      // progress: { show: true, roundCap: true, width: 20 },
      // itemStyle: { color: '#58D9F9', shadowColor: 'rgba(0,138,255,0.45)', shadowBlur: 10, shadowOffsetX: 2, shadowOffsetY: 2 },
      pointer: { itemStyle: { color: 'auto' }, },
      detail: {
        valueAnimation: true,
        formatter: '{value} %',
        color: 'inherit'
      },
      data: [{ value: echartInfo.value.ratio }]
    }]
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

<!-- <script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      apiData: {},
      echartInfo: {},
      timer: null,
    }
  },
  created() {
    this.init()
    this.timer = setInterval(() => { this.init() }, 60000)
  },
  mounted() {

  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.echartInfo?.instance?.clear()
    this.echartInfo?.instance?.dispose()
    this.echartInfo?.resizer?.disconnect()
  },
  watch: {
    '$store.state.setting.themeStyle'() {
      this.$nextTick(() => { this.initEchart() })
    },
  },
  methods: {
    // 模拟api
    lineEchartInfoGet() {
      return new Promise((resolve, reject) => {
        try {
          const data = { ratio: 36 }
          resolve({ code: 200, data: data, msg: '请求成功！' })
        } catch {
          reject({ code: 500, data: {}, msg: '请求失败！' })
        }
      })
    },
    // 一、初始化相关
    // 0、初始化总调用
    init() {
      this.getEchartInfo()
    },
    // 1、获取echart数据
    async getEchartInfo() {
      const res = await this.lineEchartInfoGet()
      this.$set(this, 'apiData', res.data || {})
      this.handleEchartInfo()
    },
    // 2、处理echart数据
    handleEchartInfo() {
      let chart = { ratio: this.apiData.ratio }
      this.$set(this, 'echartInfo', Object.assign({}, this.echartInfo, chart))
      this.$nextTick(() => { this.initEchart() })
    },
    // 3、渲染echart
    initEchart() {
      this.echartInfo?.instance?.clear()
      this.echartInfo?.instance?.dispose()
      this.echartInfo?.resizer?.disconnect()
      let chartDom = document.getElementById('dashbord-echart')
      if (!chartDom) return
      chartDom && chartDom.removeAttribute('_echarts_instance_')
      let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
      let option = {
        title: { text: '仪表图', top: 5, left: 'center', textStyle: { color: this.$echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
        series: [{
          type: 'gauge',
          center: ['50%', '60%'],
          radius: '80%',
          axisLine: { lineStyle: { width: 20, color: [[0.3, '#67e0e3'], [0.7, '#37a2da'], [1, '#fd666d']] } },
          axisTick: { distance: 0, length: 5, lineStyle: { color: 'transparent', width: 2 } },
          axisLabel: { color: 'inherit', distance: 30, fontSize: 16 },
          splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 1 } },
          // progress: { show: true, roundCap: true, width: 20 },
          // itemStyle: { color: '#58D9F9', shadowColor: 'rgba(0,138,255,0.45)', shadowBlur: 10, shadowOffsetX: 2, shadowOffsetY: 2 },
          pointer: { itemStyle: { color: 'auto' }, },
          detail: {
            valueAnimation: true,
            formatter: '{value} %',
            color: 'inherit'
          },
          data: [{ value: this.echartInfo.ratio }]
        }]

      }
      option && myChart.setOption(option, true)
      // 实例化
      this.$set(this.echartInfo, 'instance', myChart)
      // 监听容器大小变化
      this.echartInfo.resizer = this.$newResizeObserver(() => myChart.resize(), true)
      this.echartInfo.resizer.observe(chartDom)
    },
    // 4、导出echart
    handleExportEchart() {
      let exportFileName = '折线图'
      this.$exportEchartImg(this.echartInfo.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: this.$echartTheme.bg })
    },
  },

}
</script> -->

<style lang="scss" scoped>
.dashbord-vue {
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

  #dashbord-echart {
    width: 100%;
    height: 100%;
  }
}
</style>