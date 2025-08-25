<template>
  <div class="upgrade-vue">
    <c-card-header title="" icon="">
      <template #left> <c-card-title title="跨页选择" icon="circle"></c-card-title> </template>
      <template #center> </template>
      <template #right> </template>
    </c-card-header>
    <!-- <div class="c-search">
      <div class="c-search-condition"> </div>
      <div class="c-search-operate">
        <div class="left"> </div>
        <div class="right">
          <c-button type="primary" i="c-add" @click="handleAdd">新增</c-button>
        </div>
      </div>
    </div> -->
    <div class="c-result" v-loading-c="{ isLoading: isLoading, onCancel: () => isLoading = false }">
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
      </el-table>
      <div class="bottom-tool">
        <c-button type="primary" height="30">已选择数据： {{ selectedRows.length }}</c-button>
        <c-button type="primary" height="30">批量确认</c-button>
        <c-pagination v-model:currentPageNum="form.currentPageNum" v-model:currentPageSize="form.currentPageSize" :total="tableTotal" @getTable="getTableData('byPagination')"></c-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// 接口
import { cPersonGet } from '@/api/framework/project'
// props
const props = defineProps({
  currentNav: { type: String, default: '' }
})
// pinia
import useStore from '@/store'
// 声明
const { enumsStore } = useStore()
const { proxy } = getCurrentInstance()
const isLoading = ref(false)
// ^

// # 二、模块功能
// # 1、初始化
// # (0) 初始化总调用
function init() {
  getEnums()
  setDefaultParams()
  getTableData()
}
// ^
// # (1) 获取枚举 
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newEnums = {
    gender: allEnums.gender,
    role: allEnums.role
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  // console.log('enums.value', toRaw(enums.value))
}
// ^
// # (2) 设置默认查询参数 
const form = ref({})
function setDefaultParams() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newForm = {
    gender: allEnums.gender[0].value,
    currentPageNum: 1,
    currentPageSize: 10,
  }
  form.value = Object.assign({}, form.value, newForm)
}
// ^
// # (3) 获取表格数据 
const tableData = ref([])
const tableAllData = ref([])
const tableTotal = ref(0)
const recentParams = ref(null)
async function getTableData(type) {
  isLoading.value = true
  let params = {
    gender: form.value.gender,
    name: form.value.name,
    currentPageNum: form.value.currentPageNum,
    currentPageSize: form.value.currentPageSize,
  }
  const res = await cPersonGet(params)
  recentParams.value = params
  tableTotal.value = res.total
  setTimeout(() => { isLoading.value = false }, 200)
  tableData.value = handleTableData(res.data || [])
  handleTableBatchSelect(type)
  renderCheckbox()
}
function handleTableData(newTableData) {
  newTableData.map(item => {
    item.genderName = proxy.$getEnumsLabel(enumsStore.allEnums.gender, item.gender)
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

// # 2、选择
const selectedRows = ref([])
const rowKey = 'personId'
// # (1) 获取全部数据
async function getTableAllData() {
  let params = Object.assign({}, recentParams.value, { currentPageNum: 1, currentPageSize: 999999999 })
  const res = await cPersonGet(params)
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
// ^


// # 三、机制
// # 1、生命周期
onMounted(() => {
  init()
})
// ^
// ^
</script>

<style lang="scss" scoped>
.upgrade-vue {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .c-result {
    margin-top: 10px;

    .bottom-tool {
      display: flex;
      align-items: center;
      height: 50px;
    }
  }
}
</style>