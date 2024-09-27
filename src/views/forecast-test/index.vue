<template>
  <div class="single-predict">
    <div class="left-menu">
      <div class="part  y-scroll">
        <div class="title"><svg-icon icon-class="part" class-name=""></svg-icon> 场站选择
        </div>
        <div class="content y-scroll">
          <a-radio-group v-model:value="menuForm.site">
            <a-radio v-for="item in menuFormOptions.siteOptions" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="part">
        <div class="title"><svg-icon icon-class="Frame 417" class-name=""></svg-icon> 出力预报 </div>
        <div class="content y-scroll">
          <a-radio-group v-model:value="menuForm.predictType">
            <a-radio v-for="item in menuFormOptions.predictTypeOptions" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div class="predictDetail">
        <a-space size="middle" class="tab-nav">
          <a-space>
            <span>起始时间：</span>
            <a-date-picker v-model:value="form.startTime" placeholder="起始时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
              @change="startTimeChange" />
          </a-space>
          <a-space>
            <span>结束时间：</span>
            <a-date-picker v-model:value="form.endTime" placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
              @change="endTimeChange" />
          </a-space>
          <a-space>
            <span>发报时间：</span>
            <a-select v-model:value="form.sendTime" placeholder="发报时间" style="width: 150px">
              <a-select-option v-for="item in sendTimeOption" :key="item" :value="item">{{ item
              }}</a-select-option>
            </a-select>
          </a-space>
          <a-space size="middle">
            <a-button type="primary" @click="confirmFunc">确认</a-button>
            <a-button type="primary" @click="exportFunc">导出</a-button>
          </a-space>
        </a-space>
        <div class="chart" ref="lineChartDom"></div>
        <div class="dataTableDetail">
          <div class="title" @click="ifShowTable">数据详表</div>
          <a-table v-show="showTable" :columns="columns" align="center" :data-source="dataDetailTableData"
            :pagination="false" :scroll="{ y: 500 }"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { message } from 'ant-design-vue'
import { siteListGet, forecastMeteorologyTypeGet, forecastOutputTypeGet, } from '@/api/common/enums.js'
import { pointResultAndSolarRealGet, solarForecastTestResultTableGet } from '@/api/predict-test/index.js'
import { fbTimesGet } from '@/api/predict-result/index.js'
import { exportSingleChart, elTableExportToImage } from '@/utils/export.js'
import useEnumsStore from '@/store/project/enums'

onMounted(() => {
  ObtainEnums()
})

/* 
  左侧枚举
    1. menuForm: 左侧表单
    2. menuFormOptions: 左侧表单选项
    3. ObtainEnums: 获取左侧表单选项
    4. getSiteType: 获取场站类型
    5. getPredictTypeName: 获取气象数据类型名称
    6. getSiteType: 获取场站lable
*/
const menuForm = reactive({
  site: '',
  // predictElement: '',
  predictType: ''
})
const menuFormOptions = ref({
  siteOptions: [],
  predictTypeOptions: []
})
const ObtainEnums = async function () {
  // 电站列表
  const { code: dzCode, data: dzData } = await siteListGet()
  if (dzCode === 200 && dzData) {
    menuFormOptions.value.siteOptions = dzData.map(item => {
      return {
        label: item.siteName,
        value: item.siteId,
        type: item.siteType,
      }
    })
  }
  // 预报要素
  const { code: ybFeatureCode, data: ybFeatureData } = await forecastMeteorologyTypeGet()
  if (ybFeatureCode === 200 && ybFeatureData) {
    menuFormOptions.value.predictElementOptions = ybFeatureData
  }

  // 预报类型
  menuFormOptions.value.predictTypeOptions = useEnumsStore().allEnums.forecastOutputType
}
const getSiteType = function (value) {
  let type = ''
  menuFormOptions.value.siteOptions.forEach(item => {
    if (item.value === value) {
      type = item.type
    }
  })
  return type
}
const getPredictTypeName = function (value) {
  let name = ''
  menuFormOptions.value.predictTypeOptions.forEach(item => {
    if (item.value === value) {
      name = item.label
    }
  })
  return name
}
const getSiteLabel = function (value) {
  let label = ''
  menuFormOptions.value.siteOptions.forEach(item => {
    if (item.value === value) {
      label = item.label
    }
  })
  return label
}

/* 
  右侧表单: 
    1. form: 参数表单
    2. sendTimeOption: 发报时间选项
    3. getfbTimesOptions: 获取发报时间选项
    4. startTimeChange: 起始时间改变
    5. endTimeChange: 结束时间改变
*/

