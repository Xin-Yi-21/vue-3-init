<template>
  <el-dialog v-model="visible" class="c-dialog" :before-close="handleClose" width="600" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18" cursor=""></c-icon> {{ dialog.title }}</div>
        <svg-icon icon-class="c-close" class-name="n-o-i" @click="close"></svg-icon>
      </div>
    </template>
    <div class="c-d-c">
      <el-form :model="form" :rules="formRules" ref="formRef" class="c-form">
        <!-- <div class="c-row">
          <div class="c-label">说明：</div>
        </div> -->
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option v-for="(item, index) in enums.gender" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="role">
          <el-input v-model="form.role" placeholder="请输入身份"></el-input>
        </el-form-item>
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
import { numberVerify } from '@/utils/verify'
// props
const props = defineProps({
  operate: { type: String, default: 'add' },
  info: { type: Object, default: () => { } },
})
// pinia
import useEnumsStore from '@/store/enums'
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
  initForm()
  getEnums()
}
// ^
// # (1) 初始化表单
const form = ref({})
const formRules = ref({
  personName: [{ required: true, message: '姓名不能为空', trigger: 'blur' },],
  gender: [{ required: true, message: '性别不能为空', trigger: 'change' },],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }, { validator: numberVerify, trigger: 'blur' },],
  role: [{ required: true, message: '身份不能为空', trigger: 'blur' },],
})
const dialog = ref({})
function initForm() {
  let newForm = {
    personId: props.info?.personId,
    personName: props.info?.personName,
    gender: props.info?.gender,
    age: props.info?.age,
    role: props.info?.role,
  }
  switch (props.operate) {
    case 'add':
      form.value = {}
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
// # (2) 获取枚举
const enums = ref({})
function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(useEnumsStore().allEnums))
  let newEnums = {
    gender: allEnums.gender,
  }
  enums.value = Object.assign({}, enums.value, newEnums)
}
// ^
// ^
// # 2、确认
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
// # 3、关闭
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
  }
}
</style>
