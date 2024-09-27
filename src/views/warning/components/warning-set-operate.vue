<template>
  <a-modal v-model:open="visible" :title="dialogTitle" class="threshold-manage-operate-dialog" :transition-name="null" @cancel="handleCloseDialog">
    <a-form ref="formRef" :model="form" :rules="formRules" class="search-part-left">
      <a-form-item label="预报模式" name=""> {{ form.modelName || '-' }}</a-form-item>
      <a-form-item label="预报文件类型" name=""> {{ form.fileTypeName || '-' }}</a-form-item>
      <a-form-item label="预报气象类型" name=""> {{ form.featureName || '-' }}</a-form-item>
      <a-form-item label="预报出力类型" name=""> {{ form.outputName || '-' }}</a-form-item>
      <a-form-item label="预报时次" name=""> {{ form.ybTime || '-' }}</a-form-item>
      <a-form-item label="延迟阈值" name="delayThreshold">
        <a-input v-model:value="form.delayThreshold" placeholder="请输入延迟阈值" />
      </a-form-item>
      <a-form-item label="缺失阈值" name="missThreshold">
        <a-input v-model:value="form.missThreshold" placeholder="请输入缺失阈值" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleCloseDialog">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确认</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { thresholdSet } from '@/api/common/warn.js'
import { message } from 'ant-design-vue'
const props = defineProps({
  operate: { type: String, default: 'add' },
  rowInfo: { type: Object, default: {} }
})
const emit = defineEmits(['close', 'refresh'])

// 一、初始化相关
const visible = ref(true)
const form = ref({})
const formRules = ref({
  delayThreshold: [{ required: true, message: '延迟阈值不能为空', trigger: 'blur' }],
  missThreshold: [{ required: true, message: '缺失阈值不能为空', trigger: 'blur' }],
})
const dialogTitle = ref('站点管理')
// 0、初始化总调用
async function init() {
  initForm()
}
init()
// 1、初始化表单
function initForm() {
  form.value = props.rowInfo
  dialogTitle.value = '阈值管理 - 更新'
}
// 二、操作相关
// 1、确认
const formRef = ref(null)
function handleConfirm() {
  formRef.value.validateFields().then(() => {
    form.value.delayThreshold = Number(form.value.delayThreshold)
    form.value.missThreshold = Number(form.value.missThreshold)
    let params = form.value
    thresholdSet(params).then(res => {
      message.success('阈值管理更新成功！')
      emit('close')
      emit('refresh')
    })
  }).catch()
}
// 2、关闭
function handleCloseDialog() {
  emit('close')
}
</script>

<style lang="scss">
.threshold-manage-operate-dialog {
  width: 700px !important;
  top: 50%;
  transform: translateY(-50%);

  // transform-origin: none !important;
  // transition: none !important;
  .ant-modal-content {
    padding: 0;

    .ant-modal-close {
      top: 25px;
      transform: translateY(-50%);
    }

    .ant-modal-header {
      height: 50px;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #efefef;

      .ant-modal-title {
        display: inline-flex;
        flex: 1;
        padding-left: 10px;
        font-weight: 700;
      }
    }

    .ant-modal-body {
      padding: 10px;

      .ant-form {
        width: calc(100% - 120px);
        margin: 20px 70px 0 50px;

        .ant-form-item-label {
          width: 120px;
        }
      }
    }

    .ant-modal-footer {
      height: 50px;
      padding-right: 20px;

      .ant-btn {
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }

}
</style>