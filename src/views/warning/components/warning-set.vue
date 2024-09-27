<template>
  <div class="warning-set-vue">
    <div class="part-1">
      <div class="part-title">到报时间</div>
      <div class="search-part">
        <a-form ref="formRef" :model="searchForm" class="search-part-left">
          <a-form-item label="预报模式" name="">
            <a-select v-model:value="searchForm.forecastModelType" placeholder="请选择预报模式" @change="getTableData">
              <a-select-option v-for="(item, index) in enums.forecastModelType" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="预报文件类型" name="" v-if="searchForm.forecastModelType === 'POINT'">
            <a-select v-model:value="searchForm.forecastFileType" @change="getTableData" allowClear>
              <a-select-option v-for="(item, index) in enums.forecastFileType" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="预报气象类型" name="" v-if="searchForm.forecastModelType === 'POINT' && searchForm.forecastFileType === 'QX'">
            <a-select v-model:value="searchForm.forecastMeteorologyType" @change="getTableData" allowClear>
              <a-select-option v-for="(item, index) in enums.forecastMeteorologyType" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="预报出力类型" name="" v-if="searchForm.forecastModelType === 'POINT' && searchForm.forecastFileType === 'POWER'">
            <a-select v-model:value="searchForm.forecastOutputType" @change="getTableData" allowClear>
              <a-select-option v-for="(item, index) in enums.forecastOutputType" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ y: 400 }">
        <template v-slot:bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'operate'">
            <a-button type="primary" @click="handleThresholdSet(record)">更新设置</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <div class="part-3">
      <div class="part-title">数据补传</div>
      <a-form ref="formRef" :model="form" :rules="formRules" class="data-supplement">
        <a-form-item label="预报模式" name="forecastModelType" @change="getSupplementTime">
          <a-select v-model:value="form.forecastModelType" placeholder="请选择预报模式">
            <a-select-option v-for="(item, index) in enums.forecastModelType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择站点" name="site" @change="getSupplementTime" v-if="form.forecastModelType === 'POINT'">
          <a-select v-model:value="form.site" allowClear>
            <a-select-option v-for="(item, index) in enums.site" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预报文件类型" name="" @change="getSupplementTime" v-if="form.forecastModelType === 'POINT'">
          <a-select v-model:value="form.forecastFileType" allowClear>
            <a-select-option v-for="(item, index) in enums.forecastFileType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预报气象类型" name="" @change="getSupplementTime" v-if="form.forecastModelType === 'POINT' && form.forecastFileType === 'QX'">
          <a-select v-model:value="form.forecastMeteorologyType" allowClear>
            <a-select-option v-for="(item, index) in enums.forecastMeteorologyType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预报出力类型" name="" @change="getSupplementTime" v-if="form.forecastModelType === 'POINT' && form.forecastFileType === 'POWER'">
          <a-select v-model:value="form.forecastOutputType" allowClear>
            <a-select-option v-for="(item, index) in enums.forecastOutputType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="预报时次" name="supplementTime">
          <a-select v-model:value="form.supplementTime" allowClear>
            <a-select-option v-for=" (item, index) in supplementTimeList" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-button type="primary" @click="handleSupplementUpload">补传</a-button>
      </a-form>
    </div>

    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :rowInfo="operateDialog.rowInfo" @close="handleCloseDialog" @refresh="getTableData"></Operate>
  </div>
