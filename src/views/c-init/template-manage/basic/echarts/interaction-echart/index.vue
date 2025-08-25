<template>
  <div class="interaction-echart-vue">
    <div class="v-operate">
      <div class="left">
        <el-form :model="form" ref="formRef">
          <el-form-item label="调整方式：" style="width:300px;margin:0;">
            <el-radio-group v-model="form.adjustWay" @change="handleChangeAdjustWay">
              <el-radio v-for="(item, index) of enums.adjustWay" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="修改方式：" prop="field" style="width:240px;margin:0;">
            <el-radio-group v-model="form.updateWay" @change="">
              <el-radio v-for="(item, index) of enums.updateWay" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="调整数值" prop="updateValue" v-if="form.updateWay === 'value'">
            <el-input-number v-model="form.updateValue" controls-position="right"></el-input-number><span class="unit">mm</span>
          </el-form-item>
          <el-form-item label="调整比例" prop="updateRatio" v-if="form.updateWay == 'percentage'">
            <el-input-number v-model="form.updateRatio" controls-position="right"></el-input-number> <span class="unit">%</span>
          </el-form-item>
        </el-form>
        <div class="up-down-button">
          <el-button @click="handleOperation('increase')">提升</el-button>
          <el-button @click="handleOperation('decrease')">降低</el-button>
          <el-button @click="handleOperation('assign')">赋值</el-button>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>

    <div class="c-result">
      <div class="left">
        <div id="v-echart"></div>
      </div>
      <div class="right">
        <el-table :data="echartInfo.tableData" border class="c-table c-table-update" :stripe="false">
          <el-table-column label="时间" prop="time" align="center" width="180">
            <template #="scope"> {{ $dayjs(scope.row.time).format('YYYY-MM-DD HH:mm:ss') }} </template>
          </el-table-column>
          <el-table-column :label="item.nameT" :prop="item.fieldN" align="center" v-for="(item, index) in echartInfo?.tableHeader?.columnList?.slice(1)" :key="index">
            <template #="scope">
              <el-form class="only-validate-form" :model="scope.row" :rules="formRules" :ref="`columnRef-${index}-${scope.$index}`" @submit.native.prevent>
                <el-form-item label="" :prop="item.fieldN" :rules="formRules.rain">
                  <el-input type="text" class="fit-table-cell" v-model="scope.row[item.fieldN]" placeholder="" @change="(value) => handleChangeTableValue(value, scope.row, index, scope.$index)"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup>
// # 一、综合
import * as echarts from 'echarts'
import _ from 'lodash'
import { nonNegativeNumberVerify } from '@/utils/verify.js'
import useSettingStore from '@/store/setting'
import { onMounted } from 'vue'
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
          { time: '2024-01-01 12:00:00', temperature: 1, rain: 10, windDirection: 350, windSpeed: 4, humidity: 70, pressure: 1030, },
          { time: '2024-04-01 12:00:00', temperature: 10, rain: 30, windDirection: 220, windSpeed: 3, humidity: 50, pressure: 1015, },
          { time: '2024-07-01 12:00:00', temperature: 25, rain: 120, windDirection: 150, windSpeed: 2, humidity: 80, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 15, rain: 40, windDirection: 300, windSpeed: 4, humidity: 60, pressure: 1025, },
        ],
        '青岛': [
          { time: '2024-01-01 12:00:00', temperature: 5, rain: 20, windDirection: 320, windSpeed: 5, humidity: 70, pressure: 1020, },
          { time: '2024-04-01 12:00:00', temperature: 15, rain: 40, windDirection: 210, windSpeed: 4, humidity: 75, pressure: 1015, },
          { time: '2024-07-01 12:00:00', temperature: 22, rain: 180, windDirection: 180, windSpeed: 3, humidity: 85, pressure: 1010, },
          { time: '2024-10-01 12:00:00', temperature: 16, rain: 50, windDirection: 310, windSpeed: 4, humidity: 70, pressure: 1020, },
        ],
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
  getEnums()
  setDefaultParams()
  getData()
}
// ^

// # 1、获取枚举
const enums = ref({})
function getEnums() {
  let adjustWay = [{ label: '选点调整', value: 'point' }, { label: '选区调整', value: 'area' },]
  let updateWay = [{ label: '数值', value: 'value' }, { label: '比例', value: 'percentage' },]
  enums.value.adjustWay = adjustWay
  enums.value.updateWay = updateWay
}
// ^

