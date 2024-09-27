<template>
  <div class="warning-query-vue">
    <div class="search-part">
      <a-form ref="formRef" :model="form" class="search-part-left">
        <a-form-item label="预报模式" name="">
          <a-select v-model:value="form.forecastModelType" placeholder="请选择预报模式" @change="getTableData">
            <a-select-option v-for="(item, index) in enums.forecastModelType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开始时间" name="">
          <a-date-picker v-model:value="form.startTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请输入开始时间" @change="getTableData" />
        </a-form-item>
        <a-form-item label="结束时间" name="">
          <a-date-picker v-model:value="form.endTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请输入结束时间" @change="getTableData" />
        </a-form-item>
        <a-form-item label="告警类型" name="">
          <a-select v-model:value="form.warnType" placeholder="请选择告警类型" @change="getTableData" allowClear>
            <a-select-option v-for="(item, index) in enums.warnType" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否确认解决" name="">
          <a-select v-model:value="form.ifResolve" placeholder="请选择是否确认解决" @change="getTableData" allowClear>
            <a-select-option v-for="(item, index) in enums.yn" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <!-- <a-button type="primary" @click="handleConfirm">确认解决</a-button> -->
    </div>
    <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ y: 500 }">
      <template v-slot:bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex == 'ifResolve'">
          {{ record.ifResolve === 'YES' ? '已解决' : '未解决' }}
        </template>
        <template v-if="column.dataIndex == 'operate'">
          <a-button type="primary" v-if="record.ifResolve === 'NO'" @click="handleConfirm(record)">确认解决</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { warnListGet, warnResolveConfirm } from '@/api/common/warn.js'
import { message, Modal } from 'ant-design-vue'
import useEnumsStore from '@/store/project/enums.js'
const { proxy } = getCurrentInstance()
// 一、初始化相关
const form = ref({})
const enums = ref({})
// 0、初始化总调用
function init() {
  getEnums()
  setDefaultParams()
  getTableData()
}
init()
// 1、获取枚举
function getEnums() {
  enums.value = {
    forecastModelType: useEnumsStore().allEnums.forecastModelType,
    warnType: useEnumsStore().allEnums.warnType,
    yn: useEnumsStore().allEnums.yn,
  }
}
// 2、初始化表格查询参数
function setDefaultParams() {
  form.value.forecastModelType = enums.value.forecastModelType[0].value
  form.value.startTime = proxy.$dayjs().format('YYYY-MM-DD 00:00:00')
  form.value.endTime = proxy.$dayjs().format('YYYY-MM-DD HH:mm:ss')
}
// 3、获取 表格数据
const tableData = ref([])
const columns = [
  { title: '告警文件', dataIndex: 'fileName', align: 'center', },
  { title: '告警类型', dataIndex: 'timelinessName', align: 'center', },
  { title: '处理状态', dataIndex: 'ifResolve', align: 'center', },
  { title: '操作', dataIndex: 'operate', align: 'center', },
]
async function getTableData() {
  let params = {
    ybModel: form.value.forecastModelType,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    timeliness: form.value.warnType,
    ifResolve: form.value.ifResolve
  }
  const res = await warnListGet(params)
  tableData.value = res.data || []
  // console.log('查表格数据', res)
}

// 二、操作相关
// 1、确认解决
function handleConfirm(rowItem) {
  // console.log('确认解决', rowItem)
  Modal.confirm({
    title: '确认告警解决',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确认已解决此告警吗？',
    okText: '确认',
    cancelText: '取消',
    class: 'message-confirm',
    onOk() {
      let params = {
        configId: rowItem.configId,
        dataTime: rowItem.dataTime
      }
      warnResolveConfirm([params]).then(res => {
        message.success('告警确认解决成功！')
        getTableData()
      })
    },
    onCancel() { },
  })
}
</script>

<style scoped lang="scss">
.warning-query-vue {
  .search-part {
    width: calc(100% - 20px);
    margin: 10px;
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
}
</style>