let form = reactive({
  startTime: null,
  endTime: null,
  sendTime: null
})
let sendTimeOption = ref([])
const getfbTimesOptions = async function () {
  let params = {
    dataForm: 100,
    endTime: form.endTime + ' 23:59:59',
    fbTime: '',
    predictionFactor: null,
    predictionType: menuForm.predictType,
    siteIds: [menuForm.site],
    startTime: form.startTime + ' 00:00:00',
    siteTypeEnum: getSiteType(menuForm.site)
  }
  if (new Date(params.startTime) > new Date(params.endTime)) {
    message.warning('开始时间大于结束时间')
    return
  } else if (!menuForm.predictType) {
    message.warning('出力预报为空')
    return
  } else if (!menuForm.site) {
    message.warning('场站为空')
    return
  } else {
    const { code, data } = await fbTimesGet(params)
    if (code === 200) {
      sendTimeOption.value = data
    }
  }
}
const startTimeChange = function (startTimeValue) {
  if (!form.endTime) {
    // message.warning('结束时间不能为空')
    return
  }
  getfbTimesOptions()
}
const endTimeChange = function (endTimeValue) {
  if (!form.endTime) {
    // message.warning('起始时间不能为空')
    return
  }
  getfbTimesOptions()
}

/* 
  获取数据: 
    1. confirmFunc: 确认查询
    2. exportFunc: 导出
*/
const confirmFunc = async function () {
  const graphParams = {
    dataForm: 100,
    fbTime: form.sendTime,
    predictionFactor: menuForm.predictElement,
    predictionType: menuForm.predictType,
    siteIds: [menuForm.site],
  }
  const { code: graphCode, data: graphData } = await pointResultAndSolarRealGet(graphParams)
  if (graphCode === 200) {
    lineData.value = [
      {
        name: `辐照度${menuForm.predictType}`,
        data: []
      },
      {
        name: `实况辐照度`,
        data: []
      }
    ]
    if (graphData && graphData?.preDataList) {
      for (let index in graphData.preDataList) {
        lineData.value[0].data.push([graphData.preDataList[index].dataTime, graphData.preDataList[index].dataFeatureValue])
      }
    }
    if (graphData && graphData?.realDataList) {
      for (let index in graphData.realDataList) {
        lineData.value[1].data.push([graphData.realDataList[index].dataTime, graphData.realDataList[index].value])
      }
    }
  }

  const tableParams = {
    fbTime: form.sendTime,
    forecastType: menuForm.predictType,
    siteId: menuForm.site,
    dataSourceId: 20
  }
  const { code: tableCode, data: tableData } = await solarForecastTestResultTableGet(tableParams)
  if (tableCode === 200 && tableData) {
    dataDetailTableData.value = []
    for (let i in tableData) {
      dataDetailTableData.value.push({
        time: tableData[i].fbTime,
        dataType: getPredictTypeName(tableData[i].forecastType),
        rootMeanSquareError: tableData[i].rootMeanSquareError,
        averageAbsoluteError: tableData[i].meanAbsoluteError,
        accuracyRate: tableData[i].accuracy,
      })
    }
  }
  nextTick(() => {
    loadLineGraph(lineChartDom.value, lineData.value)
  })
}
const exportFunc = function () {
  let type = menuForm.predictElement ? 'predictElement' : 'predictType'
  let value = menuForm.predictElement ? menuForm.predictElement : menuForm.predictType
  let name = getSiteLabel(menuForm.site) + getExportLabel(type, value)
  // 图
  if (exportChart.value) {
    exportSingleChart(exportChart.value, `${name}折线图`)
  }
  // 表
  if (showTable.value) {
    elTableExportToImage(`${name}表格`)
  }
}