// # 2、设置默认参数
const form = ref({})
const formRules = ref({ rain: [{ validator: nonNegativeNumberVerify, trigger: 'blur' },], },)
const currentEchartOperate = ref('')
function setDefaultParams() {
  form.value.adjustWay = enums.value.adjustWay[0].value
  form.value.updateWay = enums.value.updateWay[0].value
  currentEchartOperate.value = 'mySingle'
}
// ^

// # 3、获取数据
const apiData = ref({})
const initData = ref([])
async function getData() {
  const res = await echartDataGet()
  apiData.value = res.data || {}
  handleData(apiData.value || [],)
}
// ^

// # 4、处理数据
const echartInfo = ref({ id: 'v-echart', exportFileName: '交互' })
function handleData(data) {
  let newApiData = JSON.parse(JSON.stringify(data || {}))
  let chart = { lData: [], sData: [], tableData: [], tableHeader: {}, color: proxy.$getEchartSeriesColor(), dataRender: 'xyData', }
  // 创建系列头
  let factor = [{ name: '降水', fieldT: 'rain', fieldN: 'rain', unit: 'mm', type: 'line', },]
  let kind = [{ name: '济南', fieldT: '济南', fieldN: 'jn' }, { name: '青岛', fieldT: '青岛', fieldN: 'qd' }]
  let xHeader = { nameC: '时间', nameT: '时间', fieldT: 'time', fieldN: 'time', unit: '', }
  proxy.$makeChartSeries(chart, newApiData, { factor, kind, xHeader, sortType: 'fk' })

  // 完善数据
  proxy.$completeChartData(chart, newApiData, (rowItem, matchData, k) => {
    chart.tableHeader.columnList.forEach(item => { if (item?.kind?.fieldT == k) { rowItem[item.fieldN] = matchData[item.fieldT] } })
  },)

  // 配置系列体
  let seriesOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'include', optionList: ['series'] })?.series[0] || {}
  chart.sData.forEach((item, index) => {
    let color = chart.color[index]
    let addOption = {
      itemStyle: { borderColor: color, },
      lineStyle: { color: color },
      symbolSize: 4,
      data: chart.xyData[item.id]
    }
    chart.sData[index] = proxy.$merge({}, seriesOption, addOption, item)
  })

  // 全局赋值

  echartInfo.value = Object.assign({}, echartInfo.value, chart)
  initData.value = proxy.$deepClone(echartInfo.value)
  nextTick(() => { initEchart() })
}
function handleToEchart() {
  echartInfo.value.tableData.forEach((item1, index1) => {
    for (var k in echartInfo.value.xyData) {
      echartInfo.value.xyData[k][index1].value[1] = item1[k]
    }
  })
  for (var k in echartInfo.value.xyData) {
    echartInfo.value.sData.forEach(item1 => { if (item1.id === k) { item1.data = echartInfo.value.xyData[k] } })
  }
  initEchart()
}
function handleToTable() {
  echartInfo.value.tableData.forEach((item1, index1) => {
    for (var k in echartInfo.value.xyData) {
      item1[k] = echartInfo.value.xyData[k]?.[index1]?.value?.[1] || ''
    }
  })
}
// ^

