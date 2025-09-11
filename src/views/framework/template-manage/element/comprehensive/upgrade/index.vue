<template>
  <div class="upgrade-vue">
    <c-card-header title="" icon="">
      <template #left> <c-card-title title="进阶模版" icon="circle"></c-card-title> </template>
      <template #center> </template>
      <template #right>
        <c-button i="c-operate-download" @click="handleDownloadFile" :loading="loading.downloadFile">文件下载</c-button>
        <c-button i="c-operate-upload" @click="handleUploadFile" :loading="loading.uploadFile">文件上传</c-button>

        <c-button i="c-operate-export-image" @click="handleImageExport" :loading="loading.imageExport">图片导出</c-button>
        <c-button i="c-operate-export-excel" @click="handleDomExport" :loading="loading.domExport">结构导出</c-button>
        <c-button i="c-operate-export-excel" @click="handleDataExport" :loading="loading.dataExport">数据导出</c-button>

        <c-button i="c-operate-submit" @click="handleBatchSumbit">批量提交</c-button>
        <c-button i="c-operate-audit" @click="handleBatchAudit">批量审核</c-button>
        <c-button i="c-operate-delete" @click="handleBatchDelete">批量删除</c-button>
      </template>
    </c-card-header>
    <div class="c-search" v-load="{ loading: loading.result, showAnim: false }">
      <div class="c-search-condition">
        <el-form :model="form" ref="formRef">
          <el-form-item label="性别">
            <el-select disabled v-model="form.gender" placeholder="请选择" style="width:120px" @change="handleChangeCondition('gender')">
              <el-option v-for="(item, index) in enums.gender" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" multiple class="c-multiple-select" placeholder="请选择角色" style="width:200px;">
              <el-option v-for="(item, index) in enums.role" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始时间">
            <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:200px;" :disabled-date="pickerOptions.start" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:200px;" :disabled-date="pickerOptions.end" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="c-search-operate">
        <div class="left">
          <c-button type="primary" class="query-button" i="c-operate-search" @click="getTableInfo">查询</c-button>
          <c-button type="info" class="refresh-button" i="c-operate-refresh" @click="setDefault"></c-button>
        </div>
        <div class="right">
          <c-button type="primary" i="c-operate-add" @click="handleAdd">新增</c-button>
        </div>
      </div>
    </div>
    <div class="c-result" v-load="{ loading: loading.result, onCancel: () => loading.result = false }">
      <!-- v-animation="{ class: 'c-a-fade-in', isRefresh: !isLoading, timeout: 1000 }" -->
      <el-table :data="table.data" border class="c-table" id="c-table" stripe @selection-change="handleChangeSelected" row-key="id">
        <el-table-column type="selection" align="center" width="60" reserve-selection />
        <el-table-column label="序号" prop="index" align="center" width="60" />
        <el-table-column label="人物" prop="" align="center" class-name="a">
          <template #default="scope"> {{ scope.row.personName }} </template>
        </el-table-column>
        <el-table-column label="性别" prop="" align="center" width="120">
          <template #default="scope"> {{ scope.row.genderName }} </template>
        </el-table-column>
        <el-table-column label="年龄" prop="" align="center" width="120">
          <template #default="scope"> {{ scope.row.age }} </template>
        </el-table-column>
        <el-table-column label="角色" prop="" align="center" width="120">
          <template #default="scope">{{ scope.row.role }}</template>
        </el-table-column>
        <el-table-column label="人物介绍" prop="" align="center">
          <template #default="scope">
            <c-tooltip :content="scope.row.introduction">{{ scope.row.introduction }}</c-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="人气值" prop="" align="center" width="90">
          <template #default="scope">
            <c-data-with-unit :data="scope.row.popularity" unit="票" :showTip="true"></c-data-with-unit>
          </template>
        </el-table-column>
        <el-table-column label="智力值" prop="" align="center" width="80">
          <template #default="scope">
            <el-progress class="progress-circle" type="circle" color="#55c791" :stroke-width="3" :width="30" :format="(p) => p || '0'" :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="武力值" prop="" align="center" width="80">
          <template #default="scope">
            <el-progress class="progress-line" type="line" color="#55c791" :show-text="false" :format="(p) => p || '0'" :percentage="scope.row.progress"></el-progress>
          </template>
        </el-table-column>

        <el-table-column label="操作记录" prop="" align="center">
          <template #default="scope">
            <c-text size="14" color="#0077FF" button :disabled="false" :loading="false">操作记录</c-text>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="" align="center" width="140">
          <template #default="scope">
            <c-tag v-if="scope.row.status" :color="$getEnumsLabel(enums.status, scope.row.status, 'color', 'value')" v-disabled="false" button effect="dark">{{ scope.row.status }}</c-tag>
          </template>
        </el-table-column>
        <el-table-column label="图标操作" prop="" align="center" class-name="c-table-operate-column" width="140">
          <template #default="scope">
            <c-icon i="c-operate-confirm" tip="确认" color="#55c791" :showType="scope.$index ? 'c' : 'el'" button :disabled="true" :loading="loading[`confirm-${scope.row.id}`]" @click="handleConfirm(scope.row)"> </c-icon>
            <!-- <c-icon i="c-operate-confirm" tip="确认" color="#55c791" :showType="scope.$index ? 'c' : 'el'"  :disabled="false" v-load="{ loading: loading[`confirm-${scope.row.id}`], type: 'breath', }" @click="handleConfirm(scope.row)"> </c-icon> -->
            <c-icon i="c-operate-view" tip="查看" color="#55c791" :showType="scope.$index ? 'c' : 'el'" button @click="handleView(scope.row)"></c-icon>
            <c-icon i="c-operate-update" tip="更新" color="#0077FF" :showType="scope.$index ? 'c' : 'el'" button @click="handleUpdate(scope.row)"></c-icon>
            <c-icon i="c-operate-delete" tip="删除" color="#FA4B4B" :showType="scope.$index ? 'c' : 'el'" button @click="handleDelete(scope.row)"></c-icon>
          </template>
        </el-table-column>
        <el-table-column label="按钮操作" prop="" align="center" class-name="c-table-operate-column" width="220">
          <template #default="scope">
            <c-button>查看</c-button>
            <c-button>更新</c-button>
            <c-button>删除</c-button>
          </template>
        </el-table-column>
        <el-table-column label="文字操作" prop="" align="center" class-name="c-table-operate-column" width="140">
          <template #default="scope">
            <c-text size="14" color="#55c791" button :disabled="false" :loading="false">查看</c-text>
            <c-text size="14" color="#0077FF" button>更新</c-text>
            <c-text size="14" color="#FA4B4B" button>删除</c-text>
          </template>
        </el-table-column>
      </el-table>
      <c-pagination v-model:currentPageNum="form.currentPageNum" v-model:currentPageSize="form.currentPageSize" :total="table.total" :selectedOptions="{ show: true, total: table.selected.length, alwaysShow: false, trigger: 'hover' }" :pageSizeOptions="{ isCustom: true, isAll: true, isUpdate: true }" @getTable="getTableInfo('byPagination')">
        <template #selected> <c-selection v-bind="table.selection" onlySelected></c-selection> </template>
      </c-pagination>
    </div>

    <c-confirm ref="confirmRef">
      <template #default>
        <c-selection v-bind="table.selection" class="w-500px" v-if="confirmRef?.nature == 'selection'"></c-selection>
        <c-audit ref="auditRef" v-if="confirmRef?.nature == 'audit'" :info="auditInfo"></c-audit>
      </template>
    </c-confirm>
    <Operate v-if="operateDialog.visible" :operate="operateDialog.operate" :info="operateDialog.info" @close="operateDialog.visible = false" @refresh="getTableInfo"></Operate>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Operate from './components/operate.vue'
