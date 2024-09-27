<template>
  <a-modal v-model:open="visible" :title="dialogTitle" class="site-manage-operate-dialog" :transition-name="null" @cancel="handleCloseDialog">
    <a-form ref="formRef" :model="form" :rules="formRules" class="search-part-left">
      <a-form-item label="经度" name="lon">
        <a-input v-model:value="form.lon" placeholder="请输入经度" />
      </a-form-item>
      <a-form-item label="纬度" name="lat">
        <a-input v-model:value="form.lat" placeholder="请输入纬度" />
      </a-form-item>
      <a-form-item label="站点名称" name="siteName">
        <a-input v-model:value="form.siteName" placeholder="请输入站点名称" />
      </a-form-item>
      <a-form-item label="站点类型" name="siteType">
        <a-select v-model:value="form.siteType" placeholder="请选择站点类型">
          <a-select-option v-for="(item, index) in enums.siteType" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="是否开启预报" name="enabled">
        <a-radio-group v-model:value="form.enabled" @change="(e) => handleChangeForecastFactor(e.target.value, 1)">
          <a-radio :value="item.value" v-for="(item, index) in enums.yn" :key="index">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-item> -->
    </a-form>
    <template #footer>
      <a-button @click="handleCloseDialog">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确认</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { siteTypeGet, ynGet } from '@/api/common/enums.js'
import { siteAdd, siteUpdate } from '@/api/site-manage/index.js'
import { message } from 'ant-design-vue';
const props = defineProps({
  operate: { type: String, default: 'add' },
  rowInfo: { type: Object, default: {} }
})
const emit = defineEmits(['close', 'refresh'])

// 一、初始化相关
const visible = ref(true)
// yn: [{ label: '是', value: 1 }, { label: '否', value: 0 }] 

const form = ref({})
const formRules = ref({
  lon: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  lat: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  siteName: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
  siteType: [{ required: true, message: '站点类型不能为空', trigger: 'change' }],
  enabled: [{ required: true, message: '是否开启预报不能为空', trigger: 'change' }],
})
const dialogTitle = ref('站点管理')
// 0、初始化总调用
async function init() {
  await getEnums()
  initForm()
}
init()
// 1、获取枚举
const enums = ref({ yn: [] })
async function getEnums() {
  // 获取是否 枚举
  let yn = []
  const res1 = await ynGet()
  if (res1.code === 200) {
    res1.data && res1.data.length > 0 && res1.data.forEach((item) => yn.push({ label: item.label, value: item.value }))
  }
  enums.value.yn = yn
  // 获取站点类型 枚举
  let siteType = []
  const res = await siteTypeGet()
  if (res.code === 200) {
    res.data && res.data.length > 0 && res.data.forEach((item) => siteType.push({ lable: item.label, value: item.value }))
  }
  enums.value.siteType = res.data
}
// 1、初始化表单
function initForm() {
  // console.log('查类型', props.operate)
  switch (props.operate) {
    case 'add':
      form.value = {}
      dialogTitle.value = '站点管理 - 新增'
      break
    case 'update':
      form.value = props.rowInfo
      dialogTitle.value = '站点管理 - 修改'
      break
  }
  // console.log('查表单', form.value)
}
// 二、操作相关
// 1、确认
const formRef = ref(null)
function handleConfirm() {
  formRef.value.validateFields().then(() => {
    switch (props.operate) {
      case 'add':
        let params1 = form.value
        siteAdd(params1).then(res => {
          message.success('站点新增成功！')
          emit('close')
          emit('refresh')
        })
        break
      case 'update':
        form.value = props.rowInfo
        dialogTitle.value = '站点管理 - 修改'
        let params2 = form.value
        siteUpdate(params2).then(res => {
          message.success('站点修改成功！')
          emit('close')
          emit('refresh')
        })
        break
    }
  }).catch()

}
// 2、关闭
function handleCloseDialog() {
  emit('close')
}
</script>

<style lang="scss">
.site-manage-operate-dialog {
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