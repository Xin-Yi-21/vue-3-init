<template>
  <div class="radar-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="$store.state.setting.themeColor" :hoverColor="$theme['--tc']" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="radar-echart"> </div>
    <div class="part-title-container">
      <!-- <span class="part-title" v-for="(item, index) in echartInfo.lData">{{ item }}今日天气</span> -->
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
            '济南': { temperature: 90, rain: 80, humidity: 70, pressure: 60, },
            '青岛': { temperature: 92, rain: 71, humidity: 86, pressure: 77, },
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
      let chart = { lData: [], xyData: [], sData: [], radarInfo: {} }
      let apiData = JSON.parse(JSON.stringify(this.apiData || {}))

      chart.indicator = [
        { name: '气温准确率', unit: '%', max: 100, field: 'temperature' },
        { name: '降水准确率', unit: '%', max: 100, field: 'rain' },
        { name: '湿度准确率', unit: '%', max: 100, field: 'humidity' },
        { name: '气压准确率', unit: '%', max: 100, field: 'pressure' },
      ]
      let color = ['#549BDD', '#59D7D7', '#5ABCAA', '#93E42B', '#2ADE26', '#2981D2', '#C274E7']
      for (var k in apiData) {
        chart.lData.push(k)
        let rowItem = { name: k, value: [], itemStyle: {} }
        chart.indicator.forEach((item, index) => {
          this.$accurate(rowItem.value.push(apiData[k]?.[item.field]), 2, false)
        })
        chart.xyData.push(rowItem)
      }
      chart.xyData.forEach((item, index) => { item.itemStyle = { color: color[index] } })

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
      this.$set(this, 'echartInfo', Object.assign({}, this.echartInfo, chart))
      this.$nextTick(() => { this.initEchart() })
    },
    // 3、渲染echart
    initEchart() {
      this.echartInfo?.instance?.clear()
      this.echartInfo?.instance?.dispose()
      this.echartInfo?.resizer?.disconnect()
      let chartDom = document.getElementById('radar-echart')
      if (!chartDom) return
      chartDom && chartDom.removeAttribute('_echarts_instance_')
      let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
      let option = {
        title: { text: '雷达图', top: 5, left: 'center', textStyle: { color: this.$echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
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
              let indicator = this.echartInfo.indicator[index]
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
        legend: { top: 30, icon: 'diamond', textStyle: { color: this.$echartTheme.fcs, }, itemWidth: 14, itemHeight: 14, },
        radar: {
          splitNumber: 5,
          splitLine: { show: true, },
          axisLine: { show: true, },
          axisName: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
            color: this.$echartTheme.fcs,
          },
          axisNameGap: 3,
          radius: 90,
          center: ['50%', '58%'],
          indicator: this.echartInfo.indicator,
        },
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
      let exportFileName = '雷达图'
      this.$exportEchartImg(this.echartInfo.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: this.$echartTheme.bg })
    },
  },

}
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