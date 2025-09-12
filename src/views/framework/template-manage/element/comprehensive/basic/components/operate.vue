<template>
  <el-dialog v-model="dialog.visible" class="c-dialog" :before-close="handleClose" width="500" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18" cursor="" v-if="dialog.icon"></c-icon> {{ dialog.title }}</div>
        <c-icon i="c-operate-close" class="n-o-i" @click="close"></c-icon>
      </div>
    </template>
    <div class="c-d-c">
      <el-form :model="form" :rules="formRules" ref="formRef" class="c-form" label-width="60px">
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入姓名" :disabled="disabled.view || disabled.update"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" :disabled="disabled.view">
            <el-option v-for="(item, index) in enums.gender" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" :disabled="disabled.view"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="role">
          <el-input v-model="form.role" placeholder="请输入身份" :disabled="disabled.view"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="c-d-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading.confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// # 一、综合
// 工具
import { numberVerify } from '@/utils/verify'
// props
const props = defineProps({
  operate: { type: String, default: 'add' },
  info: { type: Object, default: () => { } },
})
// pinia
import useStore from '@/store'
// 声明
const { enumsStore } = useStore()
const { proxy } = getCurrentInstance()
const emit = defineEmits()
const dialog = ref({ visible: true })
const loading = ref({})
const disabled = ref({})
// ^
// # 二、模块功能
// # 1、初始化
// # (0) 初始化总调用
async function init() {
  await getEnums()
  setDefault()
}
// ^
// # (1) 获取枚举
const enums = ref({})
async function getEnums() {
  let allEnums = JSON.parse(JSON.stringify(enumsStore.allEnums))
  let newEnums = {
    gender: allEnums.gender
  }
  enums.value = Object.assign({}, enums.value, newEnums)
}
// ^
// # (2) 设置默认
const form = ref({})
const formRules = ref({
  personName: [{ required: true, message: '姓名不能为空', trigger: 'blur' },],
  gender: [{ required: true, message: '性别不能为空', trigger: 'change' },],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }, { validator: numberVerify, trigger: 'blur' },],
  role: [{ required: true, message: '身份不能为空', trigger: 'blur' },],
})
function setDefault() {
  let newForm = {
    personId: props.info?.personId,
    personName: props.info?.personName,
    gender: props.info?.gender,
    age: props.info?.age,
    role: props.info?.role,
  }
  switch (props.operate) {
    case 'add':
      dialog.value = { visible: true, operate: 'add', title: '人物管理 - 新增', icon: 'c-operate-add' }
      form.value = {}
      break
    case 'view':
      dialog.value = { visible: true, operate: 'view', title: '人物管理 - 查看', icon: 'c-operate-view' }
      disabled.value.view = true
      form.value = newForm
      break
    case 'update':
      dialog.value = { visible: true, operate: 'update', title: '人物管理 - 更新', icon: 'c-operate-update' }
      disabled.value.update = true
      form.value = newForm
      break
  }
}
// ^

// ^
// # 2、确认
async function handleConfirm() {
  const valid = await proxy.$refs.formRef.validate()
  if (!valid) return false
  try {
    loading.value.confirm = true
    let params = {
      personName: form.value.personName,
      gender: form.value.gender,
      age: form.value.age,
      role: form.value.role,
    }
    switch (props.operate) {
      case 'add':
        await xxxAdd(params)
        proxy.$message.success('新增人物成功！')
        emit('refresh')
        emit('close')
        break
      case 'update':
        params.personId = form.value.personId
        await xxxUpdate(params)
        proxy.$message.success('更新人物成功！')
        emit('refresh')
        emit('close')
        break
    }
  } finally {
    loading.value.confirm = false
  }
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

<style lang="scss" scoped></style>