// # 5、渲染echart
const fxPoints = ref([])
const selectedAreas = ref([])   // 选取调整：选中的区域
const selectedData = ref([])    // 选中的数据
// # (1) 渲染echart
function initEchart() {
  let lineOption = proxy.$getLineEchartOption({ echartInfo, settingStore, getType: 'exclude', optionList: ['series'] }) || {}
  let addOption = {
    title: { text: '折线图' },
    toolbox: {
      show: true,
      top: 10,
      right: 20,
      feature: {
        // 单选
        mySingle: {
          show: form.value.adjustWay === 'point',
          title: '单选',
          icon: 'path://M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m0-170.666667c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333333 85.333333 38.4 85.333333 85.333333-38.4 85.333333-85.333333 85.333333z',
          iconStyle: handleEchartIconStyle('mySingle'),
          emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
          onclick: (e) => { handleEchartPointToolboxClick(e, 'mySingle',) }
        },
        // 多选
        myMultiple: {
          show: form.value.adjustWay === 'point',
          title: '多选',
          icon: 'path://M727.984 393.184a31.968 31.968 0 0 0-45.248 0.256L449.44 629.248l-103.28-106.112a32 32 0 1 0-45.888 44.608l126.032 129.504c0.048 0.096 0.192 0.096 0.256 0.192 0.064 0.064 0.096 0.192 0.16 0.256 2.016 1.984 4.512 3.2 6.88 4.544 1.248 0.672 2.24 1.792 3.52 2.304a31.728 31.728 0 0 0 24.064 0.064c1.232-0.512 2.208-1.536 3.392-2.176 2.4-1.344 4.896-2.528 6.944-4.544 0.064-0.064 0.096-0.192 0.192-0.256 0.064-0.096 0.16-0.128 0.256-0.192l256.224-259.008a32 32 0 0 0-0.224-45.248zM832.992 928h-640c-52.928 0-96-43.072-96-96V192c0-52.928 43.072-96 96-96h640c52.928 0 96 43.072 96 96v640c0 52.928-43.056 96-96 96z m-640-768c-17.632 0-32 14.368-32 32v640c0 17.664 14.368 32 32 32h640a32 32 0 0 0 32-32V192c0-17.632-14.336-32-32-32h-640z',
          iconStyle: handleEchartIconStyle('myMultiple'),
          emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
          onclick: (e) => { handleEchartPointToolboxClick(e, 'myMultiple') }
        },
        // 全选
        mySelectAll: {
          show: form.value.adjustWay === 'point',
          title: '全选',
          icon: 'path://M182.886 337.92a26.624 26.624 0 0 0 19.661 7.885h1.331a27.75 27.75 0 0 0 19.15-7.885l138.034-138.342a26.42 26.42 0 0 0 7.578-18.842 26.112 26.112 0 0 0-7.885-18.74 26.522 26.522 0 0 0-36.659 0l-120.73 121.038-55.5-55.501a26.42 26.42 0 0 0-18.74-7.885 26.112 26.112 0 0 0-18.739 7.885 27.136 27.136 0 0 0-7.987 18.739 26.112 26.112 0 0 0 7.885 18.74z m319.693-51.2h385.229a33.382 33.382 0 1 0 0-66.867H502.579a32.973 32.973 0 0 0-23.552 9.625 32.358 32.358 0 0 0-10.24 23.552 33.69 33.69 0 0 0 33.792 33.69zM324.813 424.038L203.878 545.075l-55.5-55.5a26.42 26.42 0 0 0-18.74-8.295 25.395 25.395 0 0 0-18.739 7.885 27.136 27.136 0 0 0-7.885 18.739 26.112 26.112 0 0 0 7.885 18.74l72.5 72.498a27.34 27.34 0 0 0 20.48 7.885h0.921a27.443 27.443 0 0 0 19.251-7.885L361.984 461.62a27.136 27.136 0 0 0 7.885-18.739 26.112 26.112 0 0 0-7.885-18.74 27.546 27.546 0 0 0-37.171-0.102z m177.766 132.813h385.229a33.382 33.382 0 1 0 0-66.867H502.579a32.973 32.973 0 0 0-23.552 9.626 32.358 32.358 0 0 0-10.24 23.552 33.69 33.69 0 0 0 33.792 33.69zM324.301 686.08L203.264 807.117l-55.398-55.501a26.42 26.42 0 0 0-18.74-7.885 26.112 26.112 0 0 0-18.739 7.885 27.136 27.136 0 0 0-7.987 18.842 26.112 26.112 0 0 0 7.885 18.739l72.499 72.499a28.16 28.16 0 0 0 19.66 7.885h2.356a25.395 25.395 0 0 0 18.74-7.885l137.83-138.035a27.136 27.136 0 0 0 7.884-18.74 26.112 26.112 0 0 0-7.884-18.841 28.467 28.467 0 0 0-37.07 0z m592.691 90.522a34.816 34.816 0 0 0-29.286-16.59h-385.23a32.973 32.973 0 0 0-23.551 9.626 33.69 33.69 0 0 0 24.064 57.242h384.717a34.816 34.816 0 0 0 29.286-16.589 33.075 33.075 0 0 0 0-33.69z',
          iconStyle: handleEchartIconStyle('mySelectAll'),
          emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
          onclick: (e) => { handleEchartPointToolboxClick(e, 'mySelectAll') }
        },
        // 反选
        mySelectInvert: {
          show: form.value.adjustWay === 'point',
          title: '反选',
          icon: 'path://M832 448a64 64 0 0 1 64 64v320a64 64 0 0 1-64 64H512a64 64 0 0 1-64-64V512a64 64 0 0 1 64-64h320z m-576.448 218.496L256 672V832h96a32 32 0 0 1 31.488 26.24L384 864a32 32 0 0 1-26.24 31.488L352 896h-128a32 32 0 0 1-31.488-26.24L192 864v-114.816l-41.344 41.472a32 32 0 0 1-40.832 3.648l-4.48-3.648a32 32 0 0 1-3.648-40.832l3.648-4.48 96-96a32 32 0 0 1 54.208 17.152zM832 512H512v320h320V512z m-9.344 73.344a32 32 0 0 1 3.648 40.832l-3.648 4.48-128 128a32 32 0 0 1-35.456 6.656l-4.928-2.688-96-64a32 32 0 0 1 30.4-56l5.12 2.752 74.112 49.408 109.44-109.44a32 32 0 0 1 45.312 0zM512 128a64 64 0 0 1 64 64v192H512V192H192v320h192v64H192a64 64 0 0 1-64-64V192a64 64 0 0 1 64-64h320z m288-0.064a32 32 0 0 1 31.488 26.24L832 160v114.816l41.344-41.472a32 32 0 0 1 40.832-3.648l4.48 3.648a32 32 0 0 1 3.648 40.832l-3.648 4.48-96 96a32 32 0 0 1-54.208-17.152L768 351.936v-160h-96a32 32 0 0 1-31.488-26.24L640 159.936a32 32 0 0 1 26.24-31.488L672 128h128z',
          iconStyle: handleEchartIconStyle('mySelectInvert'),
          emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
          onclick: (e) => { handleEchartPointToolboxClick(e, 'mySelectInvert') }
        },
        // // 单点拖拽
        // mySingleDrag: {
        //   show: form.value.adjustWay === 'point',
        //   title: '单点拖拽',
        //   icon: 'path://M446.27027 710.227027v-132.843243H79.567568v-130.767568h366.702702V314.118919H260.843243L512 0l251.156757 314.118919h-185.081081v132.497297H944.432432v130.767568H578.075676v132.843243h185.081081L512 1024l-251.156757-313.772973z m65.72973 286.097297l215.178378-269.145946h-166.4v-167.091892H927.135135v-96.172972H560.778378V296.821622h166.4L512 27.675676 296.821622 296.821622h166.745946v167.091892H96.864865v96.172972h366.702703v167.091892H296.821622z',
        //   iconStyle: handleEchartIconStyle('mySingleDrag'),
        //   emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
        //   onclick: (e) => { handleEchartPointToolboxClick(e, 'mySingleDrag') }
        // },
        // 清除
        myClear: {
          show: form.value.adjustWay === 'point',
          title: '清除选择',
          icon: 'path://M512 104.489796c230.838857 0 417.959184 187.120327 417.959184 417.959184s-187.120327 417.959184-417.959184 417.959183S94.040816 753.287837 94.040816 522.44898 281.161143 104.489796 512 104.489796z m0 83.591837C327.324735 188.081633 177.632653 337.773714 177.632653 522.44898s149.692082 334.367347 334.367347 334.367347 334.367347-149.692082 334.367347-334.367347S696.675265 188.081633 512 188.081633z m-103.444898 171.82302l103.444898 103.444898 103.444898-103.444898a20.897959 20.897959 0 0 1 29.549714 0l29.549715 29.549714a20.897959 20.897959 0 0 1 0 29.549715L571.141224 522.44898l103.444898 103.444898a20.897959 20.897959 0 0 1 0 29.549714l-29.570612 29.549714a20.897959 20.897959 0 0 1-29.549714 0L512 581.548408l-103.444898 103.444898a20.897959 20.897959 0 0 1-29.549714 0l-29.549715-29.549714a20.897959 20.897959 0 0 1 0-29.549714l103.444898-103.444898-103.444898-103.444898a20.897959 20.897959 0 0 1 0-29.549715l29.549715-29.549714a20.897959 20.897959 0 0 1 29.549714 0z',
          iconStyle: handleEchartIconStyle('myClear'),
          emphasis: { iconStyle: handleEchartIconStyle('emphasis'), },
          onclick: (e) => { handleEchartPointToolboxClick(e, 'myClear') }
        },
      }
    },
    xAxis: [{ axisLabel: { formatter: (value) => { const time = value ? proxy.$dayjs(value).format('MM-DD HH:mm') : '?'; return time } }, }],
    yAxis: [{ name: '气温 ( ℃ )', },],
    series: echartInfo.value.sData,
  }
  let option = proxy.$merge({}, lineOption, addOption)
  if (form.value.adjustWay === 'point') {
    proxy.$initEchart(echartInfo, option)
    handleEchartPointClick()
  } else if (form.value.adjustWay === 'area') {
    option.brush = {
      toolbox: ['rect', 'lineX', 'lineY', 'clear'],
      right: 20,
      xAxisIndex: 0,
      throttleType: 'deounce',
      throttleDelay: 1000,
    }
    proxy.$initEchart(echartInfo, option)
    handleEchartBrush()
  }
}
// ^
// # (2) echart 选点调整
// # A. echart 选点工具栏 点击
function handleEchartPointToolboxClick(e, type) {
  if (type !== 'myClear') {
    currentEchartOperate.value = type
    const toolbox = echartInfo.value.instance.getOption()?.toolbox[0].feature
    // 工具栏高亮
    for (const k in toolbox) {
      if (toolbox.hasOwnProperty(k)) {
        if (k === type && k !== 'myClear') {
          toolbox[k].iconStyle = { color: settingStore.theme.themeColor, borderColor: settingStore.theme.themeColor, }
        } else {
          toolbox[k].iconStyle = { color: settingStore.theme.echartTheme.bcp, borderColor: settingStore.theme.echartTheme.bcp }
        }
      }
    }
    initEchart()
  }

  // 工具栏点击
  switch (type) {
    case 'mySingle':
      selectedData.value = []
      handleEchartHighlight()
      break
    case 'myMultiple':
      selectedData.value = []
      handleEchartHighlight()
      break
    case 'mySelectAll':
      selectedData.value = []
      for (var k in echartInfo.value.xyData) {
        echartInfo.value.xyData[k].forEach(item => {
          selectedData.value.push({ value: item.value, seriesId: k })
        })
      }
      handleSelectedData()
      break
    case 'mySelectInvert':
      selectedData.value = []
      handleEchartHighlight()
      break
    case 'mySingleDrag':
      selectedData.value = []
      handleEchartDrag(echartInfo.value.instance)
      break
    case 'myClear':
      selectedData.value = []
      handleEchartHighlight()
      break
  }
}
// ^
// # B. echart 选点 点击
function handleEchartPointClick() {
  const myChart = echartInfo.value.instance
  myChart.on('click', e => {
    let clickedPoint = { value: e.value, seriesId: e.seriesId, }
    switch (currentEchartOperate.value) {
      case 'mySingle':
        if (JSON.stringify([clickedPoint]) == JSON.stringify(selectedData.value)) { clickedPoint = null }
        selectedData.value = clickedPoint ? [clickedPoint] : []
        handleSelectedData()
        break
      case 'myMultiple':
        var index = selectedData.value.findIndex(item => JSON.stringify(clickedPoint) == JSON.stringify(item))
        if (index != -1) {
          selectedData.value.splice(index, 1)
        } else {
          selectedData.value.push(clickedPoint)
        }
        handleSelectedData()
        break
      case 'mySelectInvert':
        var index = fxPoints.value.findIndex(item => JSON.stringify(clickedPoint) == JSON.stringify(item))
        if (index != -1) {
          fxPoints.value.splice(index, 1)
        } else {
          fxPoints.value.push(clickedPoint)
        }
        handleSelectedData()
        break
    }
  })
}
// ^
// # C. echart 选点工具栏 设置echartIcon颜色
function handleEchartIconStyle(iconName) {
  if ((iconName === 'emphasis' || iconName === currentEchartOperate.value) && iconName !== 'myClear') {
    return { color: settingStore.themeColor, borderColor: settingStore.themeColor }
  } else {
    return { color: settingStore.theme.echartTheme.bcp, borderColor: settingStore.theme.echartTheme.bcp }
  }
}
// ^
// ^
// # (3) echart 选区调整
const isBrushed = ref(false)
function handleEchartBrush() {
  let newIsBrushed = false
  const myChart = echartInfo.value.instance
  myChart.on('brushSelected', e => {
    selectedAreas.value = []
    selectedData.value = []
    e.batch.forEach(batchItem => {
      if (batchItem.areas.length === 0) {
        handleEchartHighlight()
      } else {
        batchItem.areas.forEach(areaItem => {
          // console.log('查areaItem.brushType', areaItem.brushType)
          let rangeItem = {}
          switch (areaItem.brushType) {
            case 'rect':
              // areaItem.coordRange : [ [ x最小索引 , x最小索引 ] , [ y最小值 , y最小值 ] ],
              // areaItem.range : [ [ x最小像素 , x最小像素 ] , [ y最小像素 , y最大像素 ] ] 
              handleSelectedXIndex(areaItem?.coordRange[0], areaItem?.range[0])
              var xMin = areaItem?.coordRange[0][0]
              var xMax = areaItem?.coordRange[0][1]
              var yMin = areaItem?.coordRange[1][0]
              var yMax = areaItem?.coordRange[1][1]
              rangeItem = { xMin, xMax, yMin, yMax }
              // brushedInfo = { brushType: 'rect', xMin, xMax, yMin, yMax, yMinPX: areaItem.range[1][1], yMaxPX: areaItem.range[1][0] }
              break
            case 'lineX':
              handleSelectedXIndex(areaItem?.coordRange, areaItem?.range)
              var xMin = areaItem?.coordRange[0]
              var xMax = areaItem?.coordRange[1]
              var yMin = -Infinity
              var yMax = Infinity
              rangeItem = { xMin, xMax, yMin, yMax }
              // brushedInfo = { brushType: 'lineX', xMin, xMax, yMin, yMax }
              break
            case 'lineY':
              var xMin = -Infinity
              var xMax = Infinity
              var yMin = areaItem?.coordRange[0]
              var yMax = areaItem?.coordRange[1]
              rangeItem = { xMin, xMax, yMin, yMax }
              // brushedInfo = { brushType: 'lineY', xMin, xMax, yMin, yMax, yMinPX: areaItem.range[1][1], yMaxPX: areaItem.range[1][0] }
              break
          }
          selectedAreas.value.push(rangeItem)
        })
      }
    })
    handleSelectedData()

    // 处理x轴选中范围
    function handleSelectedXIndex(coordRange, range, xAxisIndex = 0) {
      let startPointPixel = myChart.convertToPixel({ xAxisIndex: xAxisIndex }, coordRange[0])      // 初始最小索引对应像素
      let endPointPixel = myChart.convertToPixel({ xAxisIndex: xAxisIndex }, coordRange[1])        // 初始最大索引对应像素
      // 选中区域最小像素 > 初始最小索引对应像素 : 最小索引 + 1
      if (range[0] > startPointPixel) {
        coordRange[0] = coordRange[0] + 1
      }
      // 选中区域最大像素 < 初始最大索引对应像素 : 最大索引 - 1
      if (range[1] < endPointPixel) {
        coordRange[1] = coordRange[1] - 1
      }
      // 如选中区域无点，则 最大索引 < 最小索引，
    }
    newIsBrushed = e.batch[0]?.areas.length > 0
    isBrushed.value = newIsBrushed
  })

  // 监听 dataZoom 事件 
  myChart.on('dataZoom', _.debounce(e => {
    if (isBrushed.value) {
      myChart.dispatchAction({ type: 'brush', areas: [] })
      proxy.$message.warning('监测到缩放，请重新选择折线图数据进行修正！');
    }
  }, 500))
}
// ^
// # (4) echart 选中数据
function handleSelectedData() {
  let newSelectedData = []
  let xyData = JSON.parse(JSON.stringify(echartInfo.value.xyData))
  switch (form.value.adjustWay) {
    // 选点调整
    case 'point':
      if (currentEchartOperate.value == 'mySelectInvert') {      // 反选
        for (var k in xyData) {
          let filteredData = xyData[k].filter((item1, index1) => {
            return !fxPoints.value.some(item2 => item1.value[0] == item2.value[0] && k === item2.seriesId)
          })
          filteredData.forEach(item => item.seriesId = k)
          newSelectedData = newSelectedData.concat(filteredData)
        }
        selectedData.value = newSelectedData
      } else {
        // selectedData.value = selectedData.value
      }
      handleEchartHighlight()
      break
    case 'area':
      let newSelectedAreas = selectedAreas.value
      for (var k in xyData) {
        let filteredData = xyData[k].filter((item1, index1) => {
          return newSelectedAreas.some(item2 => {
            return index1 >= item2.xMin && index1 <= item2.xMax && item1.value[1] >= item2.yMin && item1.value[1] <= item2.yMax
          })
        })
        filteredData.forEach(item => item.seriesId = k)
        newSelectedData = newSelectedData.concat(filteredData)
      }
      selectedData.value = newSelectedData
      handleEchartHighlight(echartInfo.value.instance)
      break
  }
}
// ^
// # (5) echart 选中高亮
function handleEchartHighlight(myChart) {
  // 修改xyData
  var xyData = echartInfo.value.xyData
  for (var k in xyData) {
    xyData[k].forEach(item1 => {
      delete item1.itemStyle
      selectedData.value.forEach(item2 => {
        if (item2.seriesId === k && item1.value[0] == item2.value[0] && item1.value[1] == item2.value[1]) {
          item1.itemStyle = { color: 'red', borderColor: 'red' }
        }
      })
    })
  }
  // 同步修改sData
  var sData = echartInfo.value.sData
  for (var k in xyData) {
    sData.forEach(item1 => { if (item1.id === k) { item1.data = xyData[k] } })
  }
  echartInfo.value.instance.setOption({ series: sData })
}
// ^
// # (6) echart 运算
function handleOperation(type) {
  if (selectedData.value.length === 0) {
    return proxy.$message.warning('检测到当前并无选中数据，请选择某数据进行修改！')
  }
  let xyData = echartInfo.value.xyData
  if (!form.value.updateValue) { form.value.updateValue = 0 }
  if (!form.value.updateRatio) { form.value.updateRatio = 0 }
  for (var k in xyData) {
    xyData[k].forEach((item1, index) => {
      selectedData.value.forEach(item2 => {
        if (item2.seriesId === k && item1.value[0] == item2.value[0] && item1.value[1] == item2.value[1]) {
          // 数值调整
          // 提升
          if (type === 'increase' && form.value.updateWay === 'value') {
            item2.value[1] = item1.value[1] = proxy.$accurate(item1.value[1] + form.value.updateValue, 3, false)
          }
          // 降低
          if (type === 'decrease' && form.value.updateWay === 'value') {
            item2.value[1] = item1.value[1] = proxy.$accurate(item1.value[1] - form.value.updateValue, 3, false)
          }
          // 赋值
          if (type === 'assign' && form.value.updateWay === 'value') {
            item2.value[1] = item1.value[1] = proxy.$accurate(form.value.updateValue, 3, false)
          }
          // 比例调整
          // 提升
          if (type === 'increase' && form.value.updateWay === 'percentage') {
            item2.value[1] = item1.value[1] = proxy.$accurate(item1.value[1] * (1 + form.value.updateRatio / 100), 3, false)
          }
          // 降低
          if (type === 'decrease' && form.value.updateWay === 'percentage') {
            item2.value[1] = item1.value[1] = proxy.$accurate(item1.value[1] * (1 - form.value.updateRatio / 100), 3, false)
          }
          // 赋值
          if (type === 'assign' && form.value.updateWay === 'percentage') {
            item2.value[1] = item1.value[1] = proxy.$accurate(item1.value[1] * (form.value.updateRatio / 100), 3, false)
          }
        }
      })
    })
  }
  handleSelectedData()
  handleToTable()
}
// ^
// # (7) echart 拖拽
function handleEchartDrag(myChart) {
  let data = []
  for (var k in this.echartInfo.xyData) { data.push(...this.echartInfo.xyData[k]) }
  let lLength = this.echartInfo.lData.length
  let xLength = this.echartInfo.xData.length
  // 设置图形元素，允许每个折线的数据点进行拖拽
  myChart.setOption({
    graphic: echarts.util.map(data, (item, dataIndex) => {
      var lineIndex = Math.floor(dataIndex / xLength)     // 确定是属于哪条折线
      var pos = myChart.convertToPixel('grid', item.value) // 获取转换后的坐标
      return {
        type: 'circle',
        x: pos[0],
        y: pos[1],
        shape: { r: 4 },
        position: myChart.convertToPixel('grid', item.value),
        invisible: true,
        draggable: true,
        ondrag: echarts.util.curry(onPointDragging, dataIndex, lineIndex),  // 拖拽时处理
        // ondrag: _.debounce(echarts.util.curry(onPointDragging, dataIndex, lineIndex), 1000), // 拖拽时处理
        onmousemove: echarts.util.curry(showTooltip, dataIndex, xLength),
        onmouseout: echarts.util.curry(hideTooltip, dataIndex, xLength),
        z: 100
      }
    }),

  })
  // myChart.setOption({
  //   tooltip: {
  //     // 表示不使用默认的“显示”“隐藏”触发规则。
  //     triggerOn: 'none',
  //     formatter: function (params) {
  //       return (
  //         'X: ' +
  //         params.data[0].toFixed(2) +
  //         '<br>Y: ' +
  //         params.data[1].toFixed(2)
  //       );
  //     }
  //   }
  // })
  // 响应拖拽事件，更新数据
  function onPointDragging(dataIndex, lineIndex, dx, dy) {
    console.log('查ABBC',)
    // 获取当前拖拽点的新位置
    var newPosition = myChart.convertFromPixel('grid', [this.x, this.y]);
    var newY = newPosition[1]
    // 更新对应折线的数据，只修改 Y 坐标
    data[dataIndex][1] = newY.toFixed(2)
    // 更新图表数据
    var updateSData = []
    for (var i = 0; i < lLength; i++) {
      updateSData.push({
        id: 'line' + (i + 1),
        type: 'line',
        smooth: true,
        symbolSize: 4,
        data: data.slice(i * xLength, (i + 1) * xLength),
      })
    }
    myChart.setOption({ series: updateSData })
    // 获取更新后的echart数据
    var newSData = myChart.getOption().series
    var xyData = {}
    newSData.forEach(item1 => { xyData[item1.name] = item1.data })
    console.log('查newSData', newSData)
    this.$nextTick(() => {
      this.handleMData(xyData, 'echart')
      this.handleTableData(this.mData)
    })
  }
  // 显示提示框
  function showTooltip(dataIndex, xLength) {
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: Math.floor(dataIndex / xLength),
      dataIndex: dataIndex % xLength
    })
  }
  // 隐藏提示框
  function hideTooltip() {
    myChart.dispatchAction({ type: 'hideTip' })
  }
  // 监听窗口大小调整
  window.addEventListener('resize', function () {
    myChart.setOption({
      graphic: echarts.util.map(data, function (item, dataIndex) {
        var pos = myChart.convertToPixel('grid', item)
        return { x: pos[0], y: pos[1] }               // 更新 x 和 y 坐标
      })
    })
  })
}
// ^
// ^

