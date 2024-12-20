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
          <el-form-item label="起始时间">
            <el-date-picker v-model="form.startTime" type="datetime" :picker-options="pickerOptions.start" placeholder="请选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" :picker-options="pickerOptions.end" placeholder="请选择结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="c-search-operate">
        <div class="left">
          <c-button type="primary" class="query-button" i="c-search" @click="getTableData">查询</c-button>
          <el-button type="info" icon="el-icon-refresh-right" class="refresh-button" @click="setDefaultParams"></el-button>
        </div>
        <div class="right"> </div>
      </div>
    </div>
    <div class="c-result">
      <!-- <div class="c-result-header"></div>
      <div class="c-result-content"></div> -->
      <c-card-header>
        <template #left>
          <c-card-title title="人物管理" icon="circle"></c-card-title>
          <c-tab :tabList="tabList" :currentTab="currentTab" @change="handleChangeTab"></c-tab>
        </template>
        <template #right>
          <c-button type="primary" i="c-add" @click="handleAdd">新增</c-button>
        </template>
      </c-card-header>

      <c-card-header title="人物管理" icon="circle">
        <template #right> <c-button type="primary" i="c-add" @click="handleAdd">新增</c-button></template>
      </c-card-header>

      <el-table :data="tableData" border class="c-table" stripe>
        <el-table-column label="人物" prop="" align="center">
          <template #default="scope"> {{ scope.row.personName }} </template>
        </el-table-column>
        <el-table-column label="性别" prop="" align="center">
          <template #default="scope"> {{ scope.row.genderName }} </template>
        </el-table-column>
        <el-table-column label="年龄" prop="" align="center">
          <template #default="scope"> {{ scope.row.age }} </template>
        </el-table-column>
        <el-table-column label="角色" prop="" align="center" :show-overflow-tooltip="true">
          <template #default="scope"> {{ scope.row.role }} </template>
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

      <c-pagination :currentPageNum.sync="form.currentPageNum" :currentPageSize.sync="form.currentPageSize" :total="tableTotal" @getTable="getTableData"></c-pagination>
    </div>
    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :info="operateDialog.info" @close="operateDialog.visible = false" @refresh="getTableData"></Operate>
  </div>
</template>

<script setup>
// #region 一、综合 #
import Operate from './components/operate.vue'
import useEnumsStore from '@/store/project/enums'
const props = defineProps({
  currentNav: { type: String, default: '' }
})
const { proxy } = getCurrentInstance()
const pickerOptions = ref({
  start: { disabledDate: time => { if (form.value.endTime) { return (time.getTime() >= new Date(form.value.endTime).getTime()) } } },
  end: { disabledDate: time => { if (form.value.startTime) { return time.getTime() <= new Date(form.value.startTime).getTime() - 86400000 } } }
})
// #endregion
// #reg 二、模块功能 
// #region 1、初始化 
// #region (1) 获取枚举 
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(useEnumsStore().allEnums))
  console.log('查allEnums', allEnums)
  let newEnums = {
    gender: allEnums.gender,
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  console.log('查 enums.value', enums.value)
}
// #endregion
// #region (2) 设置默认查询参数 
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
// #endregion
// #region (3) 获取表格数据 
import { personGet } from '@/api/project/project.js'
const tableData = ref([])
const tableTotal = ref(1000)
async function getTableData() {
  let params = {
    gender: form.value.gender,
    name: form.value.name,
  }
  const res = await personGet(params)
  let newTableData = res.data || []
  newTableData.map(item => {
    item.role = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    item.genderName = proxy.$getEnumsLabel(useEnumsStore().allEnums.gender, item.gender)
  })
  // for (var i = 0; i < 3; i++) { tableData.push(...tableData) }
  tableData.value = newTableData || []
}
// #endregion
// #endregion
// #region 2、切换tab #
const tabList = ref([{ label: '要素1', value: '1' }, { label: '要素2', value: '2' }, { label: '要素3', value: '3' }, { label: '要素4', value: '4' },])
const currentTab = ref('1')
function handleChangeTab(tabItem) {
  currentTab.value = tabItem.value
}
// #endregion
// #region 3、改变查询条件 #
function handleChangeCondition(type) {
  switch (type) {
    case '':
      break
    case '':
    case '':
      break
  }
}
// #endregion
// #region 4、搜索 # 
function handleSearch() {
  getTableData()
}
// #endregion
// #region 5、模态框 #
const operateDialog = ref({})
// (1) 新增 
function handleAdd() {
  let operateDialog = {
    visible: true,
    operate: 'add',
    info: {},
  }
  operateDialog.value = operateDialog
}
// (2) 查看
function handleView(rowInfo) {
  let operateDialog = {
    visible: true,
    operate: 'view',
    info: JSON.parse(JSON.stringify(rowInfo)),
  }
  operateDialog.value = operateDialog
}
// (3) 编辑
function handleUpdate(rowInfo) {
  let operateDialog = {
    visible: true,
    operate: 'update',
    info: JSON.parse(JSON.stringify(rowInfo)),
  }
  operateDialog.value = operateDialog
}
// (4) 删除
function handleDelete(rowInfo) {
  // this.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
  //   // let params = { id: info.id }
  //   let params = new FormData()
  //   params.append('id', rowInfo.id)
  //   // dispatchManageDelete(params).then(res => {
  //   //   this.getTableData()
  //   //   this.$message.success('删除人物成功！')
  //   // })
  // }).catch()
}
// #endregion
// #end
// #region 三、生命周期 #
// #region 1、初始化 #
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
// #endregion
// #endregion
</script>

<style lang="scss" scoped>
.element-vue {
  width: 100%;
  height: 100%;
}
</style>