<template>
  <div class="site-manage-vue">
    <div class="site-manage-header">
      <a-button type="primary" class="site-manage-button">
        <template #icon>
          <div class="rectangle"><svg-icon icon-class="site-manage"></svg-icon></div>
        </template>
        站点管理
      </a-button>
    </div>
    <div class="site-manage-content">
      <div class="search-part">
        <a-form ref="formRef" :model="form" class="search-part-left">
          <a-form-item label="站点名称" name="siteName">
            <a-input v-model:value="form.siteName" placeholder="请输入站点名称" @change="getTableData" />
          </a-form-item>
          <a-form-item label="站点类型" name="siteType">
            <a-select v-model:value="form.siteType" placeholder="请选择站点类型" @change="getTableData" allowClear>
              <a-select-option v-for="(item, index) in enums.siteType" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否开启预报" name="isForecastStart">
            <a-select v-model:value="form.isForecastStart" placeholder="请选择是否开启预报" @change="getTableData" allowClear>
              <a-select-option v-for="(item, index) in enums.yn" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-button type="primary" @click="handleAdd">添加</a-button>
        <a-button type="primary" danger @click="handleDelete('batch')">删除</a-button>
      </div>
      <a-table :columns="columns" :data-source="tableData" rowKey="siteId" :pagination="false" :row-selection="rowSelection" :scroll="{ y: 530 }">
        <template v-slot:bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'sitePosition'">
            东经{{ record.lon }}°，北纬{{ record.lat }}°
          </template>
          <template v-if="column.dataIndex == 'isStartForecast'">
            <a-select v-model:value="record.enabled" placeholder="请选择是否开启预报" style="width:80px" @change="handleChangeForecastState(record)">
              <a-select-option v-for="(item, index) in enums.yn" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </template>
          <template v-if="column.dataIndex == 'operate'">
            <span class="row-update" @click="handleUpdate(record)">更新</span>
            <span class="row-delete" @click="handleDelete('single', record)">删除</span>
          </template>
        </template>
      </a-table>
    </div>
    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :rowInfo="operateDialog.rowInfo" @close="handleCloseDialog" @refresh="getTableData"></Operate>
  </div>
</template>

<script setup>
import { siteListGet, siteDelete, siteForecastStart, siteForecastEnd } from '@/api/site-manage/index.js'
import { message, Modal } from 'ant-design-vue'
import Operate from './components/operate.vue'
import useEnumsStore from '@/store/project/enums'
// 一、初始化相关
const form = ref({})
const enums = ref({})
const tableData = ref([])
// 0、初始化总调用
function init() {
  getEnums()
  getTableData()
}
init()
// 1、获取枚举
function getEnums() {
  enums.value = {
    siteType: useEnumsStore().allEnums.siteType,
    yn: useEnumsStore().allEnums.yn,
  }
}
// 2、获取表格数据
const columns = [
  { title: '站点名称', dataIndex: 'siteName', align: 'center', },
  { title: '站点类型', dataIndex: 'siteTypeName', align: 'center', },
  { title: '站点位置', dataIndex: 'sitePosition', align: 'center', },
  { title: '是否开启预报', dataIndex: 'isStartForecast', align: 'center', },
  { title: '操作', dataIndex: 'operate', align: 'center', },
]
async function getTableData() {
  let params = {
    siteName: form.value.siteName,
    siteType: form.value.siteType,
    enabled: form.value.isForecastStart,
  }
  const res = await siteListGet(params)
  let siteList = []
  if (res.code == 200) {
    siteList = res.data
  }
  tableData.value = siteList
}
// 二、操作相关
const operateDialog = ref({ visible: false })
// 1、添加
function handleAdd() {
  operateDialog.value.visible = true
  operateDialog.value.operate = 'add'
  operateDialog.value.rowInfo = JSON.parse(JSON.stringify({}))
}
// 2、修改
function handleUpdate(rowItem) {
  operateDialog.value.visible = true
  operateDialog.value.operate = 'update'
  operateDialog.value.rowInfo = JSON.parse(JSON.stringify(rowItem))
}
// 3、删除
// （1）站点选中
const selectedSite = ref([])
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys:', selectedRowKeys)
    // console.log('selectedRows:', selectedRows)
    selectedSite.value = selectedRowKeys
    // console.log('选中的站点:', selectedRowKeys)
  },
}
// （2）删除
function handleDelete(type, rowItem) {
  if (type === 'batch') {
    if (selectedSite.value.length === 0) {
      return message.warning('请至少选择一个站点后再进行删除操作！')
    }
  }
  Modal.confirm({
    title: '删除站点',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确认要删除选中的站点吗？',
    okText: '确认',
    cancelText: '取消',
    okType: 'danger',
    class: 'message-confirm',
    onOk() {
      let params = type === 'batch' ? selectedSite.value : [rowItem.siteId]
      siteDelete(params).then(res => {
        res.code === 200 ? message.success('删除成功！') : message.error('删除失败！')
        getTableData()
        useEnumsStore().getEnums('site')
      })
    },
    onCancel() { },
  })
}

// 4、是否开启预报
function handleChangeForecastState(rowItem) {
  Modal.confirm({
    title: '站点改变预报状态',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确认要改变站点预报状态吗？',
    okText: '确认',
    cancelText: '取消',
    // okType: 'danger',
    class: 'message-confirm',
    onOk() {
      let params = [rowItem.siteId]
      console.log('当前预报状态', rowItem.enabled)
      if (rowItem.enabled === 'YES') {
        siteForecastStart(params).then(res => {
          res.code === 200 ? message.success('开启预报 成功！') : message.error('开启预报 失败！')
          getTableData()
        }).catch(() => { getTableData() })
      } else if (rowItem.enabled === 'NO') {
        siteForecastEnd(params).then(res => {
          res.code === 200 ? message.success('关闭预报 成功！') : message.error('关闭预报 失败！')
          getTableData()
        }).catch(() => { getTableData() })
      }
    },
    onCancel() { },
  })
}
// 5、关闭模态框
function handleCloseDialog() {
  operateDialog.value.visible = false
}
</script>

<style scoped lang="scss">
.site-manage-vue {
  width: 100%;
  height: 100%;

  .site-manage-header {
    height: 40px;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .ant-btn {
      margin: 0 10px;
      display: inline-flex;
      align-items: center;

      &.site-manage-button {
        .rectangle {
          width: 18px;
          height: 18px;
          background-color: #fff;
          text-align: center;
          line-height: 18px;
          border-radius: 4px;
          margin-right: 5px;
        }
      }
    }
  }

  .site-manage-content {
    height: calc(100% - 60px);
    margin: 0 10px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #CDD0D4;

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
            // width: 100px;
          }
        }
      }

      .ant-btn {
        margin-right: 20px;
      }
    }

    .operate-row {
      padding: 0 10px;
      text-align: right;
      margin-bottom: 10px;
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

      .ant-table-selection-column {
        width: 100px;
        text-align: center;
      }

      .row-update {
        color: #38f0ca;
        cursor: pointer;
        margin-right: 15px;

        &:hover {
          text-decoration: underline;
        }
      }

      .row-delete {
        color: #FF4D4F;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
