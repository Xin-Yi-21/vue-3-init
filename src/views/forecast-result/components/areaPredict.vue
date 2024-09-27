<template>
  <div class="areaContainer">
    <a-space size="middle" class="tab-nav">
      <a-space>
        <span>气象要素：</span>
        <a-select v-model:value="enums.predictElement" style="width: 120px">
          <a-select-option v-for="item in enumsOptions.predictElementOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <span>发报时间：</span>
        <a-date-picker v-model:value="enums.sendTime" placeholder="请选择发报时间" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </a-space>
    </a-space>
    <div class="table">
      <a-table :columns="columns" align="center" :data-source="areaPredictTableData" :pagination="false"
        :scroll="{ y: 700, x: 1000 }">
        <template v-slot:bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex !== 'fbTime'">
            <!-- {{ record[column.dataIndex]?.image }} -->
            <img :src="record[column.dataIndex]?.image" class="smallImage" v-if="record[column.dataIndex]?.image" />
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, h } from 'vue'
import { message } from 'ant-design-vue'
import { forecastMeteorologyTypeGet } from '@/api/common/enums.js'
import { regionDataByFbTimeGet } from '@/api/predict-result/index.js'
const { proxy } = getCurrentInstance()
onMounted(() => {
  ObtainEnums()
})

const getNowFormatDate = function () {
  let date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)
  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
  return `${year}-${month}-${strDate}`
}
let enums = reactive({
  predictElement: 'IRRADIANCE',
  sendTime: getNowFormatDate()
})
const enumsOptions = reactive({
  siteOptions: [],
  predictElementOptions: [],
})
const ObtainEnums = async function () {
  const { code: ybFeatureCode, data: ybFeatureData } = await forecastMeteorologyTypeGet()
  if (ybFeatureCode === 200 && ybFeatureData) {
    enumsOptions.predictElementOptions = ybFeatureData
  }
}
const customCell = function (record, rowIndex) {
  return {
    style: {},
    onClick: (event) => {
      document.querySelectorAll('img').forEach(item => {
        item.setAttribute('class', 'smallImage')
      })
      if (event.target.nodeName === 'IMG') {
        event.target.setAttribute('class', 'bigImage')
      }
    },
  }
}
const obtainAreaInfo = async function () {
  let params = {
    dataForm: 100,
    endTime: enums.sendTime + ' 23:59:59',
    predictionFactor: enums.predictElement,
    startTime: enums.sendTime + ' 00:00:00',
  }
  const { code, data } = await regionDataByFbTimeGet(params)
  if (code === 200 && data) {
    let tableData = []
    for (var k in data) {
      let tableRow = {}
      tableRow.fbTime = proxy.$dayjs(k).format('YYYY-MM-DD HH:mm:ss')
      let columnList = [
        { title: '时次', dataIndex: 'fbTime', align: 'center', width: 290, }
      ]
      let forecastTimeList = []
      let forecastStartTime = proxy.$dayjs(enums.sendTime).add(1, 'day').format('YYYY-MM-DD 00:00:00')
      for (var i = 0; i < 72; i++) {
        forecastTimeList.push(proxy.$dayjs(forecastStartTime).add(i, 'hour').format('YYYY-MM-DD HH:mm:ss'))
      }
      forecastTimeList.forEach(item => {
        columnList.push({ title: item, dataIndex: item, align: 'center', width: 290, customCell: customCell })

      })
      columns.value = columnList
      let dataField = enums.predictElement === 'IRRADIANCE' ? 'solarPath' : 'windPath'

      data[k].forEach(item1 => {
        columnList.forEach(item2 => {
          if (item1.dataTime === item2.title) {
            item1.image = `http://192.168.120.19/regionPng/${item1[dataField]}`
            tableRow[item2.title] = item1
          }
        })
      })
      tableData.push(tableRow)
    }
    areaPredictTableData.value = tableData
  }
}
watch(() => enums.predictElement, () => {
  if (!enums.sendTime) { message.warn('发报时间不可为空'); return }
  obtainAreaInfo()
})
watch(() => enums.sendTime, () => {
  if (!enums.predictElement) { message.warn('气象要素不可为空'); return }
  obtainAreaInfo()
})

const columns = ref([]);
const areaPredictTableData = ref([]);
</script>

<style scoped lang="scss">
.areaContainer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab-nav {
    display: flex;
    justify-content: center;
    height: 40px;
    margin: 5px;
    padding: 5px 10px;
    overflow: hidden;
    background-color: #fff;
  }

  .table {
    flex: 1
  }

  :deep(.ant-table-container) {
    height: 720px;

    .smallImage {
      width: 290px;
      height: 290px;
      border: 1px solid black;
    }

    .bigImage {
      width: 700px;
      height: 700px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      aspect-ratio: 16 / 9;
      border: 1px solid black;
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