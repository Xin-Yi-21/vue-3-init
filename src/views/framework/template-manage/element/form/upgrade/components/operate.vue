<template>
  <el-dialog v-model="visible" class="c-dialog" :before-close="handleClose" width="600" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18" cursor=""></c-icon> {{ dialog.title }}</div>
        <svg-icon icon-class="c-close" class-name="n-o-i" @click="close"></svg-icon>
      </div>
    </template>
    <div class="c-d-c">
      <el-form :model="form" :rules="formRules" ref="formRef" class="c-form" label-position="right" label-width="70">
        <div class="c-row">
          <!-- 普通输入框 -->
          <el-form-item label="姓名：" prop="personName">
            <el-input v-model="form.personName" placeholder="请输入姓名" disabled></el-input>
          </el-form-item>
        </div>

        <div class="c-row gap-10">
          <!-- 单选框 -->
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio v-for="(item, index) of enums.gender" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 数字框 -->
          <el-form-item label="年龄：" prop="age" :rules="[...formRules.age, { validator: numberVerifyNew({ decimalPlaces: 0, decimalPlacesMessage: '请输入整数' }), trigger: 'blur' }]">
            <el-input-number v-model="form.age" placeholder="请输入年龄" :controls="false"></el-input-number>
          </el-form-item>
        </div>

        <div class="c-row gap-10">
          <!-- 单选下拉框 -->
          <el-form-item label="阵营：" prop="side">
            <el-select v-model="form.side" placeholder="请选择阵营" :popper-append-to-body="true">
              <el-option v-for="(item, index) in enums.side" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 多选下拉框 -->
          <el-form-item label="角色：" prop="role">
            <el-select v-model="form.role" multiple class="c-multiple-select" placeholder="请选择角色" :popper-append-to-body="true">
              <el-option v-for="(item, index) in enums.role" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="c-row">
          <!-- 复选框 -->
          <el-form-item label="兴趣：" prop="interest">
            <el-checkbox-group v-model="form.interest">
              <el-checkbox v-for="(item, index) of enums.interest" :key="index" :label="item.label" :value="item.value"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <div class="c-row efi">
          <!-- 三级联动下拉框 -->
          <div class="c-label c-require" style="width:70px;">地区：</div>
          <div class="c-content gap-10">
            <el-form-item label="" prop="province">
              <el-select v-model="form.province" placeholder="请选择省" :popper-append-to-body="true">
                <el-option v-for="(item, index) in enums.province" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="city">
              <el-select v-model="form.city" placeholder="请选择市" :popper-append-to-body="true">
                <el-option v-for="(item, index) in enums.city" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="district">
              <el-select v-model="form.district" placeholder="请选择区/县" :popper-append-to-body="true">
                <el-option v-for="(item, index) in enums.district" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>


        <div class="c-row efi">
          <!-- 时间联动框 -->
          <div class="c-label c-require" style="width:70px;">时间：</div>
          <div class="c-content gap-10">
            <el-form-item label="" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :append-to-body="true" :clearable="true" :disabled="operate === 'view'"></el-date-picker>
            </el-form-item>
            <span class="c-between-line">—</span>
            <el-form-item label="" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :append-to-body="true" :clearable="true" :disabled="operate === 'view'"></el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="c-row">
          <!-- 文本域 -->
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>

        <div class="c-row fdc table-part">
          <c-button type="primary" i="c-add" height="30" @click="handleAddRelative">新增关系</c-button>
          <el-table :data="form.tableData" class="c-table" border>
            <el-table-column label="" prop="" align="center" class-name="c-table-update-column">
              <template #header>人物</template>
              <template #default="scope">
                <el-form-item label="" :prop="`tableData.${scope.$index}.person`" :rules="formRules.person">
                  <div class="c-normal-content">
                    <el-select v-model="scope.row.person" placeholder="请选择人物" :popper-append-to-body="true">
                      <el-option v-for="(item, index) in enums.person" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <template #error="{ error }">
                    <div class="c-error-content">
                      <el-tooltip :content="error" popper-class="c-error-tip" placement="top" :hide-after="1">
                        <el-select v-model="scope.row.person" placeholder="请选择人物" :popper-append-to-body="true">
                          <el-option v-for="(item, index) in enums.person" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="" prop="" align="center" class-name="c-table-update-column">
              <template #header>关系</template>
              <template #default="scope">
                <el-form-item label="" :prop="`tableData.${scope.$index}.relation`" :rules="formRules.relation">
                  <div class="c-normal-content">
                    <el-input v-model="scope.row.relation" placeholder="请输入关系"></el-input>
                  </div>
                  <template #error="{ error }">
                    <div class="c-error-content">
                      <el-tooltip :content="error" popper-class="c-error-tip" placement="top" :hide-after="1">
                        <el-input v-model="scope.row.relation" placeholder="请输入关系"></el-input>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="" align="center" class-name="c-table-operate-column" width="70">
              <template #default="scope">
                <c-icon i="c-t-delete" tip="删除" color="#FA4B4B" hoverColor="#FA4B4B" :showType="scope.$index ? 'c' : 'el'" cursor="pointer" @click="handleDelete(scope.row)"></c-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="c-row">
          <div class="c-label w-70px">说明：</div>
          <div class="c-content">带图标的隐藏提示</div>
        </div>

        <div class="c-row">
          <div class="c-column">
            <div class="c-label w-70px">说明：</div>
            <div class="c-content">1</div>
          </div>
          <div class="c-column">
            <div class="c-label w-70px">说明：</div>
            <div class="c-content">2</div>
          </div>
          <div class="c-column">
            <div class="c-label w-70px">说明：</div>
            <div class="c-content">3</div>
          </div>
          <div class="c-column">
            <div class="c-label w-70px">说明：</div>
            <div class="c-content">4</div>
          </div>
        </div>


      </el-form>
    </div>
    <template #footer>
      <div class="c-d-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="isConfirmLoading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// # 一、综合
