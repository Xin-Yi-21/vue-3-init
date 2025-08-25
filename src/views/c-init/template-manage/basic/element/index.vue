<template>
  <div class="element-vue">
    <div class="c-search">
      <div class="c-search-condition">
        <el-form :model="form" ref="formRef">
          <el-form-item label="性别">
            <el-select v-model="form.gender" placeholder="请选择" style="width:120px" @change="handleChangeCondition('gender')">
              <el-option v-for="(item, index) in enums.gender" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" multiple class="c-multiple-select" placeholder="请选择角色" style="width:200px;" @change="handleChangeCondition('gender')">
              <el-option v-for="(item, index) in enums.role" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始时间">
            <el-date-picker v-model="form.startTime" type="datetime" :disabled-date="pickerOptions.start" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" :disabled-date="pickerOptions.end" placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="c-search-operate">
        <div class="left">
          <c-button type="primary" class="query-button" i="c-search" @click="getTableData" :loading="isLoading">查询</c-button>
          <c-button type="info" class="refresh-button" i="c-refresh" @click="setDefaultParams"></c-button>
        </div>
        <div class="right">
          <c-button type="primary" i="c-export-excel" @click.stop="handleExport('table')" :loading="isDownLoading">{{ isDownLoading ? '导出中' : '批量导出' }}</c-button>
        </div>
      </div>
    </div>
    <div class="c-result" v-loading-c="{ isLoading: isLoading, onCancel: () => isLoading = false }">
      <!-- <div class="c-result-header"></div>
      <div class="c-result-content"></div> -->
      <c-card-header title="" icon="">
        <template #left>
          <c-card-title title="人物管理" icon="circle"></c-card-title>
        </template>
        <template #center>
          <c-tab :tabList="tabList" :currentTab="currentTab" @change="handleChangeTab"></c-tab>
        </template>
        <template #right>
          <c-button type="primary" i="c-add" @click="handleAdd">新增</c-button>
        </template>
      </c-card-header>

      <el-table :data="tableData" border class="c-table" stripe v-animation="{ class: 'c-a-fade-in', isRefresh: !isLoading, timeout: 1000 }">
        <el-table-column label="" align="center" width="150">
          <template #header>
            <c-icon i="c-select-page" tip="全选本页" showType="el" cursor="pointer" style="margin:0 7px;" @click="handleSelectPage"></c-icon>
            <c-icon i="c-select-all" tip="全选全部" showType="el" cursor="pointer" style="margin:0 7px;" @click="handleSelectAll"></c-icon>
            <c-icon i="c-select-clear" tip="取消选择" showType="el" cursor="pointer" style="margin:0 7px;" @click="handleSelectClear"></c-icon>
          </template>
          <template #default="scope">
            <el-checkbox v-model="scope.row.isChecked" @change="handleSelectChange(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="人物" prop="" align="center">
          <template #default="scope"> {{ scope.row.personName }} </template>
        </el-table-column>
        <el-table-column label="性别" prop="" align="center">
          <template #default="scope"> {{ scope.row.genderName }} </template>
        </el-table-column>
        <el-table-column label="年龄" prop="" align="center">
          <template #default="scope"> {{ scope.row.age }} </template>
        </el-table-column>
        <el-table-column label="角色" prop="" align="center">
          <template #default="scope">
            <c-tooltip :content="scope.row.role">{{ scope.row.role }}</c-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="人物介绍" prop="" align="center">
          <template #default="scope">
            <c-tooltip :content="scope.row.introduction">{{ scope.row.introduction }}</c-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" align="center">
          <template #default="scope">
            <div class="c-table-operate-row">
              <!-- <el-button @click="handleView(scope.row)" type="text">查看</el-button>
              <el-button @click="handleUpdate(scope.row)" type="text">修改</el-button>
              <el-button @click="handleDelete(scope.row)" type="text">删除</el-button> -->
              <c-icon i="c-t-view" tip="查看" color="#55c791" hoverColor="#55c791" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleView(scope.row)"></c-icon>
              <c-icon i="c-t-update" tip="更新" color="#0077FF" hoverColor="#0077FF" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleUpdate(scope.row)"></c-icon>
              <c-icon i="c-t-delete" tip="删除" color="#FA4B4B" hoverColor="#FA4B4B" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleDelete(scope.row)"></c-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="c-bottom-tool">
        <c-button type="primary" height="30">已选择数据： {{ selectedRows.length }}</c-button>
        <c-button type="primary" height="30">批量确认</c-button>
        <c-pagination v-model:currentPageNum="form.currentPageNum" v-model:currentPageSize="form.currentPageSize" :total="tableTotal" @getTable="getTableData('byPagination')"></c-pagination>
      </div>
    </div>
    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :info="operateDialog.info" @close="operateDialog.visible = false" @refresh="getTableData"></Operate>
  </div>