// # 6、操作相关
// # (1) 修改调整方式
function handleChangeAdjustWay() {
  if (form.value.adjustWay === 'point') { currentEchartOperate.value = 'mySingle' }
  selectedAreas.value = []
  selectedData.value = []
  initEchart()
}
// ^
// # (2) 表格修改功率
function handleChangeTableValue(value, rowItem, columnIndex, rowIndex) {
  nextTick(() => {
    const columnRef = proxy.$refs[`columnRef-${columnIndex}-${rowIndex}`]
    columnRef && columnRef[0] && columnRef[0].validate((valid) => {
      if (!valid) return proxy.$message.warning('数据格式为数字，请检查数据格式！')
      handleToEchart()
    })
  })
}
// ^
// # (3) 保存
function handleSave() {
  proxy.$confirm('确定保存已修改的数据吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    let changedData = []
    initData.value.tableData.forEach((item1, index1) => {
      const item2 = echartInfo.value.tableData[index1]
      if (item2 && Object.keys(item1).some(key => item1[key] != item2[key])) {
        changedData.push(item2)
      }
    })
    if (changedData.length === 0) { return proxy.$message.warning('检测到当前无数据更改！') }
    // dataCorrect(params).then(res => {
    //   if (res.code === 200) {
    //     this.$message.success('数据修改成功！')
    //     this.getData()
    //   }
    // })
  }).catch((error) => { proxy.$message.warning('保存出现问题，请稍后再试！') })
}
// # (4) 取消
function handleCancel() {
  proxy.$confirm('确定取消已修改的数据吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    init()
  }).catch(() => { this.$message.warning('已取消还原！') })
}
// ^
// ^
// ^
// ^

