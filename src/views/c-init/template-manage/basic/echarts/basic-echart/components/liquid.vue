<template>
  <div class="liquid-vue">
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="$store.state.setting.themeColor" :hoverColor="$theme['--tc']" showType="el" @click="handleExportEchart()"></c-icon>
    <div id="liquid-echart"> </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill'
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
      let chartDom = document.getElementById('liquid-echart')
      if (!chartDom) return
      chartDom && chartDom.removeAttribute('_echarts_instance_')
      let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
      let option = {
        title: { text: '水球图', top: 5, left: 'center', textStyle: { color: this.$echartTheme.fcp, fontWeight: 'bold', fontSize: 14 }, },
        series: [
          {
            type: "liquidFill",
            radius: "70%",
            center: ["50%", "52%"],
            data: [(this.echartInfo.ratio / 100), (this.echartInfo.ratio / 100)],       // 设置波浪高度
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