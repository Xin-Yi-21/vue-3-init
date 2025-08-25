<template>
  <div class="basic-vue">
    <c-card-header title="基础模版" icon="circle"></c-card-header>
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
            <el-date-picker v-model="form.startTime" type="datetime" :disabled-date="pickerOptions.start" placeholder="请选择开始时间" style="width:200px;" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" :disabled-date="pickerOptions.end" placeholder="请选择结束时间" style="width:200px;" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="c-search-operate">
        <div class="left">
          <c-button type="primary" class="query-button" i="c-search" @click="getTableInfo">查询</c-button>
          <c-button type="info" class="refresh-button" i="c-refresh" @click="setDefault"></c-button>
        </div>
        <div class="right">
          <c-button type="primary" i="c-add" @click="handleAdd">新增</c-button>
        </div>
      </div>
    </div>
    <div class="c-result">
      <el-table :data="table.data" border class="c-table" stripe>
        <el-table-column label="序号" prop="index" align="center" width="60" />
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
          <template #default="scope"> {{ scope.row.role }} </template>
        </el-table-column>
        <el-table-column label="人物介绍" prop="" align="center">
          <template #default="scope">
            <c-tooltip :content="scope.row.introduction">{{ scope.row.introduction }}</c-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" align="center" class-name="c-table-operate-column">
          <template #default="scope">
            <c-icon i="c-t-view" tip="查看" color="#55c791" hoverColor="#55c791" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleView(scope.row)"></c-icon>
            <c-icon i="c-t-update" tip="更新" color="#0077FF" hoverColor="#0077FF" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleUpdate(scope.row)"></c-icon>
            <c-icon i="c-t-delete" tip="删除" color="#FA4B4B" hoverColor="#FA4B4B" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleDelete(scope.row)"></c-icon>
          </template>
        </el-table-column>
      </el-table>
      <c-pagination v-model:currentPageNum="form.currentPageNum" v-model:currentPageSize="form.currentPageSize" :total="table.total" @getTable="getTableInfo('byPagination')"></c-pagination>
    </div>
    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :info="operateDialog.info" @close="operateDialog.visible = false" @refresh="getTableInfo"></Operate>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Operate from './components/operate.vue'
// 接口
import { cPersonGet } from '@/api/framework/project'
// pinia
import useStore from '@/store'
// 声明
const { enumsStore, settingStore } = useStore()
const { proxy } = getCurrentInstance()
const cached = ref({})
const loading = ref({})
const pickerOptions = ref({
  start: (time) => { if (form.value.endTime) { return time.getTime() >= new Date(form.value.endTime).getTime() }; return false },
  end: (time) => { if (form.value.startTime) { return time.getTime() <= new Date(form.value.startTime).getTime() - 86400000 }; return false }
})
// ^
// # 二、模块功能
// # 1、初始化
// # (1) 初始化总调用
function init() {
  getEnums()
  setDefault()
  getTableInfo()
}
// ^
// # (2) 获取枚举
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newEnums = {
    gender: allEnums.gender,
    role: allEnums.role
  }
  Object.assign(enums.value, newEnums)
}
// ^
// # (3) 设置默认
const form = ref({})
function setDefault() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newForm = {
    gender: allEnums.gender[0].value,
    currentPageNum: 1,
    currentPageSize: 10,
  }
  Object.assign(form.value, newForm)
}
// ^
// ^
// # 2、表格相关
const table = ref({ data: [], total: 0 })
// # (1) 获取表格信息
async function getTableInfo() {
  try {
    loading.value.result = true
    let params = {
      gender: form.value.gender,
      name: form.value.name,
      currentPageNum: form.value.currentPageNum,
      currentPageSize: form.value.currentPageSize,
    }
    const res = await cPersonGet(params)

    // table.value.data = proxy.$addTableIndex(res.data?.list, { ...params })
    // table.value.total = res.data?.total || 0

    Object.assign(cached.value, { tSearch: params, tResult: res.data })
    handleTableInfo()
  } finally {
    loading.value.result = false
  }
}
// ^
// # (2) 处理表格信息
function handleTableInfo() {
  // 查询参数
  let params = cached.value.tSearch
  // 接口返回数据
  let apiData = JSON.parse(JSON.stringify(cached.value.tResult || {}))
  // 处理数据
  let newTableData = apiData.list || []
  newTableData.map(item => { item.genderName = proxy.$getEnumsLabel(enumsStore.allEnums.gender, item.gender) })
  proxy.$addTableIndex(newTableData, { ...params })
  table.value.data = newTableData
  table.value.total = apiData.total || 0
}
// ^
// ^
// # 2、模态框 
const operateDialog = ref({})
// (1) 新增 
function handleAdd() {
  let newOperateDialog = { visible: true, operate: 'add', info: {}, }
  operateDialog.value = newOperateDialog
}
// (2) 查看
function handleView(rowInfo) {
  let newOperateDialog = { visible: true, operate: 'view', info: rowInfo, }
  operateDialog.value = newOperateDialog
}
// (3) 更新
function handleUpdate(rowInfo) {
  let newOperateDialog = { visible: true, operate: 'update', info: rowInfo, }
  operateDialog.value = newOperateDialog
}
// (4) 删除
function handleDelete(rowInfo) {
  proxy.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    let params = { id: rowInfo.id }
    const res = xxxDelete(params)
    res.code === 200 && proxy.$message.success('删除成功！')
  }).catch(() => { })
}
// ^
// # 3、余集
// ^

// # 三、机制 
onMounted(() => {
  init()
})
// ^
</script>

<style lang="scss" scoped>
.basic-vue {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>