</template>
<script setup>
import { forecastModelTypeGet, forecastMeteorologyTypeGet, forecastOutputTypeGet, forecastFileTypeGet, siteListGet } from '@/api/common/enums.js'
import { forecastTimeGet, supplementTimeGet, supplementUpload } from '@/api/common/warn'
import Operate from './warning-set-operate.vue'
import { message, Modal } from 'ant-design-vue'
import useEnumsStore from '@/store/project/enums'
const router = useRouter()
// 一、初始化相关
const searchForm = ref({})
const form = ref({})
const formRules = ref({
  forecastModelType: [{ required: true, message: '预报模式不能为空', trigger: 'change' }],
  site: [{ required: true, message: '站点不能为空', trigger: 'change' }],
  supplementTime: [{ required: true, message: '时次不能为空', trigger: 'change' }],
})
const enums = ref({})
// 0、初始化总调用
function init() {
  getEnums()
  setDefaultParams()
  getTableData()
  getSupplementTime()
}
init()
// 1、获取枚举
async function getEnums() {
  enums.value = {
    site: useEnumsStore().allEnums.site,
    forecastModelType: useEnumsStore().allEnums.forecastModelType,
    forecastMeteorologyType: useEnumsStore().allEnums.forecastMeteorologyType,
    forecastFileType: useEnumsStore().allEnums.forecastFileType,
    forecastOutputType: useEnumsStore().allEnums.forecastOutputType,
  }
  form.value.forecastModelType = enums.value.forecastModelType[0].value
}
// 2、初始化表格查询参数
function setDefaultParams() {
  searchForm.value.forecastModelType = enums.value.forecastModelType[0].value
  form.value.forecastModelType = enums.value.forecastModelType[0].value
  form.value.site = enums.value.site[0].value
}
// 3、获取 表格数据
const tableData = ref([])
const columns = [
  { title: '预报模式', dataIndex: 'modelName', align: 'center', },
  { title: '预报文件类型', dataIndex: 'fileTypeName', align: 'center', },
  { title: '预报气象类型', dataIndex: 'featureName', align: 'center', },
  { title: '预报出力类型', dataIndex: 'outputName', align: 'center', },
  { title: '预报时次', dataIndex: 'ybTime', align: 'center', },
  { title: '延迟阈值', dataIndex: 'delayThreshold', align: 'center', },
  { title: '缺失阈值', dataIndex: 'missThreshold', align: 'center', },
  { title: '操作', dataIndex: 'operate', align: 'center', },
]
async function getTableData() {
  let params = {
    ybModel: searchForm.value.forecastModelType,
    ybFeature: searchForm.value.forecastMeteorologyType,
    ybFileType: searchForm.value.forecastFileType,
    ybOutput: searchForm.value.forecastOutputType,
  }
  const res = await forecastTimeGet(params)
  tableData.value = res.data || []
}
// 4、获取 数据补传时间
const supplementTimeList = ref([])
async function getSupplementTime() {
  let params = {
    ybModel: form.value.forecastModelType,
    siteId: form.value.site,
    ybFeature: form.value.forecastMeteorologyType,
    ybFileType: form.value.forecastFileType,
    ybOutput: form.value.forecastOutput,
  }
  const res = await supplementTimeGet(params)
  let timeList = res.data || []
  timeList.forEach(item => {
    supplementTimeList.value.push({ label: item, value: item })
  })
  form.value.supplementTime = supplementTimeList.value[0].value || ''
  // console.log('查supplementTimeList', form.value.supplementTime)
}
// 二、操作相关
const operateDialog = ref({ visible: false })
// 1、更新阈值
function handleThresholdSet(rowItem) {
  // console.log('查rowItem', rowItem)
  operateDialog.value.visible = true
  operateDialog.value.operate = 'update'
  operateDialog.value.rowInfo = JSON.parse(JSON.stringify(rowItem))
}
// 2、数据补传
function handleSupplementUpload() {
  Modal.confirm({
    title: '数据补传',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确认对此数据补传吗？',
    okText: '确认',
    cancelText: '取消',
    class: 'message-confirm',
    onOk() {
      let params = {
        ybModel: form.value.forecastModelType,
        siteId: form.value.site,
        dataTime: form.value.supplementTime,
        ybFeature: form.value.forecastMeteorologyType,
        ybFileType: form.value.forecastFileType,
        ybOutput: form.value.forecastOutput
      }
      supplementUpload(params).then(res => {
        res.code === 200 ? message.success('数据补传成功！') : message.error('数据补传失败！')
        getTableData()
      })
    },
    onCancel() { },
  })
}
// 3、关闭模态框
function handleCloseDialog() {
  operateDialog.value.visible = false
}
</script>

<style lang="scss" scoped>
.warning-set-vue {
  width: 100%;
  height: 100%;

  .part-title {
    color: #333;
    font-weight: 700;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 10px;
    padding-left: 10px;
  }

  .c-row {
    margin-bottom: 10px;

    .c-column {
      display: inline-flex;
      align-items: center;
      width: 360px;

      .ant-select {
        flex: 1;
      }
    }
  }

  .ant-table-wrapper {
    width: calc(100% - 40px);
    margin: 0 20px;
  }

  .search-part {
    width: calc(100% - 40px);
    margin: 0 20px 10px;
    background: #F0F8FF;
    border-radius: 4px;
    display: flex;
    align-items: center;
    height: 60px;

    :deep(.search-part-left) {
      height: 100%;
      flex: 1;
      display: flex;
      // align-items: center;
      padding-top: 10px;
      padding-left: 10px;

      .ant-form-item {
        margin-bottom: 10px;
        margin-right: 50px;
        width: 300px;

        .ant-form-item-label {
          width: 100px;
        }
      }
    }

    .ant-btn {
      margin-right: 20px;
    }
  }

  .part-1 {
    flex: 1;
    overflow: hidden;

    .c-row {
      padding-left: 10px;
    }

    :deep(.ant-table-wrapper) {
      // height: calc(100% - 90px);
      overflow: hidden;
      // overflow-y: scroll;

      // .ant-spin-nested-loading {
      //   height: 100%;

      //   .ant-spin-container {
      //     height: 100%;

      //     .ant-table {
      //       height: 100%;

      //       .ant-table-container {
      //         height: 100%;

      //         .ant-table-content {
      //           height: 100%;

      //           table {
      //             table-layout: fixed !important;
      //             // height: 300px;
      //             // display: flex;
      //             // flex-direction: column;
      //             height: 100% !important;
      //             overflow: hidden !important;

      //             .ant-table-tbody {
      //               overflow-y: scroll;
      //             }
      //           }

      //         }
      //       }
      //     }
      //   }
      // }
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
  }

  .part-2 {
    flex-shrink: 0;

    .c-row {
      padding-left: 20px;

      &.first-row {
        .c-column {
          width: 300px;
          margin-right: 20px;
        }
      }

      &.second-row {
        .c-column {
          margin-right: 20px;
        }
      }
    }
  }

  .part-3 {
    flex-shrink: 0;

    .ant-btn {
      margin-left: 20px;
    }
  }


  .part-1,
  .part-2,
  .part-3 {
    margin-bottom: 10px;
  }

  .data-supplement {
    height: 100%;
    flex: 1;
    display: flex;
    // align-items: center;
    padding-top: 10px;
    padding-left: 20px;

    .ant-form-item {
      margin-bottom: 10px;
      margin-right: 50px;
      width: 300px;

      .ant-form-item-label {
        width: 100px;
      }
    }
  }
}
</style>