// 工具函数
import { numberVerifyNew } from '@/utils/verify'
// 接口
import { cPersonGet } from '@/api/framework/project'
// props
const props = defineProps({
  operate: { type: String, default: 'add' },
  info: { type: Object, default: () => { } },
})
// pinia
import useEnumsStore from '@/store/project/enums'

// 声明
const { proxy } = getCurrentInstance()
const emit = defineEmits()
const visible = ref(true)
const isConfirmLoading = ref(false)
// ^
// # 二、模块功能
// # 1、初始化
// # (0) 初始化总调用
function init() {
  getEnums()
  initForm()
}
// ^
// # (1) 获取枚举
const enums = ref({})
function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(useEnumsStore().allEnums))
  let newEnums = {
    gender: allEnums.gender,
    side: [{ label: '红方', value: 'red' }, { label: '黑方', value: 'black' }, { label: '中立', value: 'gray' }],
    role: [{ label: '侦探', value: '侦探' }, { label: '高中生', value: '高中生' }, { label: '小说家', value: '小说家' }, { label: '演员', value: '演员' },],
    interest: [{ label: '阅读', value: '阅读' }, { label: '音乐', value: '音乐' }, { label: '体育', value: '体育' }, { label: '美术', value: '美术' }, { label: '游戏', value: '游戏' }, { label: '视频', value: '视频' },]
  }
  enums.value = Object.assign({}, enums.value, newEnums)
  getPerson()
}
async function getPerson() {
  let params = {
    currentPageNum: 1,
    currentPageSize: 999999,
  }
  const res = await cPersonGet(params)
  console.log('查person', res)
  res.data?.forEach(item => {
    item.label = item.personName
    item.value = item.personId
  })
  enums.value.person = res.data
  console.log('查enums.value',)
}
// ^
// # (2) 初始化表单
const form = ref({})
const formRules = ref({
  personName: [{ required: true, message: '姓名不能为空', trigger: 'blur' },],
  gender: [{ required: true, message: '性别不能为空', trigger: 'change' },],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' },],
  side: [{ required: true, message: '阵营不能为空', trigger: 'change' },],
  role: [{ required: true, message: '角色不能为空', trigger: 'change' },],
  interest: [{ required: true, message: '兴趣不能为空', trigger: 'change' },],
  province: [{ required: true, message: '省不能为空', trigger: 'change' },],
  city: [{ required: true, message: '市不能为空', trigger: 'change' },],
  district: [{ required: true, message: '区县不能为空', trigger: 'change' },],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' },],
  endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' },],
  person: [{ required: true, message: '人物不能为空', trigger: 'change' },],
  relation: [{ required: true, message: '关系不能为空', trigger: 'blur' },],
})
const dialog = ref({})
function initForm() {
  let newForm = {
    personId: props.info?.personId,
    personName: props.info?.personName,
    gender: props.info?.gender,
    age: props.info?.age,
    role: props.info?.role,
    tableData: []
  }
  switch (props.operate) {
    case 'add':
      form.value = newForm
      dialog.value = { operate: 'add', title: '人物管理 - 新增', icon: 'c-d-add' }
      break
    case 'view':
      form.value = newForm
      dialog.value = { operate: 'view', title: '人物管理 - 查看', icon: 'c-d-view' }
      break
    case 'update':
      form.value = newForm
      dialog.value = { operate: 'update', title: '人物管理 - 更新', icon: 'c-d-update' }
      break
  }
}
// ^
// ^


// # 2、表格相关
// # (1) 新增关系
function handleAddRelative() {
  form.value.tableData.push({ person: null, relative: null })
}
// ^
// ^
// # 3、确认
function handleConfirm() {
  proxy.$refs.formRef.validate((valid) => {
    if (!valid) return false
    let params = {
      personName: form.value.personName,
      gender: form.value.gender,
      age: form.value.age,
      role: form.value.role,
    }
    switch (props.operate) {
      case 'add':
        xxxAdd(params).then(res => {
          proxy.$message.success('新增人物成功！')
          emit('refresh')
          emit('close')
        })
        break
      case 'update':
        params.personId = this.form.personId
        xxxUpdate(params).then(res => {
          this.$message.success('更新人物成功！')
          emit('refresh')
          emit('close')
        })
        break
    }
  })
}
// ^
// # 4、取消
function handleClose(done) {
  emit('close')
}
// ^
// ^
// # 三、生命周期
init()
// ^
</script>

<style lang="scss" scoped>
.c-dialog {
  .c-d-c {
    padding: 20px 20px 10px 10px;

    .table-part {
      .el-button {
        margin: 0 0 0 auto;
      }

      .c-table {
        margin: 5px 0 20px;
        width: 100%;
      }
    }
  }


}
</style>
