<template>
  <div class="single-predict">
    <div class="left-menu">
      <div class="part y-scroll">
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
      <div class="part y-scroll">
        <div class="title"><svg-icon icon-class="Frame 417" class-name=""></svg-icon> 出力预报 </div>
        <div class="content">
          <a-radio-group v-model:value="menuForm.predictType">
            <a-radio v-for="item in menuFormOptions.predictTypeOptions" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="right-content">
      <a-space size="middle" class="tab-nav">
        <a-button type="primary" @click="changeTab('overviewResult')">结果概览</a-button>
        <a-button type="primary" @click="changeTab('predictDetail')">预测详情</a-button>
      </a-space>
      <div class="overViewResult" v-if="activeKey === 'overviewResult'">
        <div id="map"></div>
        <a-space size="middle" class="tab-nav">
          <a-space>
            <span>起始时间：</span>
            <a-date-picker v-model:value="mapAreaForm.startTime" placeholder="起始时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" @change="mapStartTimeChange" />
          </a-space>
          <a-space>
            <span>结束时间：</span>
            <a-date-picker v-model:value="mapAreaForm.endTime" placeholder="结束时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" @change="mapEndTimeChange" />
          </a-space>
          <a-space>
            <span>发报时间：</span>
            <a-select v-model:value="mapAreaForm.sendTime" placeholder="发报时间" style="width: 150px">
              <a-select-option v-for="item in mapSendTimeOption" :key="item" :value="item">{{ item
              }}</a-select-option>
            </a-select>
          </a-space>
          <a-space size="middle">
            <a-button type="primary" @click="confirmFunc('overview')">确认</a-button>
          </a-space>
        </a-space>
        <div class="timerBox">
          <div class="svgIcon">
            <svg-icon icon-class="left" @click="decreaseTimer"></svg-icon>
            <svg-icon icon-class="bofangzanting" @click="startPlay" v-if="ifPlay"></svg-icon>
            <svg-icon icon-class="broadcast" @click="endPlay" v-else></svg-icon>
            <svg-icon icon-class="right" @click="addTimer"></svg-icon>
          </div>
          <a-slider v-model:value="currentTime" :marks="marks" dots :step="step * 2" class="timer"
            :tooltipOpen="isShowTooltip" :tip-formatter="formatter"></a-slider>
        </div>
      </div>
      <div class="predictDetail" v-else>
        <a-space size="middle" class="tab-nav">
          <a-space>
            <span>起始时间：</span>
            <a-date-picker v-model:value="predictDetailForm.startTime" placeholder="起始时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" @change="startTimeChange" />
          </a-space>
          <a-space>
            <span>结束时间：</span>
            <a-date-picker v-model:value="predictDetailForm.endTime" placeholder="结束时间" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" @change="endTimeChange" />
          </a-space>
          <a-space>
            <span>发报时间：</span>
            <a-select v-model:value="predictDetailForm.sendTime" placeholder="发报时间" style="width: 150px">
              <a-select-option v-for="item in sendTimeOption" :key="item" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-space>
          <a-space size="middle">
            <a-button type="primary" @click="confirmFunc('detail')">确认</a-button>
            <a-button type="primary" @click="exportFunc">导出</a-button>
          </a-space>
        </a-space>
        <div class="chart" ref="lineChartDom"></div>
        <div class="dataTableDetail">
          <div class="title" @click="ifShowTable">数据详表</div>
          <a-table v-show="showTable" :columns="columns" align="center" :data-source="dataDetailTableData"
            :pagination="false" :scroll="{ y: 300 }"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import L from 'leaflet'
