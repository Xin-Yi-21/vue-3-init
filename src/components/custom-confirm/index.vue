<template>
  <el-dialog v-model="dialog.visible" class="c-dialog c-confirm" :style="`width:${dialog.width ? dialog.width + 'px' : 'auto'};height:${dialog.height ? dialog.height + 'px' : 'auto'};`" :before-close="handleClose" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18" cursor="" v-if="dialog.icon"></c-icon> {{ dialog.title }}</div>
        <c-icon i="c-close" class="n-o-i" @click="close"></c-icon>
      </div>
    </template>

    <div class="c-d-c">
      <slot name="default" />
    </div>

    <template #footer>
      <div class="c-d-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const dialog = ref({ visible: false, icon: '', title: '', })

let onConfirm = null
let onCancel = null

// 打开弹窗（接收配置）
function openDialog({ title, icon, nature, width, height, confirm, cancel } = {}) {
  dialog.value.title = title || '确认'
  dialog.value.icon = icon || ''
  dialog.value.nature = nature || '默认'
  dialog.value.width = width
  dialog.value.height = height
  dialog.value.visible = true
  onConfirm = confirm
  onCancel = cancel
}

// 关闭弹窗
function handleClose() {
  dialog.value.visible = false
  onCancel?.()
  cleanup()
}

// 确认操作
async function handleConfirm() {
  const shouldClose = onConfirm ? await onConfirm() : true
  if (shouldClose) {
    dialog.value.visible = false
    cleanup()
  }
}

// 清除回调，防止内存泄漏或冲突
function cleanup() {
  onConfirm = null
  onCancel = null
}
const nature = computed(() => dialog.value.nature)
defineExpose({ openDialog, nature })
</script>

<style lang="scss">
// 全局样式
.c-confirm {
  .el-dialog__header {
    border-bottom: 1px solid var(--bcs);

    .c-d-header {
      height: 50px !important;
    }
  }
}
</style>
