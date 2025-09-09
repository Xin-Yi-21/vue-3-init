<template>
  <div class="integration-echart-vue">
    <div class="normal-view" v-show="!isShowTable.normal">
      <div :id="echartInfo.id"> </div>
      <div class="echart-tool">
        <c-icon i="c-change-view" tip="切换视图" size="16" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleChangeView('normal')"></c-icon>
        <c-icon i="c-copy-text" tip="复制数据" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleCopyData()"></c-icon>
        <c-icon i="c-export-image" tip="导出图片" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportImage()"></c-icon>
        <c-icon i="c-export-excel" tip="导出表格" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportExcel(echartInfo.tableData, { tableName: (echartInfo.exportFileName || '') + '表', tableHeader: echartInfo.tableHeader })"></c-icon>
        <c-icon i="c-fullscreen-in" tip="开启全屏" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleFullscreenIn()"></c-icon>
      </div>
    </div>

    <div class="table-view" v-show="isShowTable.normal">
      <div class="button-part">
        <c-button type="primary" height="30" @click="handleCloseTable('normal')">关闭表格</c-button>
        <c-button type="primary" height="30" @click="handleCloseTableAndRefresh('normal')">关闭并刷新</c-button>
      </div>
      <el-table :data="echartInfo.tableData" border class="c-table">
        <el-table-column :label="item[echartInfo?.tableHeader?.matchField?.nameField]" :prop="item[echartInfo?.tableHeader?.matchField?.fieldField]" align="center" v-for="(item, index) in echartInfo?.tableHeader?.columnList" :key="index" :width="item[echartInfo?.tableHeader?.matchField?.nameField]?.includes('时间') ? '200x' : 'auto'"></el-table-column>
      </el-table>
    </div>

    <el-dialog class="echart-fullscreen-view c-dialog" v-model="isShowFullscreen" :modal-append-to-body="false" align-center :close-on-click-modal="false" :before-close="handleFullscreenOut">
      <div class="normal-view-fs" v-show="!isShowTable.fullscreen">
        <div :id="echartInfoFs.id"> </div>
        <div class="echart-tool-fs">
          <c-icon i="c-change-view" tip="切换视图" size="16" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleChangeView('fullscreen')"></c-icon>
          <c-icon i="c-copy-text" tip="复制数据" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleCopyData()"></c-icon>
          <c-icon i="c-export-image" tip="导出图片" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportImage()"></c-icon>
          <c-icon i="c-export-excel" tip="导出表格" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportExcel(echartInfo.tableData, { tableName: (echartInfo.exportFileName || '') + '表', tableHeader: echartInfo.tableHeader })"></c-icon>
          <c-icon i="c-fullscreen-out" tip="退出全屏" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleFullscreenOut()"></c-icon>
        </div>
      </div>
      <div class="table-view-fs" v-show="isShowTable.fullscreen">
        <div class="button-part">
          <c-button type="primary" height="30" @click="handleCloseTable('fullscreen')">关闭表格</c-button>
          <c-button type="primary" height="30" @click="handleCloseTableAndRefresh('fullscreen')">关闭并刷新</c-button>
        </div>
        <el-table :data="echartInfo.tableData" border class="c-table">
          <el-table-column :label="item[echartInfoFs.tableHeader?.matchField?.nameField]" :prop="item.field" align="center" v-for="(item, index) in echartInfoFs?.tableHeader?.columnList" :key="index" :width="item[echartInfoFs.tableHeader?.matchField?.nameField]?.includes('时间') ? '200x' : 'auto'"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// # 一、综合
