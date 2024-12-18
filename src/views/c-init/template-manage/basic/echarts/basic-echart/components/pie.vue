<template>
  <div class="pie-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="$store.state.setting.themeColor" :hoverColor="$theme['--tc']" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="pie-echart"> </div>
    <div class="part-title-container">
      <span class="part-title" v-for="(item, index) in echartInfo.lData">{{ item }}今日天气</span>
    </div>
  </div>
</template>

<script>
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
      let chart = { lData: [], xyData: {}, sData: [], }
      let apiData = JSON.parse(JSON.stringify(this.apiData || {}))
      for (var k in apiData) {
        chart.lData.push(k)
        chart.xyData[k] = [
          { name: '气温', value: this.$accurate(apiData[k].temperature, 2, false), itemStyle: { color: '#549BDD' }, unit: '℃' },
          { name: '降水', value: this.$accurate(apiData[k].rain, 2, false), itemStyle: { color: '#59D7D7' }, unit: 'mm' },
          { name: '湿度', value: this.$accurate(apiData[k].humidity, 2, false), itemStyle: { color: '#5ABCAA' }, unit: '%' },
          { name: '气压', value: this.$accurate(apiData[k].pressure, 2, false), itemStyle: { color: '#93E42B' }, unit: 'hPa' },
        ]
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
      this.$set(this, 'echartInfo', Object.assign({}, this.echartInfo, chart))
      this.$nextTick(() => { this.initEchart() })
    },
    // 3、渲染echart
    initEchart() {
      this.echartInfo?.instance?.clear()
      this.echartInfo?.instance?.dispose()
      this.echartInfo?.resizer?.disconnect()
      let chartDom = document.getElementById('pie-echart')
      if (!chartDom) return
      chartDom && chartDom.removeAttribute('_echarts_instance_')
      let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
      let option = {
        title: { text: '扇形图', top: 5, left: 'center', textStyle: { color: this.$echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
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
        legend: { top: 30, icon: 'circle', textStyle: { color: this.$echartTheme.fcs, }, itemWidth: 14, itemHeight: 14, },
        avoidLabelOverlap: true,
        series: this.echartInfo.sData
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
      let exportFileName = '扇形图'
      this.$exportEchartImg(this.echartInfo.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: this.$echartTheme.bg })
    },
  },

}
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