// 接口
import { cPersonGet, cFileDownload } from '@/api/framework/template-manage/element'
// props
const props = defineProps({
  currentNav: { type: String, default: '' }
})
// pinia
import useStore from '@/store'

// 声明
const { enumsStore } = useStore()
const { proxy } = getCurrentInstance()
const cached = ref({})
const loading = ref({})
const confirmRef = ref(null)
const pickerOptions = ref({
  start: (time) => { if (form.value.endTime) { return time.getTime() >= new Date(form.value.endTime).getTime() }; return false },
  end: (time) => { if (form.value.startTime) { return time.getTime() <= new Date(form.value.startTime).getTime() - 86400000 }; return false }
})
// ^

// # 二、模块功能
// # 1、初始化
function init() {
  getEnums()
  setDefault()
  getTableInfo()
}
// # (1) 获取枚举 
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newEnums = {
    gender: allEnums.gender,
    role: allEnums.role,
    status: [
      { label: '待提交', value: '待提交', color: '#00b0f0' },
      { label: '待审核', value: '待审核', color: '#8A2BE2' },
      { label: '审核已通过', value: '审核已通过', color: '#55C791' },
      { label: '审核未通过', value: '审核未通过', color: '#FA4B4B' },
    ]
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  // console.log('enums.value', toRaw(enums.value))
}
// ^
// # (2) 设置默认
const form = ref({})
function setDefault() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newForm = {
    gender: allEnums.gender[0].value,
    currentPageNum: 1,
    currentPageSize: 10,
  }
  form.value = Object.assign({}, form.value, newForm)
}
// ^
// ^
// # 2、获取表格数据 
const table = ref({
  data: [],
  total: 0,
  selected: [],
  selectBy: '',
  selection: handleSelection()
})
// # (1) 获取表格信息
async function getTableInfo(type) {
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
    await new Promise(resolve => setTimeout(resolve, 500))
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
// # 3、模态框 
const operateDialog = ref({})
// # (1) 新增 
function handleAdd() {
  let newOperateDialog = { visible: true, operate: 'add', info: {}, }
  operateDialog.value = newOperateDialog
}
// ^
// # (2) 查看
function handleView(rowInfo) {
  let newOperateDialog = { visible: true, operate: 'view', info: JSON.parse(JSON.stringify(rowInfo)), }
  operateDialog.value = newOperateDialog
}
// ^
// # (3) 编辑
function handleUpdate(rowInfo) {
  let newOperateDialog = { visible: true, operate: 'update', info: JSON.parse(JSON.stringify(rowInfo)), }
  operateDialog.value = newOperateDialog
}
// ^
// # (4) 删除
function handleDelete(rowInfo) {
  proxy.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    let params = { id: rowInfo.id }
    const res = xxxDelete(params)
    res.code === 200 && proxy.$message.success('删除成功！')
  }).catch()
}
// ^
// # (5) 确认
async function handleConfirm(rowInfo) {
  try {
    loading.value[`confirm-${rowInfo.id}`] = true
    await new Promise(resolve => setTimeout(resolve, 15000))
  } finally {
    loading.value[`confirm-${rowInfo.id}`] = false
  }
}
// ^
// ^
// # 4、顶部功能
// # (1) 文件下载
async function handleDownloadFile() {
  try {
    loading.value.downloadFile = true
    const res = await cFileDownload()
    const dRes = await proxy.$downloadFile(res.data, '测试文件', { tip: true, responseHeaders: res.headers })
    await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    loading.value.downloadFile = false
  }
}
// ^
// # (2) 文件上传
async function handleUploadFile() {
  console.log('文件上传',)
  try {
    loading.value.uploadFile = true
    await new Promise(resolve => setTimeout(resolve, 15000))
  } finally {
    loading.value.uploadFile = true
  }
}
// ^
// # (3) 图片导出
async function handleImageExport() {
  try {
    loading.value.imageExport = true
    await proxy.$exportDomToImage('c-table', '人物表格图', { format: 'png' })
    // await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    loading.value.imageExport = false
  }
}
// ^
// # (4) 结构导出
async function handleDomExport() {
  try {
    loading.value.domExport = true
    await proxy.$exportDomToExcel('c-table', '人物表格', { deleteCols: [0, 1, '操作'], })
    // await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    loading.value.domExport = false
  }
}
// ^
// # (5) 数据导出
async function handleDataExport() {
  try {
    loading.value.dataExport = true
    let tableHeader = {
      columnList: [
        { name: '人物', field: 'personName', width: 10 },
        { name: '性别', field: 'genderName' },
        { name: '年龄', field: 'age' },
        { name: '角色', field: 'role' },
        { name: '人物介绍', field: 'introduction', },
      ],
      matchFiled: { nameField: 'name', fieldField: 'field' }
    }
    await proxy.$exportDataToExcel(table.value.data, '人物表格', { tableHeader, })
    // await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    loading.value.dataExport = false
  }
}
// ^
// # (6) 批量提交
async function handleBatchSumbit() {
  try {
    if (!table.value.selected?.length) { return proxy.$message.warning('请至少选择一条数据进行批量操作！') }
    table.value.selectBy = '批量提交'
    if (!table.value.selection.selectedE?.tableData?.length) { return proxy.$message.warning('当前选中数据不符合条件！') }
    const confirmed = await proxy.$cConfirm(confirmRef, { title: '筛选执行提示', nature: 'selection' }).catch(() => { proxy.$message.info('已取消执行！') })
    if (!confirmed) return
    proxy.$message.success('确认操作执行！')
  } finally {
    setTimeout(() => { table.value.selectBy = '' }, 300)
  }
}
// ^
// # (7) 批量审核
const auditRef = ref(null)
const auditInfo = ref({})
async function handleBatchAudit() {
  try {
    if (!table.value.selected?.length) { return proxy.$message.warning('请至少选择一条数据进行批量操作！') }
    table.value.selectBy = '批量审核'
    if (!table.value.selection.selectedE?.tableData?.length) { return proxy.$message.warning('当前选中数据不符合条件！') }
    // 第一确认弹窗
    const confirmed1 = await proxy.$cConfirm(confirmRef, { title: '筛选执行提示', nature: 'selection' }).catch(() => { proxy.$message.info('已取消执行！') })
    if (!confirmed1) return
    // 第二确认弹窗
    const confirmed2 = await proxy.$cConfirm(confirmRef, { title: '审核', nature: 'audit', confirm: sumbitForm }).catch(() => { proxy.$message.info('已取消审核！') })
    // if (!confirmed2) return
    async function sumbitForm() {
      try {
        // 获取表单数据
        const auditForm = JSON.parse(JSON.stringify(auditRef.value?.form || {}))
        const checkStatusLRV = { 'PASS': '审核已通过', 'FAIL': '审核未通过' }
        await auditRef.value?.formRef.validate()
        const params = {
          checkStatus: checkStatusLRV[auditForm.checkStatus],
          checkComment: auditForm.checkComment,
        }
        const res = await xxxAudit(params)
        if (res?.code === 200) {
          proxy.$message.success('审核成功！')
          return true
        }
      } catch {
        return false
      }
    }
  } finally {
    setTimeout(() => { table.value.selectBy = '' }, 300)
  }
}
// ^
// # (8) 批量删除
async function handleBatchDelete() {
  if (!table.value.selected?.length) { return proxy.$message.warning('请至少选择一条数据进行批量操作！') }
  table.value.selectBy = '批量删除'
  if (!table.value.selection.selectedE?.tableData?.length) { return proxy.$message.warning('当前选中数据不符合条件！') }

  // 第一确认弹窗
  const confirmed1 = await proxy.$cConfirm(confirmRef, { title: '筛选执行提示', nature: 'selection' }).catch(() => { proxy.$message.info('已取消执行！') })
  if (!confirmed1) return
  // 第二确认弹窗
  proxy.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
    // let params = { id: info.id }
    // dispatchManageDelete(params).then(res => {
    //   this.getTableInfo()
    //   proxy.$message.success('删除人物成功！')
    // })
  }).catch(() => { proxy.$message.info('已取消删除！') })
}
// ^
// ^
// # X、辅助交互
// # (1) 改变查询条件
function handleChangeCondition(type) {
}
// ^
// # (2) 表格选中
function handleChangeSelected(value) {
  // table.value.selected = value
  console.log('查value', value)
}
// ^
// # (3) 表格选项
function handleSelection() {
  return computed(() => {
    let filterObj = {}
    let selectBy = table.value.selectBy
    const statusMap = {
      '批量提交': ['待提交', '审核未通过'],
      '批量审核': ['待审核'],
      '批量删除': ['待提交', '审核未通过'],
    }
    switch (selectBy) {
      case '批量提交':
      case '批量删除':
      case '批量审核':
        filterObj = filter(table.value.selected, statusMap[selectBy])
        break
      default:
        filterObj = { selectedE: [], selectedIE: [] }
    }

    function filter(selected = [], statusE = []) {
      const selectedE = []
      const selectedIE = []
      for (const item of selected) {
        (statusE.includes(item.status) ? selectedE : selectedIE).push(item)
      }
      return { selectedE, selectedIE }
    }

    let selection = {
      tableShow: ['selectedE', 'selectedIE'],
      selected: {
        tableData: table.value.selected,
        tableColumnShow: [
          { label: '序号', value: 'index', width: '60' },
          { label: '人物', value: 'personName', width: '140' },]
      },
      selectedE: {
        tableData: filterObj.selectedE,
        tableColumnShow: [
          { label: '序号', value: 'index', width: '60' },
          { label: '人物', value: 'personName', width: '' },
          // { label: '状态（原因）', value: 'status', width: '' },
        ]
      },
      selectedIE: {
        tableData: filterObj.selectedIE,
        tableColumnShow: [
          { label: '序号', value: 'index', width: 60 },
          { label: '人物', value: 'personName', width: '' },
          // { label: '状态（原因）', value: 'status', width: '' },
        ]
      },
    }
    return selection
  })
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
// # 2、计算属性


// const tableSelection = computed(() => {
//   let filterObj = {}
//   let selectBy = table.value.selectBy
//   const statusMap = {
//     '批量提交': ['待提交', '审核未通过'],
//     '批量审核': ['待审核'],
//     '批量删除': ['待提交', '审核未通过'],
//   }
//   switch (selectBy) {
//     case '批量提交':
//     case '批量删除':
//     case '批量审核':
//       filterObj = filter(table.value.selected, statusMap[selectBy])
//       break
//     default:
//       filterObj = { selectedE: [], selectedIE: [] }
//   }

//   function filter(selected = [], statusE = []) {
//     const selectedE = []
//     const selectedIE = []
//     for (const item of selected) {
//       (statusE.includes(item.status) ? selectedE : selectedIE).push(item)
//     }
//     return { selectedE, selectedIE }
//   }

//   let selection = {
//     tableShow: ['selectedE', 'selectedIE'],
//     selected: {
//       tableData: table.value.selected,
//       tableColumnShow: [
//         // { label: '序号', value: 'index', width: '60' },
//         { label: '人物', value: 'personName', width: '140' },]
//     },
//     selectedE: {
//       tableData: filterObj.selectedE,
//       tableColumnShow: [
//         // { label: '序号', value: 'index', width: '60' },
//         { label: '人物', value: 'personName', width: '' },
//         // { label: '状态（原因）', value: 'status', width: '' },
//       ]
//     },
//     selectedIE: {
//       tableData: filterObj.selectedIE,
//       tableColumnShow: [
//         // { label: '序号', value: 'index', width: 60 },
//         { label: '人物', value: 'personName', width: '' },
//         // { label: '状态（原因）', value: 'status', width: '' },
//       ]
//     },
//   }
//   return selection
// })
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

  :deep(.progress-circle) {
    transform: translateY(3px);
    overflow: hidden;

    .el-progress-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    }

    .el-progress__text {
      position: absolute;
      left: 0;
      width: 30px;
      font-size: 12px !important;
      font-weight: 700;
      min-width: auto;
    }
  }

  :deep(.progress-line) {
    display: inline-flex;
    width: 100%;
    height: 10px;

    .el-progress-bar__outer {
      padding: 1px 2px;
      height: 6px;
      background-color: #efefef;

      .el-progress-bar__inner {
        position: relative;
        height: 4px;
      }
    }
  }
}
</style>