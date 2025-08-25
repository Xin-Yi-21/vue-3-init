<template>
  <div class="custom-audit">
    <el-form :model="form" :rules="formRules" ref="formRef" class="c-form" label-width="95">
      <el-form-item label="审核状态：" prop="auditStatus">
        <el-radio-group v-model="form.auditStatus">
          <el-radio v-for="(item, index) in enums.auditStatus" :key="index" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见：">
        <el-input v-model="form.auditComment" type="textarea" :rows="3" resize="none"> </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  info: { type: Object, default: () => { } },
})
// ^

// # 二、模块功能
// # 1、初始化
// # (0) 初始化总调用 
function init() {
  getEnums()
  setForm()
}
// ^
// # (1) 获取枚举
let enums = ref({})
function getEnums() {
  const newEnums = {
    auditStatus: [{ label: '通过', value: 'PASS' }, { label: '不通过', value: 'FAIL' }]
  }
  enums.value = newEnums
}
// ^
// # (2) 设置默认值 
const form = ref({ auditStatus: '', auditComment: '', })
const formRules = ref({
  auditStatus: [{ required: true, message: '审核状态不能为空', trigger: 'change' }]
})
const formRef = ref(null)
function setForm() {
  let newForm = {
    ...props.info,
    auditStatus: props.info?.auditStatus || '',
    auditComment: props.info?.auditComment || ''
  }
  form.value = newForm
}
// ^
// ^
// ^ 

// # 三、机制
// # 1、生命周期 
onMounted(() => { init() })
defineExpose({ form, formRef })
// ^
// ^
</script>

<style lang="scss" scoped>
.custom-audit {
  width: 400px;
  margin-top: 10px;
}
</style>