</template>

<script setup>
// # 一、综合
import Operate from './components/operate.vue'
import useEnumsStore from '@/store/project/enums'
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()

const props = defineProps({
  currentNav: { type: String, default: '' }
})
const { proxy } = getCurrentInstance()
const pickerOptions = ref({
  start: (time) => { if (form.value.endTime) { return time.getTime() >= new Date(form.value.endTime).getTime() }; return false },
  end: (time) => { if (form.value.startTime) { return time.getTime() <= new Date(form.value.startTime).getTime() - 86400000 }; return false }
})
// ^
// # 二、模块功能 
// # 1、初始化 
// # (1) 获取枚举 
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(useEnumsStore().allEnums))
  // console.log('查allEnums', allEnums)
  let newEnums = {
    gender: allEnums.gender,
    role: allEnums.role
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  // console.log('查 enums.value', enums.value)
}
// ^
// # (2) 设置默认查询参数 
const form = ref({})
function setDefaultParams() {
  let allEnums = JSON.parse(JSON.stringify(useEnumsStore().allEnums))
  let newForm = {
    gender: allEnums.gender[0].value,
    currentPageNum: 1,
    currentPageSize: 10,
  }
  form.value = Object.assign({}, form.value, newForm)
}
// ^
// # (3) 获取表格数据 
import { personGet } from '@/api/framework/project'
const tableData = ref([])
const tableAllData = ref([])
const tableTotal = ref(0)
const isLoading = ref(false)
const recentParams = ref(null)
async function getTableData(type) {
  isLoading.value = true
  let params = {
    gender: form.value.gender,
    name: form.value.name,
    currentPageNum: form.value.currentPageNum,
    currentPageSize: form.value.currentPageSize,
  }
  const res = await personGet(params)
  recentParams.value = params
  tableTotal.value = res.total
  setTimeout(() => { isLoading.value = false }, 200)
  tableData.value = handleTableData(res.data || [])
  handleTableBatchSelect(type)
  renderCheckbox()
}
function handleTableData(newTableData) {
  newTableData.map(item => {
    item.genderName = proxy.$getEnumsLabel(useEnumsStore().allEnums.gender, item.gender)
  })
  return newTableData
}
function handleTableBatchSelect(type) {
  if (type != 'byPagination') {
    getTableAllData()
    selectedRows.value = []
  }
}
// ^
// ^
// # 2、切换tab #
const tabList = ref([{ label: '要素1', value: '1' }, { label: '要素2', value: '2' }, { label: '要素3', value: '3' }, { label: '要素4', value: '4' },])
const currentTab = ref('1')
function handleChangeTab(tabItem) {
  currentTab.value = tabItem.value
}
// ^
// # 3、改变查询条件
function handleChangeCondition(type) {
  switch (type) {
    case 'name':
      proxy.$debounce(e => { getTableData() }, 500)()
      break
    case '':
    case '':
      break
  }
}
// ^
// # 4、搜索 
function handleSearch() {
  getTableData()
}
// ^
// # 5、模态框 
const operateDialog = ref({})
// (1) 新增 
function handleAdd() {
  let newOperateDialog = {
    visible: true,
    operate: 'add',
    info: {},
  }
  operateDialog.value = newOperateDialog
}
// (2) 查看
function handleView(rowInfo) {
  let newOperateDialog = {
    visible: true,
    operate: 'view',
    info: JSON.parse(JSON.stringify(rowInfo)),
  }
  operateDialog.value = newOperateDialog
}
// (3) 编辑
function handleUpdate(rowInfo) {
  let newOperateDialog = {
    visible: true,
    operate: 'update',
    info: JSON.parse(JSON.stringify(rowInfo)),
  }
  operateDialog.value = newOperateDialog
}
// (4) 删除
function handleDelete(rowInfo) {
  proxy.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    // let params = { id: info.id }
    let params = new FormData()
    params.append('id', rowInfo.id)
    // dispatchManageDelete(params).then(res => {
    //   this.getTableData()
    //   proxy.$message.success('删除人物成功！')
    // })
  }).catch()
}
// ^
// ^
// # 6、导出
const isDownLoading = ref(false)
function handleExport() {
  if (selectedRows.value.length === 0) return proxy.$modal.msgWarning('请选择数据进行导出！')
  let tableHeader = {
    columnList: [
      { name: '人物', field: 'personName' },
      { name: '性别', field: 'genderName' },
      { name: '年龄', field: 'age' },
      { name: '角色', field: 'role' },
      { name: '人物介绍', field: 'introduction' },
    ],
    matchFiled: { nameField: 'name', fieldField: 'field' }
  }
  proxy.$exportExcel(selectedRows.value, { tableName: '表格', tableHeader, isDownLoading, })
}
// ^
// # 7、选择
const selectedRows = ref([])
const rowKey = 'personId'
// # (1) 获取全部数据
async function getTableAllData() {
  let params = Object.assign({}, recentParams.value, { currentPageNum: 1, currentPageSize: 999999999 })
  const res = await personGet(params)
  tableAllData.value = handleTableData(res.data || [])
}
// ^
// # (2) 跨页数据选择回显
function renderCheckbox() {
  tableData.value.forEach(item1 => {
    let matchItem = selectedRows.value.filter(item2 => item1[rowKey] === item2[rowKey])
    if (matchItem.length > 0) {
      item1.isChecked = true
      // this.$set(item1, 'isChecked', true)
    } else {
      item1.isChecked = false
      // this.$set(item1, 'isChecked', false)
    }
  })
}
// ^
// # (3) 选择变换
function handleSelectChange(row) {
  if (!row.isChecked) {
    selectedRows.value = selectedRows.value.filter(item => item[rowKey] !== row[rowKey])
  } else {
    selectedRows.value.push(row)
  }
  console.log('查选择变换 selectedRows.value', selectedRows.value)
}
// ^
// # (4) 全选本页
function handleSelectPage() {
  const ids = selectedRows.value.map(item => item[rowKey])
  tableData.value.forEach(item1 => {
    if (!ids.includes(item1[rowKey])) {
      selectedRows.value.push(item1)
    }
  })
  renderCheckbox()
}
// ^
// # (5) 全选全部
function handleSelectAll() {
  // this.$set(this, 'selectedRows', this.tableAllData)
  selectedRows.value = tableAllData.value
  renderCheckbox()
}
// ^
// # (6) 清除选择
function handleSelectClear() {
  selectedRows.value = []
  renderCheckbox()
}
// ^
// ^
// # 三、生命周期
// # 1、初始化 
const isDataInitDone = ref(false)
const init = () => {
  getEnums()
  setDefaultParams()
  getTableData()
  isDataInitDone.value = true
}
onMounted(() => {
  init()
})
// ^
// ^
</script>

<style lang="scss" scoped>
.element-vue {
  width: 100%;
  height: 100%;
}
</style>