// # 三、生命周期
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  proxy.$destroyEchart(echartInfo)
})
watch(() => settingStore.themeStyle, (nv, ov) => {
  nextTick(() => { initEchart() })
})
// ^
</script>


<style lang="scss" scoped>
.interaction-echart-vue {
  height: 100%;
  position: relative;

  .v-operate {
    display: flex;
    width: 100%;
    height: 60px;
    margin: 0 0 10px;
    padding: 0 10px;
    background-color: var(--bg-card);
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px 4px 4px 4px;

    .left {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;

      :deep(.el-form) {
        display: flex;
        align-items: center;
        height: 100%;

        .el-form-item {
          display: flex;
          margin: 0 20px 0 0;

          .el-form-item__label {
            flex-shrink: 0;
            padding-right: 10px;
            width: 100px;
          }

          .el-form-item__content {
            flex-grow: 1;
            min-width: 80px;

            .el-input {
              width: 100%;
            }

            .el-select {
              width: 100%;
            }
          }
        }

        .el-radio-group {
          .el-radio {
            margin-right: 15px;

            .el-radio__label {
              padding-left: 5px;
            }
          }
        }

        .el-input-number {
          width: 120px;

          .el-input-number__increase,
          .el-input-number__decrease {
            height: 50%;
          }
        }
      }

      .unit {
        padding-left: 5px;
      }

      .up-down-button {
        margin-left: 10px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      width: 200px;
      height: 100%;
    }
  }

  .c-result {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 70px);
    border-radius: 4px;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
    margin: 0;

    .left {
      width: calc(100% - 400px);
      height: 100%;
      position: relative;

      #v-echart {
        width: 100%;
        height: 100%;
      }
    }

    .right {
      width: 400px;
      height: 100%;
      border-left: 1px solid #ccc;
      padding: 10px 0;

      .el-table {
        width: calc(100% - 20px);
        height: calc(100% - 0px);
        margin: 0 10px;
      }
    }
  }
}
</style>