import useSettingStore from '@/store/setting'
import { nextTick } from 'vue'
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
          { time: '2024-01-01 12:00:00', temperature: -2, rain: 5, windDirection: 350, windSpeed: 4, humidity: 60, pressure: 1030, },
          { time: '2024-02-01 12:00:00', temperature: 1, rain: 10, windDirection: 350, windSpeed: 4, humidity: 65, pressure: 1030, },
          { time: '2024-03-01 12:00:00', temperature: 8, rain: 20, windDirection: 350, windSpeed: 4, humidity: 70, pressure: 1025, },
          { time: '2024-04-01 12:00:00', temperature: 15, rain: 30, windDirection: 220, windSpeed: 3, humidity: 60, pressure: 1015, },
          { time: '2024-05-01 12:00:00', temperature: 22, rain: 40, windDirection: 220, windSpeed: 3, humidity: 55, pressure: 1010, },
          { time: '2024-06-01 12:00:00', temperature: 28, rain: 80, windDirection: 220, windSpeed: 3, humidity: 65, pressure: 1005, },
          { time: '2024-07-01 12:00:00', temperature: 30, rain: 150, windDirection: 150, windSpeed: 2, humidity: 75, pressure: 1000, },
          { time: '2024-08-01 12:00:00', temperature: 29, rain: 140, windDirection: 150, windSpeed: 2, humidity: 80, pressure: 1005, },
          { time: '2024-09-01 12:00:00', temperature: 25, rain: 60, windDirection: 150, windSpeed: 2, humidity: 70, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 18, rain: 30, windDirection: 300, windSpeed: 4, humidity: 65, pressure: 1015, },
          { time: '2024-11-01 12:00:00', temperature: 10, rain: 20, windDirection: 300, windSpeed: 4, humidity: 60, pressure: 1020, },
          { time: '2024-12-01 12:00:00', temperature: 2, rain: 10, windDirection: 300, windSpeed: 4, humidity: 55, pressure: 1025, },
        ],
        '青岛': [
          { time: '2024-01-01 12:00:00', temperature: 2, rain: 10, windDirection: 320, windSpeed: 5, humidity: 65, pressure: 1020, },
          { time: '2024-02-01 12:00:00', temperature: 4, rain: 15, windDirection: 320, windSpeed: 5, humidity: 70, pressure: 1020, },
          { time: '2024-03-01 12:00:00', temperature: 8, rain: 25, windDirection: 320, windSpeed: 5, humidity: 75, pressure: 1015, },
          { time: '2024-04-01 12:00:00', temperature: 13, rain: 40, windDirection: 210, windSpeed: 4, humidity: 80, pressure: 1015, },
          { time: '2024-05-01 12:00:00', temperature: 18, rain: 50, windDirection: 210, windSpeed: 4, humidity: 80, pressure: 1010, },
          { time: '2024-06-01 12:00:00', temperature: 22, rain: 80, windDirection: 210, windSpeed: 4, humidity: 85, pressure: 1005, },
          { time: '2024-07-01 12:00:00', temperature: 25, rain: 150, windDirection: 180, windSpeed: 3, humidity: 90, pressure: 1000, },
          { time: '2024-08-01 12:00:00', temperature: 26, rain: 140, windDirection: 180, windSpeed: 3, humidity: 90, pressure: 1005, },
          { time: '2024-09-01 12:00:00', temperature: 23, rain: 70, windDirection: 180, windSpeed: 3, humidity: 85, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 18, rain: 40, windDirection: 310, windSpeed: 4, humidity: 80, pressure: 1015, },
          { time: '2024-11-01 12:00:00', temperature: 12, rain: 30, windDirection: 310, windSpeed: 4, humidity: 75, pressure: 1020, },
          { time: '2024-12-01 12:00:00', temperature: 5, rain: 20, windDirection: 310, windSpeed: 4, humidity: 70, pressure: 1020, },
        ]
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
const echartInfo = ref({ id: 'integration-echart', exportFileName: '折线-柱状' })
const echartInfoFs = ref({ id: 'integration-echart-fs', exportFileName: '折线-柱状' })
async function getEchartInfo() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleEchartInfo()
}
// ^
// # 2、处理echart数据
function handleEchartInfo() {
  let newApiData = JSON.parse(JSON.stringify(apiData.value || {}))
  let chart = { dataRender: 'datasetObj', }
  // 创建系列头
  let factor = [
    { name: '气温', fieldT: 'temperature', fieldN: 'temperature', unit: '℃', type: 'line', yAxisIndex: 0 },
    { name: '降水', fieldT: 'rain', fieldN: 'rain', unit: 'mm', type: 'bar', yAxisIndex: 1 }
  ]
  let kind = [{ name: '济南', fieldT: '济南', fieldN: 'jn' }, { name: '青岛', fieldT: '青岛', fieldN: 'qd' }]
  let xHeader = { nameC: '时间', nameT: '时间', fieldT: 'time', fieldN: 'time', unit: '', }
  proxy.$makeChartSeries(chart, newApiData, { factor, kind, xHeader, sortType: 'fk' })

  // 完善数据
  proxy.$completeChartData(chart, newApiData, (rowItem, matchData, k) => {
    chart.tableHeader.columnList.forEach(item => { if (item?.kind?.fieldT == k) { rowItem[item.fieldN] = matchData[item.fieldT] } })
  },)

  // 配置系列体
  let lineSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  let barSeriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  chart.sData.forEach((item, index) => {
    let color = chart.color[index]
    let addOption = {
      itemStyle: { borderColor: color, color: item.type === 'bar' ? color : '#fff' },
      lineStyle: { color: color },
    }
    let seriesOption = item.type === 'line' ? lineSeriesOption : item.type === 'bar' ? barSeriesOption : {}
    chart.sData[index] = proxy.$merge({}, seriesOption, addOption, item)
  })
  // 全局赋值
  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  echartInfoFs.value = Object.assign({}, echartInfoFs.value, chart)
  // console.log('集成图', echartInfo.value)
  nextTick(() => { initEchart() })
}
// ^
// # 3、渲染echart
function initEchart() {
  let lineOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let addOption = {
    title: { text: '折线-柱状图' },
    xAxis: [{ axisLabel: { formatter: (value) => { const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'; return time } }, }],
    yAxis: [{ name: '气温 ( ℃ )', }, { name: '降水 ( mm )', ...lineOption.yAxis[0] }],
    dataset: echartInfo.value.datasetObj,
    series: echartInfo.value.sData,
  }
  let option = proxy.$merge({}, lineOption, addOption)
  proxy.$initEchart(echartInfo, option)
}
function initEchartFs() {
  let lineOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let dataZoomOption = proxy.$getDataZoomEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let addOption = {
    title: { text: '折线-柱状图' },
    grid: { top: 90 },
    xAxis: [{ axisLabel: { formatter: (value) => { const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'; return time } }, }],
    yAxis: [{ name: '气温 ( ℃ )', }, { name: '降水 ( mm )', ...lineOption.yAxis[0] }],
    dataset: echartInfoFs.value.datasetObj,
    series: echartInfoFs.value.sData,
  }
  let option = proxy.$merge({}, lineOption, dataZoomOption, addOption)
  proxy.$initEchart(echartInfoFs, option)
}
// ^
// # 4、工具栏操作
// # (1) 切换视图
const isShowTable = ref({ normal: false, fullscreen: false })
function handleChangeView(type) {
  if (type === 'normal') {
    isShowTable.value.normal = !isShowTable.value.normal
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = !isShowTable.value.fullscreen
  }
}
function handleCloseTable(type) {
  if (type === 'normal') {
    isShowTable.value.normal = false
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = false
  }
}
function handleCloseTableAndRefresh(type) {
  if (type === 'normal') {
    isShowTable.value.normal = false
    proxy.$destroyEchart(echartInfo)
    nextTick(() => initEchart())
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = false
    proxy.$destroyEchart(echartInfoFs)
    nextTick(() => initEchartFs())
  }
}
// ^
// # (2) 复制数据
function handleCopyData() {
  const tableHeader = echartInfo.value.tableHeader
  const tableData = echartInfo.value.tableData
  // 判断字符的长度
  function getCharLength(str) {
    let length = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i)
      // 中文字符占3个单位长度
      if (/[\u4e00-\u9fa5]/.test(char)) { length += 3 }
      // 数字或字母占2个单位长度
      else if (/[a-zA-Z0-9]/.test(char)) { length += 2 }
      // 其他字符占1个单位长度
      else { length += 1 }
    }
    return length
  }
  // 获取表头的字段
  const headers = tableHeader.columnList.map(header => header[tableHeader.matchField.nameField] || header.nameT)
  const fields = tableHeader.columnList.map(header => header[tableHeader.matchField.fieldField] || header.fieldN)
  // 计算每列的最大宽度（字符数）
  const columnWidths = tableHeader.columnList.map((header, index) => {
    // 先计算表头的宽度
    let maxLength = getCharLength(header.nameT)
    // 然后计算数据行中的最大宽度
    tableData.forEach(row => {
      const field = fields[index]
      const value = row[field] !== undefined ? String(row[field]) : ''
      maxLength = Math.max(maxLength, getCharLength(value))
    })
    return maxLength
  })
  // 定义右侧间隔（每列右侧添加10个空格）
  const rightSpacing = 10
  // 创建表头行
  const headerRow = headers.map((header, index) => {
    const padding = ' '.repeat(columnWidths[index] + rightSpacing - getCharLength(header))
    return header + padding
  }).join('')
  // 生成表格数据行
  const dataRows = tableData.map(row => {
    return fields.map((field, index) => {
      const value = row[field] !== undefined ? String(row[field]) : ''
      const padding = ' '.repeat(columnWidths[index] + rightSpacing - getCharLength(value))
      return value + padding
    }).join('')
  })
  // 合并表头和数据行
  const tableText = [headerRow, ...dataRows].join('\n')
  // 复制到剪贴板
  navigator.clipboard.writeText(tableText)
    .then(() => { proxy.$message.success('数据已复制到粘贴板！') })
    .catch(err => { proxy.$message.error('数据复制失败！') })
}
// ^
// # (3) 导出图片
function handleExportImage() {
  let exportFileName = (echartInfo.value.exportFileName || '') + '图'
  proxy.$exportEchartImage(echartInfo.value.instance, { name: exportFileName, type: 'png', pixelRatio: 10, backgroundColor: settingStore.theme.echartCssV.bg })
}
// ^
// # (4) 导出表格
function handleExportExcel(tableData, tableOption) {
  proxy.$exportExcel(tableData, tableOption)
}
// ^
// # (5) 开启全屏
const isShowFullscreen = ref(false)
function handleFullscreenIn() {
  isShowFullscreen.value = true
  nextTick(() => { initEchartFs() })
}
function handleFullscreenOut() {
  isShowFullscreen.value = false
  proxy.$destroyEchart(echartInfoFs)
}
// ^
// ^
// ^

// # 三、生命周期
init()
const timer = ref(null)
timer.value = setInterval(() => { init() }, 60000)
onBeforeUnmount(() => {
  clearInterval(timer.value)
  proxy.$destroyEchart(echartInfo)
  proxy.$destroyEchart(echartInfoFs)
})
watch(() => settingStore.themeStyle, (nv, ov) => {
  nextTick(() => { initEchart() })
})
// ^
</script>

<style lang="scss" scoped>
.integration-echart-vue {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  color: var(--fcp);

  .normal-view {
    width: 100%;
    height: 100%;

    #integration-echart {
      width: 100%;
      height: 100%;
    }

    .echart-tool {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      align-items: center;

      height: 30px;
      padding: 0 10px;
      border-radius: 4px;
      z-index: 99;

      .c-icon {
        margin: 0 10px;
        font-size: 12px;
      }
    }
  }

  .table-view {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    background-color: var(--bg-card);

    .button-part {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 30px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  :deep(.echart-fullscreen-view) {
    width: 90vw;
    height: 70vh;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: var(--bg-card);

      .normal-view-fs {
        width: 100%;
        height: 100%;

        #integration-echart-fs {
          width: 100%;
          height: 100%;
        }

        .echart-tool-fs {
          position: absolute;
          top: 15px;
          right: 10px;
          display: flex;
          align-items: center;

          height: 30px;
          padding: 0 10px;
          border-radius: 4px;
          z-index: 99;

          .c-icon {
            margin: 0 10px;
            font-size: 12px;
          }
        }
      }

      .table-view-fs {
        width: 100%;
        height: 100%;
        padding: 10px 0;
        background-color: var(--bg-card);

        .button-part {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 30px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>