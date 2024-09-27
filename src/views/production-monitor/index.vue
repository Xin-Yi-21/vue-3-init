<template>
  <div class="production-monitor-vue">
    <ForecastColumn @initDone="isDataInitDone = true" @getData="getData" ref="fcRef"></ForecastColumn>
    <!-- <A></A> -->
    <div class="right-part">
      <div class="data-detail">
        <div class="right-part-title">数据详情</div>
        <div class="data-detail-content">
          <div class="c-row">
            <div class="c-column cw-1/3">
              <div class="c-label">数据名称：</div>
              <div class="c-content">{{ dataDetail.dataName }}</div>
            </div>
            <div class="c-column cw-1/3">
              <div class="c-label">空间范围：</div>
              <div class="c-content">{{ dataDetail.spatialExtent }}</div>
            </div>
            <div class="c-column cw-1/3">
              <div class="c-label">时间范围：</div>
              <div class="c-content">{{ dataDetail.timeExtent }}</div>
            </div>
          </div>
          <div class="c-row">
            <div class="c-column cw-1/3">
              <div class="c-label">数据格式：</div>
              <div class="c-content">{{ dataDetail.dataFormat }}</div>
            </div>
            <div class="c-column cw-1/3">
              <div class="c-label">数据来源：</div>
              <div class="c-content">{{ dataDetail.dataSource }}</div>
            </div>
            <div class="c-column cw-1/3">
              <div class="c-label">服务器位置：</div>
              <div class="c-content">{{ dataDetail.dataStorePath }}</div>
            </div>
          </div>
          <div class="c-row">
            <div class="c-column cw-1/3">
              <div class="c-label">更新频率：</div>
              <div class="c-content">{{ dataDetail.updateFrequency }}</div>
            </div>

            <div class="c-column cw-1/3">
              <div class="c-label">业务支撑：</div>
              <div class="c-content">{{ dataDetail.businessSupport }}</div>
            </div>
            <div class="c-column cw-1/3">
              <div class="c-label">负责人/联系方式：</div>
              <div class="c-content">{{ dataDetail.header }} / {{ dataDetail.contact }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ratio-stat">
        <div class="right-part-title">到报率统计</div>
        <div class="right-part-content">
          <div class="left-echart">
            <span class="echart-title">近7天到报率统计</span>
            <div id="week-echart"></div>
          </div>
          <div class="right-echart">
            <span class="echart-title">近30天到报率统计</span>
            <div id="month-echart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ForecastColumn from './components/ForecastColumn'
import A from './components/index'
import * as echarts from 'echarts'
import { dataDetailGet, ratioStatGet } from '@/api/production-monitor/index'
const { proxy } = getCurrentInstance()
// 一、初始化相关
const fcRef = ref(null)
const isDataInitDone = ref(false)
watch(isDataInitDone, (nv, ov) => {
  nv && init()
})
// 0、初始化总调用
function init() {
  nextTick(() => {
    getData(fcRef.value.form)
  })
}
// 1、获取数据
function getData(searchCondition) {
  getDataDetail(searchCondition)
  getEchartData(searchCondition)
}
// 2、获取数据详情
const dataDetail = ref({})
async function getDataDetail(searchCondition) {
  // console.log('查searchCondition', searchCondition)
  let params = {
    ybModel: searchCondition.forecastModelType,        // 预报模式
    ybFileType: searchCondition.forecastFileType,  // 预报文件类型
    ybFeature: searchCondition.forecastMeteorologyType,   // 预报要素（气象资源）
    ybOutput: searchCondition.forecastOutputType   // 预报出力类型
  }
  params.ybModel === 'REGION' && (delete params.ybFileType, delete params.ybFeature, delete params.ybOutput)
  params.ybFileType === 'POWER' && delete params.ybFeature
  params.ybFileType === 'QX' && delete params.ybOutput

  // console.log('查params', params)
  const res = await dataDetailGet(params)
  let dataDetailV = {}
  res.code === 200 && (dataDetailV = res.data)
  dataDetail.value = dataDetailV
  // console.log('查dataDetail', dataDetail.value)
}

// 3、echart
// (1) 获取echart数据
const echartWeekInfo = ref({ isNoData: false, instance: null, apiData: null, data: null })
const echartMonthInfo = ref({ isNoData: false, instance: null, apiData: null, data: null })
async function getEchartData(searchCondition) {
  getWeekEchartData(searchCondition)
  getMonthEchartData(searchCondition)
}
// 获取 近7天 ehcart数据
async function getWeekEchartData(searchCondition) {
  let params = {
    siteId: searchCondition.site,
    ybModel: searchCondition.forecastModelType,
    ybFileType: searchCondition.forecastFileType,
    ybFeature: searchCondition.forecastMeteorologyType,
    ybOutPut: searchCondition.forecastOutputType,
    startTime: proxy.$dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00'),
    endTime: proxy.$dayjs().format('YYYY-MM-DD 23:59:59'),
  }
  const res = await ratioStatGet(params)
  let apiData = []
  res.code === 200 && (apiData = res.data)
  echartWeekInfo.apiData = apiData
  handleEchartData('week')
}
// 获取 近30天 echart数据
async function getMonthEchartData(searchCondition) {
  let params = {
    siteId: searchCondition.site,
    ybModel: searchCondition.forecastModelType,
    ybFileType: searchCondition.forecastFileType,
    ybFeature: searchCondition.forecastMeteorologyType,
    ybOutPut: searchCondition.forecastOutputType,
    startTime: proxy.$dayjs().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'),
    endTime: proxy.$dayjs().format('YYYY-MM-DD 23:59:59'),
  }
  const res = await ratioStatGet(params)
  let apiData = []
  res.code === 200 && (apiData = res.data)
  echartMonthInfo.apiData = apiData
  handleEchartData('month')
}

// (2) 处理echart数据
function handleEchartData(type) {
  let apiData = {}
  if (type === 'week') {
    apiData = echartWeekInfo.apiData
  } else if (type === 'month') {
    apiData = echartMonthInfo.apiData
  }
  let sArr = []
  // 配置渲染数据
  let categoryLRV = {
    'jsl': { label: '及时率', color: '#43F3CA' },
    'ysl': { label: '延时率', color: '#ffa033' },
    'qcl': { label: '缺测率', color: '#ff4d4f' },
  }
  sArr = [
    {
      name: type === 'week' ? '近7天到报率统计' : '近30天到报率统计',
      type: 'pie',
      radius: '50%',
      data: [
        { value: apiData.normalRatio, name: categoryLRV['jsl'].label, itemStyle: { color: categoryLRV['jsl'].color } },
        { value: apiData.delayRatio, name: categoryLRV['ysl'].label, itemStyle: { color: categoryLRV['ysl'].color } },
        { value: apiData.missRatio, name: categoryLRV['qcl'].label, itemStyle: { color: categoryLRV['qcl'].color } },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
  if (type === 'week') {
    echartWeekInfo.value.data = { sArr }
  } else if (type === 'month') {
    echartMonthInfo.value.data = { sArr }
  }
  nextTick(() => { initEchart(type) })
}
// (3) 初始化echart
function initEchart(type) {
  if (type === 'week') {
    if (echartWeekInfo.value.instance?.length > 0) {
      echartWeekInfo.value.instance.clear()
      echartWeekInfo.value.instance.dipose()
    }
  } else if (type === 'month') {
    if (echartMonthInfo.value.instance?.length > 0) {
      echartMonthInfo.value.instance.clear()
      echartMonthInfo.value.instance.dipose()
    }
  }
  let chartDom = document.getElementById(type === 'week' ? 'week-echart' : 'month-echart')
  chartDom.removeAttribute("_echarts_instance_")
  // let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  if (type === 'week') {
    echartWeekInfo.value.instance = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  } else if (type === 'month') {
    echartMonthInfo.value.instance = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
  }
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: true,
      top: 20,
      padding: [0, 0],
      itemGap: 20,
      itemWidth: 30,
      textStyle: { fontSize: 14, color: '#333' },
    },
    grid: {
      top: '35',
      left: '30',
      right: '30',
      bottom: '10',
      containLabel: true
    },
    series: type === 'week' ? echartWeekInfo.value.data?.sArr : echartMonthInfo.value.data?.sArr,
  }
  // option && myChart.setOption(option, true)
  if (type === 'week') {
    option && echartWeekInfo.value.instance.setOption(option, true)
  } else if (type === 'month') {
    option && echartMonthInfo.value.instance.setOption(option, true)
  }
  // window.addEventListener('resize', () => { myChart.resize() })
}
// // 2、ehcart
// // (1) 获取echart数据
// const echartInfo = ref({ isNoData: false, instance: null, apiData: null, data: null })
// async function getEchartData(searchCondition) {
//   let echartDataI = [{ field: '1' }, { field: '2' }]
//   echartInfo.value.apiData = echartDataI
//   let params = {
//     ybModel: searchCondition.forecastModelType,
//     ybFeature: searchCondition.forecastMeteorologyType,
//     ybType: searchCondition.forecastOutputType,
//     startTime: proxy.$dayjs().format('YYYY-MM-DD 00:00:00'),
//     endTime: proxy.$dayjs().add(6, 'day').format('YYYY-MM-DD 23:59:59'),
//     siteId: searchCondition.site,
//   }
//   const res = await ratioStatGet(params)
//   let apiData = []
//   res.code === 200 && (apiData = res.data)
//   echartInfo.apiData = apiData
//   // console.log('查echart数据', echartInfo.apiData)
//   handleEchartData()
// }
// // (2) 处理echart数据
// function handleEchartData() {
//   // console.log('zou1',)
//   let apiData = echartInfo.apiData
//   let common = {
//     type: 'line',
//     symbol: 'circle',
//     symbolSize: 6,
//     emphasis: { scale: 1.5 },
//     connectNulls: true,
//     smooth: 0.5,
//   }
//   let lData = []
//   let xData = []
//   let yData = { ysl: [], jsl: [], qcl: [] }
//   let sArr = []
//   // 获取图例
//   lData = ['及时率', '延时率', '缺测率']
//   apiData.forEach(item => {
//     // 获取x轴数据
//     xData.push(item.time)
//     // 获取y轴数据
//     yData.jsl.push(item.normalRatio)
//     yData.ysl.push(item.delayRatio)
//     yData.qcl.push(item.missRatio)
//   })
//   // 配置渲染数据
//   let categoryLRV = {
//     'jsl': { label: '及时率', color: '#43F3CA' },
//     'ysl': { label: '延时率', color: '#ffa033' },
//     'qcl': { label: '缺测率', color: '#ff4d4f' },
//   }
//   for (var k in categoryLRV) {
//     let sArrItem = {
//       ...common,
//       name: categoryLRV[k].label,
//       itemStyle: { color: categoryLRV[k].color, borderWidth: 0, borderColor: categoryLRV[k].color, },
//       data: yData[k]
//     }
//     sArr.push(sArrItem)
//   }
//   echartInfo.value.data = { lData, xData, yData, sArr, }
//   nextTick(() => { initEchart() })
// }
// // (3) 初始化echart
// function initEchart() {
//   // if (echartInfo.value.instance?.length > 0) {
//   //   echartInfo.value.instance.clear()
//   //   echartInfo.value.instance.dipose()
//   // }
//   let chartDom = document.getElementById('ratio-stat-echart')
//   let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
//   // echartInfo.value.instance = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom)
//   let option = {
//     tooltip: {
//       trigger: 'axis',
//       confine: true,
//       padding: [0, 0],
//       formatter: (params) => {
//         let start = `<div class="c-echart-tooltip">
//                             <div class="tooltip-title">${params[0].name}</div>
//                             <div class="tooltip-content">
//                         `
//         let end = `</div></div>`
//         let content = ''
//         params.forEach(item => {
//           let text = `<div class="content-item">
//                              <div class="item-cycle" style="background: ${item.borderColor}"></div>
//                              <div class="item-text">
//                                   <div class="text-left">${item.seriesName}</div>
//                                   <div class="text-right">${item.data === '' ? '暂无数据' : item.data && item.data.toFixed(2) + '%'}</div>
//                              </div>
//                           </div>`
//           content = content + text
//         })
//         return start + content + end
//       }
//     },
//     legend: {
//       show: true,
//       top: '0',
//       padding: [0, 0],
//       itemGap: 20,
//       itemWidth: 30,
//       textStyle: { fontSize: 14, color: '#333' },
//     },
//     grid: {
//       top: '35',
//       left: '30',
//       right: '30',
//       bottom: '10',
//       containLabel: true
//     },
//     xAxis: [
//       {
//         type: 'category',
//         axisLine: { lineStyle: { color: '#efefef' } },
//         axisLabel: { color: '#333', interval: 'auto', formatter: (value, index) => { let str1 = value.slice(0, 10); let str2 = value.slice(10); return str1 + '\n' + str2 }, },
//         axisTick: { show: false },
//         data: echartInfo.value.data?.xData,
//       }
//     ],
//     yAxis: {
//       type: 'value',
//       name: '( % )',
//       nameGap: 4,
//       max: 100,
//       nameTextStyle: { color: '#333', fontFamily: "Alibaba PuHuiTi", fontSize: 12, fontWeight: 400, padding: [0, 0, 0, 10], },
//       axisLine: { show: true, lineStyle: { color: '#efefef' } },
//       splitLine: { show: true, lineStyle: { color: '#efefef', type: 'dashed' } },
//       axisLabel: { color: '#333' },
//       axisTick: { show: false },
//     },
//     series: echartInfo.value.data?.sArr,
//   }
//   option && myChart.setOption(option, true)
//   window.addEventListener('resize', () => { myChart.resize() })
// }
</script>

<style scoped lang="scss">
.production-monitor-vue {
  height: 100%;
  display: flex;
  overflow: hidden;

  .right-part {
    width: calc(100% - 320px);
    height: calc(100% - 20px);
    margin: 10px;

    .right-part-title {
      font-size: 18px;
      color: #333333;
      font-weight: 700;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }


    .data-detail {
      height: 190px;
      margin-bottom: 10px;
      background-color: #fff;
      border: 1px solid #CDD0D4;
      border-radius: 10px 10px 10px 10px;
      overflow: hidden;

      .c-row {
        margin-bottom: 14px;

        .c-column {
          padding-right: 10px;
        }
      }

      .c-label {
        width: 150px;
        font-weight: normal;
      }

      .c-content {
        border: 1px solid #CDD0D4;
        height: 30px;
        border-radius: 4px;
        line-height: 28px;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .ratio-stat {
      height: calc(100% - 200px);
      background-color: #fff;
      border: 1px solid #CDD0D4;
      border-radius: 10px 10px 10px 10px;
      overflow: hidden;

      .right-part-content {
        width: 100%;
        height: calc(100% - 40px);
        display: flex;

        .echart-title {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          font-weight: 700;
        }

        .left-echart {
          width: 50%;
          height: 100%;
          position: relative;

          #week-echart {
            width: 100%;
            height: 100%;
          }
        }

        .right-echart {
          width: 50%;
          height: 100%;
          position: relative;

          #month-echart {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