import { ref, reactive, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { message } from 'ant-design-vue'
import { siteListGet, forecastOutputTypeGet, } from '@/api/common/enums.js'
import { preDataByFbTimeGet, fbTimesGet } from '@/api/predict-result/index.js'
import { exportSingleChart, elTableExportToImage } from '@/utils/export.js'
import useEnumsStore from '@/store/project/enums'
onMounted(() => {
  initMap()
  ObtainEnums()
})

/* 
    左侧枚举: 
        1. menuForm: 左侧菜单form
        2. menuFormOptions: 左侧菜单form各个字段对应的选项
        3. ObtainEnums: 获取左侧菜单form各个字段对应的选项
        4. watch用来清空其他选项
        5. getSiteType: 获取场站类型
        6. getSiteLabel: 获取场站名称
        7. getClTypeLabel: 获取出力预报名称
*/
const menuForm = reactive({
  site: '',
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
        lon: item.lon,
        lat: item.lat
      }
    })
  }
  // 出力类型
  menuFormOptions.value.predictTypeOptions = useEnumsStore().allEnums.forecastOutputType
}
watch(() => menuForm.site, (value) => {
  if (value) {
    if (activeKey.value === 'overviewResult') {
      getfbTimesOptions('overview', mapAreaForm)
    } else {
      getfbTimesOptions('detail', predictDetailForm)
    }
  }
})
watch(() => menuForm.predictType, (value) => {
  if (value) {
    if (activeKey.value === 'overviewResult') {
      getfbTimesOptions('overview', mapAreaForm)
    } else {
      getfbTimesOptions('detail', predictDetailForm)
    }
  }
})
const getSiteType = function (value) {
  let type = ''
  menuFormOptions.value.siteOptions.forEach(item => {
    if (item.value === value) {
      type = item.type
    }
  })
  return type
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
const getClTypeLabel = function (value) {
  let label = ''
  menuFormOptions.value.predictTypeOptions.forEach(item => {
    if (item.value === value) {
      label = item.label
    }
  })
  return label
}
/* 
    切换单点预报和区域预报)的tab
        1. activeKey: 当前的tab: overviewResult单点
        2. changeTab: 切换tab的方法
*/
let activeKey = ref('overviewResult')
const changeTab = function (tabValue) {
  activeKey.value = tabValue
  if (tabValue === 'overviewResult') {
    nextTick(() => {
      initMap()
    })
  } else {
    if (backInfo.value) {
      confirmFunc('detail')
    }
  }
}

/* 
    地图相关: 
        1. map: 地图
        2. markerLayerGroup: 站点图层
        3. addMarker: 添加站点的方法
        4. addMarkerInfo: 给站点添加弹窗
*/
let map, markerLayerGroup
const initMap = function () {
  const url = "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
  const baseLayer = L.tileLayer(url, {});
  markerLayerGroup = L.layerGroup()
  map = L.map("map", {
    layers: [baseLayer, markerLayerGroup],
    center: [36.7, 117],
    zoom: 8,
    attributionControl: false,
    zoomControl: false,
  });
}
/* 
  @description: 添加标记图层
    @param {Array} coordiateArr: 坐标构成的二维数组
    @param {String} popup: popup内容
*/
const addMarker = function (coordiateArr, popup) {
  if (markerLayerGroup.getLayers() && markerLayerGroup.getLayers().length) {
    markerLayerGroup.clearLayers()
  }
  for (let i in coordiateArr) {
    L.marker(coordiateArr[i], {
      icon: L.icon({
        iconUrl: getSiteType(menuForm.site) === 'SOLAR' ? 'guangfudianzhan.png' : 'fengji.png',
        iconSize: [30, 30],
      })
    }).bindPopup(`${popup}`).addTo(markerLayerGroup).openPopup()
  }
  map.flyTo(coordiateArr[0], 8)
}
const addMarkerInfo = function (timer) {
  let coor = []
  menuFormOptions.value.siteOptions.map(item => {
    if (item.value === menuForm.site) {
      coor.push([item.lon, item.lat])
    }
  })
  // <p>超短期预测出力: ${backInfo.value?.dataFeatureValue}MW</p>
  let currentContent = backInfo.value.filter(item => item.dataTime.includes(timer))
  let popupContent = `
    <p>经纬度: ${coor[0][1]}, ${coor[0][0]}</p>
    <p>${getClTypeLabel(menuForm.predictType)}预报: ${currentContent[0]?.dataFeatureValue ? currentContent[0]?.dataFeatureValue + 'MW' : '暂无数据'} </p>
  `
  let siteType = getSiteType(menuForm.site)
  if (siteType === 'SOLAR') {
    popupContent += ` <p>太阳辐射: ${currentContent[0]?.irr ? currentContent[0]?.irr + 'MW' : '暂无数据'} </p>`
  } else {
    popupContent += ` 
      <p>轮毂高度: ${currentContent[0]?.windsHup ? currentContent[0]?.windsHup + 'm' : '暂无数据'} </p>
      <p>10m风速: ${currentContent[0]?.winds10 ? currentContent[0]?.winds10 + 'm/s' : '暂无数据'} </p>
      <p>70m风速: ${currentContent[0]?.winds70 ? currentContent[0]?.winds70 + 'm/s' : '暂无数据'} </p>
    `
  }
  addMarker(coor, popupContent)
}

/* 
    地图下方的表单
        1. mapAreaForm: 结果概览 的 form
        2. mapSendTimeOption: 结果概览form中的发报时间的选项
        3. mapStartTimeChange: 起始时间变化(获取发报时间)
        4. mapEndTimeChange: 结束时间变化(获取发报时间)
*/
let mapAreaForm = reactive({
  endTime: '',
  startTime: '',
  sendTime: '',
})
let mapSendTimeOption = ref([])
const mapStartTimeChange = function (value) {
  if (!mapAreaForm.endTime) {
    // message.warning('结束时间不能为空')
    return
  }
  getfbTimesOptions('overview', mapAreaForm)
}
const mapEndTimeChange = function (value) {
  if (!mapAreaForm.endTime) {
    // message.warning('结束时间不能为空')
    return
  }
  getfbTimesOptions('overview', mapAreaForm)
}

/* 
    时间轴: 
        1. currentTime: 当前的预报时间
        2. step: 步
        3. marks: 标记
        4. formatter:　时间轴tooltip
        4. addTimer: 日期往右的方法
        5. decreaseTimer: 日期往左的方法
        6. watch用于切换预报时间时改变popup内容
*/
let currentTime = ref(0)
let step = ref(10)
let marks = ref({});
let isShowTooltip = ref(false)
let timer = ref(null)
const formatter = value => {
  return `${marks.value[value]}`;
};
const addTimer = function () {
  let index = Object.keys(marks.value).map(item => Number(item)).indexOf(currentTime.value)
  if (currentTime.value < 100) {
    currentTime.value = Number(Object.keys(marks.value).sort((a, b) => a - b)[index + 1])
  } else {
    currentTime.value = 0
  }
}
const decreaseTimer = function () {
  let index = Object.keys(marks.value).map(item => Number(item)).indexOf(currentTime.value)
  if (index > 0 && index < Number(Object.keys(marks.value).length)) {
    currentTime.value = Number(Object.keys(marks.value)[index - 1])
  }
}
let ifPlay = ref(false)
const startPlay = function () {
  ifPlay.value = true
  if (!marks.value || !Object.keys(marks.value).length) return
  if (timer.value) {
    clearInterval(timer.value)
  } else {
    timer.value = setInterval(() => {
      addTimer()
    }, 2000)
  }
}
const endPlay = function () {
  ifPlay.value = false
  if (timer.value) {
    clearInterval(timer.value)
  }
}
watch(currentTime, (value) => {
  addMarkerInfo(marks.value[`${value}`])
})

/* 
    预测详情的表单: 
        1. predictDetailForm: 预测详情的表单
        2. sendTimeOption: 预测详情的表单中的发报时间的选项
        3. getfbTimesOptions 获取预测详情的表单中的发报时间的选项
        4. startTimeChange: 起始时间变化(获取发报时间)
        5. endTimeChange: 结束时间变化(获取发报时间)
*/
let predictDetailForm = reactive({
  startTime: null,
  endTime: null,
  sendTime: null
})
let sendTimeOption = ref([])
const getfbTimesOptions = async function (page, form) {
  let params = {
    dataForm: 100,
    endTime: form.endTime + ' 23:59:59',
    fbTime: '',
    predictionType: menuForm.predictType,
    siteIds: [menuForm.site],
    startTime: form.startTime + ' 00:00:00',
    siteTypeEnum: getSiteType(menuForm.site)
  }
  if (params.startTime === ' 00:00:00' || params.endTime === ' 23:59:59') {
    // message.warning('开始时间和结束时间不可为空')
    return
  } else if (new Date(params.startTime) > new Date(params.endTime)) {
    // message.warning('开始时间大于结束时间')
    return
  } else if (!menuForm.site) {
    // message.warning('场站为空')
    return
  } else {
    const { code, data } = await fbTimesGet(params)
    if (code === 200) {
      if (page === 'overview') {
        mapSendTimeOption.value = data
      } else {
        sendTimeOption.value = data
      }
    }
  }
}

const startTimeChange = function (startTimeValue) {
  if (!predictDetailForm.endTime) {
    // message.warning('结束时间不能为空')
    return
  }
  getfbTimesOptions('detail', predictDetailForm)
}
const endTimeChange = function (endTimeValue) {
  if (!predictDetailForm.endTime) {
    // message.warning('起始时间不能为空')
    return
  }
  getfbTimesOptions('detail', predictDetailForm)
}


/* 
    获取图和表的数据: 
        1. backInfo: 返回的数据
        2. confirmFunc: 确认查询
        3. exportFunc: 导出
*/
let backInfo = ref()
const confirmFunc = async function (value) {
  if (!menuForm.site) { message.warn('站点不可为空'); return }
  let fbTime = ''
  if (value === 'detail') {
    if (!predictDetailForm.sendTime) {
      // message.warn('发报时间不可为空');
      return
    }
    fbTime = predictDetailForm.sendTime
  } else {
    if (!mapAreaForm.sendTime) {
      // message.warn('发报时间不可为空');
      return
    }
    fbTime = mapAreaForm.sendTime
  }
  const params = {
    dataForm: 100,
    fbTime: fbTime,
    predictionType: menuForm.predictType,
    siteIds: [menuForm.site],
    siteTypeEnum: getSiteType(menuForm.site)
  }
  const { code, data } = await preDataByFbTimeGet(params)
  if (code === 200 && data) {
    dataDetailTableData.value = []
    lineData.value = []
    if (value === 'detail') {
      for (let i in data) {
        dataDetailTableData.value.push({
          time: `${data[i]?.dataTime}`,
          predictPower: `${data[i]?.dataFeatureValue}`
        });
        backInfo.value = data
        marks.value = {}
        step.value = (100 / (data.length - 1))
        let current = 0
        for (let index in data) {
          if (Number(index) !== data.length - 1) {
            marks.value[`${current}`] = data[index].dataTime.slice(5)
            current += step.value
          } else {
            marks.value[`100`] = data[index].dataTime.slice(5)
          }
        }
        isShowTooltip.value = true
        // marker太多,间隔隐藏marker时使用
        nextTick(() => {
          let markTexts = document.querySelectorAll('.ant-slider-mark-text')
          if (markTexts && markTexts.length > 20) {
            for (let i in markTexts) {
              if (markTexts[i].style) {
                markTexts[i].style.display = 'none'
                if (+i === markTexts.length - 1 || +i === 0 || +i === (markTexts.length / 2)) {
                  markTexts[i].style.display = 'inline-block'
                }
              }
            }
          }
          addMarkerInfo(marks.value[`${currentTime.value}`])
        })
      }
      if (getSiteType(menuForm.site) !== 'WIND') {
        lineData.value = [{
          name: getLineGraphLegendName(menuForm.predictType),
          data: []
        }]
        for (let i in data) {
          lineData.value[0].data.push([data[i]?.dataTime, data[i]?.dataFeatureValue])
        }
      } else {
        let heightArr = []
        for (let item in data) {
          if (heightArr.indexOf(data[item]?.height) === -1) {
            heightArr.push(data[item]?.height)
          }
        }
        for (let h in heightArr) {
          lineData.value.push({
            name: heightArr[h],
            data: []
          })
        }
        for (let item in data) {
          for (let i in lineData.value) {
            if (data[item].height === lineData.value[i].name) {
              lineData.value[i].data.push([data[item].dataTime, data[item].dataFeatureValue])
            }
          }
        }
      }
      nextTick(() => {
        loadLineGraph(lineChartDom.value, lineData.value)
      })
    } else {
      backInfo.value = data
      marks.value = {}
      step.value = (100 / (data.length - 1))
      let current = 0
      for (let index in data) {
        if (Number(index) !== data.length - 1) {
          marks.value[`${current}`] = data[index].dataTime.slice(5)
          current += step.value
        } else {
          marks.value[`100`] = data[index].dataTime.slice(5)
        }
      }
      isShowTooltip.value = true
      // marker太多,间隔隐藏marker时使用
      nextTick(() => {
        let markTexts = document.querySelectorAll('.ant-slider-mark-text')
        if (markTexts && markTexts.length > 20) {
          for (let i in markTexts) {
            if (markTexts[i].style) {
              markTexts[i].style.display = 'none'
              if (+i === markTexts.length - 1 || +i === 0 || +i === parseInt(markTexts.length / 2)) {
                markTexts[i].style.display = 'inline-block'
              }
            }
          }
        }
        addMarkerInfo(marks.value[`${currentTime.value}`])
      })
    }

  }
}
const exportFunc = function () {
  // 图
  let name = getSiteLabel(menuForm.site) + getLineGraphLegendName(menuForm.predictType)
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
        3. lineChartDom: 折线的dom
        4. getLineGraphLegendName: 获取图例名称
        5. loadLineGraph: 加载折线图
*/
let exportChart = ref(null)
let lineData = ref([])
const lineChartDom = ref(null)
const getLineGraphLegendName = function (value) {
  let name = ''
  menuFormOptions.value.predictTypeOptions.filter(item => {
    if (item.value === value) {
      name = item.label
    }
  })
  return name
}
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
      show: true,
      top: 20,
      padding: [0, 0],
      itemGap: 20,
      itemWidth: 30,
      textStyle: { fontSize: 14, color: '#333' },
    },
    grid: {
      left: '5%',
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
      position: 'right',
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

/* 
    表格相关: 
        1. showTable: 是否展示表格
        2. 切换是否展示表格
        3．watch: 重新加载图表 
        4. columns: 表格标题
        5. dataDetailTableData: 表格数据
*/
let showTable = ref(false)
const ifShowTable = function () {
  showTable.value = !showTable.value
}
watch(showTable, (value) => {
  if (!lineData.value || !lineData.value.length) return
  loadLineGraph(lineChartDom.value, lineData.value)
})
const columns = [
  { title: '时间', dataIndex: 'time', align: 'center' },
  { title: '预报功率(MW)', dataIndex: 'predictPower', align: 'center' },
];
const dataDetailTableData = ref([]);

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
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
    height: calc(100% - 40px);

    .tab-nav {
      width: 100%;
      display: flex;
      height: 40px;
      width: 100%;
      margin: 5px;
      padding: 5px 10px;
      overflow: hidden;
      background-color: #fff;
    }

    .overViewResult {
      width: 100%;
      height: calc(100% - 40px);

      #map {
        width: 100%;
        height: 85%;
      }

      .timerBox {
        width: 100%;
        height: 15%;
        display: flex;
        justify-content: space-evenly;

        .svgIcon {
          width: 5%;
          margin-top: 1%;
          display: flex;
          justify-content: space-evenly;
          cursor: pointer;
        }

        .timer {
          width: 85%;
          margin: 1% 1%;
        }

        // 时间轴
        :deep(.ant-slider-mark-text) {
          font-size: 10px;
        }
      }
    }

    .predictDetail {
      width: 100%;
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;

      overflow: hidden;

      .tab-nav {
        display: flex;
        justify-content: space-around;
        height: 40px;
        width: 100%;
        overflow: hidden;
      }

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