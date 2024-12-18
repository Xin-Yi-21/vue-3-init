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
          <template slot-scope="scope"> {{ scope.row.personName }} </template>
        </el-table-column>
        <el-table-column label="性别" prop="" align="center">
          <template slot-scope="scope"> {{ scope.row.genderName }} </template>
        </el-table-column>
        <el-table-column label="年龄" prop="" align="center">
          <template slot-scope="scope"> {{ scope.row.age }} </template>
        </el-table-column>
        <el-table-column label="角色" prop="" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"> {{ scope.row.role }} </template>
        </el-table-column>
        <el-table-column label="操作" prop="" align="center">
          <template slot-scope="scope">
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

<script>
import Operate from './components/operate.vue'
import { personGet } from '@/api/project/project.js'
export default {
  components: { Operate, },
  props: {
    currentNav: { type: String, defualt: '' }
  },
  data() {
    return {
      form: {},
      enums: {},
      isDataInitDone: false,
      tableData: [],
      tableTotal: 1000,
      tabList: [{ label: '要素1', value: '1' }, { label: '要素2', value: '2' }, { label: '要素3', value: '3' }, { label: '要素4', value: '4' },],
      currentTab: '1',
      operateDialog: {},
      pickerOptions: {
        start: { disabledDate: time => { if (this.form.endTime) { return (time.getTime() >= new Date(this.form.endTime).getTime()) } } },
        end: { disabledDate: time => { if (this.form.startTime) { return time.getTime() <= new Date(this.form.startTime).getTime() - 86400000 } } }
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 一、初始化相关
    // 0、整体调用
    async init() {
      await this.getEnums()
      this.setDefaultParams()
      this.getTableData()
      this.isDataInitDone = true
    },
    // 1、获取枚举
    async getEnums() {
      let allEnums = JSON.parse(JSON.stringify(this.$store.state.enums.allEnums))
      let enums = {
        gender: allEnums.gender,
      }
      this.$set(this, 'enums', Object.assign({}, this.enums, enums))
    },
    // 2、设置默认查询参数
    setDefaultParams() {
      let allEnums = JSON.parse(JSON.stringify(this.$store.state.enums.allEnums))
      let form = {
        gender: allEnums.gender[0].value,
        currentPageNum: 1,
        currentPageSize: 10,
      }
      this.$set(this, 'form', Object.assign({}, this.form, form))
    },
    // 3、获取表格数据
    async getTableData() {
      let params = {
        gender: this.form.gender,
        name: this.form.name,
      }
      const res = await personGet(params)
      let tableData = res.data || []
      tableData.map(item => {
        item.role = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        item.genderName = this.$getEnumsLabel(this.$store.state.enums.allEnums.gender, item.gender)
      })
      // for (var i = 0; i < 3; i++) { tableData.push(...tableData) }

      this.$set(this, 'tableData', tableData || [])
    },

    // 二、操作相关
    handleChangeTab(tabItem) {
      this.$set(this, 'currentTab', tabItem.value)
    },
    // 1、改变查询条件
    handleChangeCondition(type) {
      switch (type) {
        case '':
          break
        case '':
        case '':
          break
      }
    },
    // 2、搜索
    handleSearch() {
      this.getTableData()
    },
    // 3、新增
    handleAdd() {
      let operateDialog = {
        visible: true,
        operate: 'add',
        info: {},
      }
      this.$set(this, 'operateDialog', operateDialog)
    },
    // 4、查看
    handleView(rowInfo) {
      let operateDialog = {
        visible: true,
        operate: 'view',
        info: JSON.parse(JSON.stringify(rowInfo)),
      }
      this.$set(this, 'operateDialog', operateDialog)
    },
    // 5、编辑
    handleUpdate(rowInfo) {
      let operateDialog = {
        visible: true,
        operate: 'update',
        info: JSON.parse(JSON.stringify(rowInfo)),
      }
      this.$set(this, 'operateDialog', operateDialog)
    },
    // 6、删除
    handleDelete(rowInfo) {
      this.$confirm('确定删除吗？', '确认消息', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
        // let params = { id: info.id }
        let params = new FormData()
        params.append('id', rowInfo.id)
        // dispatchManageDelete(params).then(res => {
        //   this.getTableData()
        //   this.$message.success('删除人物成功！')
        // })
      }).catch()
    },
  },
}
</script>

<style lang="scss" scoped>
.element-vue {
  width: 100%;
  height: 100%;
}
</style>