/* 
  图相关: 
    1. exportChart: 导出图时使用
    2. lineData: 折线数据
    3. lineChartDom: 折线dom
    4. loadLineGraph:加载折线图
    5. getExportLabel: 获取图例名称

*/
let exportChart = ref(null)
const lineChartDom = ref(null)
let lineData = ref([])
const loadLineGraph = function (chartDom, data) {
  let option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params) => {
        let content = ''
        params.forEach(item => {
          content += `
                      <div>${item.seriesName}</div>
                      <span>${item.marker} ${item.name}&nbsp;&nbsp;&nbsp; ${item.value[1]}</span>
                  `
        })
        return content
      }
    },
    legend: {
      top: '3%',
      itemWidth: 20,
      itemHeight: 7,
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        fontSize: '10',
        interval: parseInt(data[0].data.length / 10),
        // rotate: 20,
      },
    },
    yAxis: {
      type: 'value',
      position: 'left',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#d9d9d9',
          width: '1'
        }
      }
    },
    series: data.map(function (item) {
      return {
        type: 'line',
        data: item.data,
        name: item.name,
        symbol: 'none',
        smooth: true
      }
    }),
  }
  nextTick(() => {
    chartDom.removeAttribute('_echarts_instance_')
    let dom = echarts.init(chartDom)
    exportChart.value = dom
    dom && dom.setOption(option)
  })
}
const getExportLabel = function (type, value) {
  let name = ''
  if (type === 'predictType') {
    menuFormOptions.value.predictTypeOptions.filter(item => {
      if (item.value === value) {
        name = item.label
      }
    })
  } else {
    menuFormOptions.value.predictElementOptions.forEach(item => {
      if (item.value === value) {
        name = item.label
      }
    })
  }
  return name
}

/* 
  表格相关
    1. showTable:是否展示表格
    2. ifShowTable: 切换是否展示表格
    3. style: 表格样式
    4. watch动态改变表格样式
    5. columns: 表格标题
    6. dataDetailTableData: 表格内容
*/
let showTable = ref(false)
const ifShowTable = function () {
  showTable.value = !showTable.value
}
watch(showTable, (value) => {
  if (!lineData.value || !lineData.value.length) return
  loadLineGraph(lineChartDom.value, lineData.value)
})
// 表格
const columns = [
  { title: '发报时间', dataIndex: 'time', align: 'center' },
  { title: '数据类型', dataIndex: 'dataType', align: 'center' },
  { title: '均方根误差', dataIndex: 'rootMeanSquareError', align: 'center' },
  { title: '平均绝对误差', dataIndex: 'averageAbsoluteError', align: 'center' },
  { title: '准确率', dataIndex: 'accuracyRate', align: 'center' },
];
const dataDetailTableData = ref([]);



</script>

<style scoped lang="scss">
.single-predict {
  width: 100%;
  height: 100%;
  display: flex;

  .left-menu {
    width: 300px;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    .part {
      display: flex;
      flex-direction: column;
      height: 100%;

      &:nth-child(2) {
        height: 240px !important;
        flex-shrink: 0;
      }

      // &:nth-child(3) {
      //   height: 240px !important;
      //   flex-shrink: 0;
      // }

      .title {
        height: 40px;
        display: flex;
        align-items: center;
        font-weight: 16px;
        font-weight: 700;
        background: #EEF9FF;
        color: #1475F8;

        .svg-icon {
          margin: 0 10px;
        }
      }

      .content {
        margin: 10px 0;
        padding: 5px 10px;
        width: 90%;
        overflow-y: auto;
        margin-left: 5%;

        .checkGroup {
          display: grid;
        }

        :deep(.ant-checkbox-group-item) {
          border: 1px solid #cfcfcf;
          padding: 2% 5%;

          &:first-child {
            box-shadow: 0px -2px 1px #447192;
          }
        }

        :deep(.ant-radio-group) {
          display: flex;
          flex-direction: column;

          .ant-radio-wrapper {
            border: 1px solid #cfcfcf;
            padding: 2% 5%;

            &:first-child {
              box-shadow: 0px -2px 1px #447192;
            }
          }
        }
      }
    }
  }

  .right-content {
    width: calc(100% - 30px);
    height: calc(100% - 10px);

    .tab-nav {
      width: 100%;
      display: flex;
      justify-content: center;
      height: 40px;
      width: 100%;
      margin: 5px;
      padding: 5px 10px;
      overflow: hidden;
      background-color: #fff;
    }


    .predictDetail {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .chart {
        width: 100%;
        flex: 1;
      }

      .dataTableDetail {
        width: 100%;
        text-align: center;
        cursor: pointer;
        flex-shrink: 0;

        .title {
          background-color: #168cff;
          font-weight: 700;
          font-size: 1em;
          padding: 0.5%;
          margin: 0 10px;
        }
      }
    }
  }
}

:deep(.ant-table-wrapper) {
  width: calc(100% - 20px);
  margin: 0 10px;
  overflow: hidden;

  .ant-table-body {

    // 滚动条大小
    &::-webkit-scrollbar {
      display: block !important;
      width: 5px !important;
      height: 5px !important;
    }

    // 滚动条轨道
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #efefef;
    }

    // 滚动条滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: var(--tc);
    }

    // 滚动条右下角
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}
</style>