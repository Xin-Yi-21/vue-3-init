<template>
  <div class="c-tooltip">
    <el-tooltip popper-class="c-el-tooltip" :trigger="trigger" :disabled="isDisabled" effect="light" :placement="placement" :show-after="showAfter" :hide-after="hideAfter">
      <template #content>
        <div class="c-tooltip-content">{{ content }}</div>
      </template>
      <div class="normal-content" ref="slotRef">
        <slot></slot>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'top'
  },
  trigger: {
    type: String,
    default: 'hover'
  },
  targetClass: {
    type: String,
    default: '',
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
})

const isDisabled = ref(true)
const slotRef = ref(null)

// 检查内容是否超出
const checkOverflow = () => {
  let targetElement = null
  if (slotRef.value) {
    targetElement = slotRef.value
    if (props.targetClass) {
      targetElement = slotRef.value.querySelector('.' + props.targetClass)
    }
  }
  if (targetElement) {
    const { scrollWidth, clientWidth } = targetElement
    //   console.log('查scrollWidth', scrollWidth)
    //   console.log('查clientWidth', clientWidth)
    isDisabled.value = !(scrollWidth > clientWidth)
  }
}
// 组件挂载后检查
onMounted(() => {
  nextTick(checkOverflow)
})
onUpdated(() => {
  nextTick(checkOverflow)
})
// 监听 content 属性的变化
watch(() => props.content, () => {
  nextTick(checkOverflow)
})
</script>

<style lang="scss">
.c-tooltip {
  width: 100%;

  .el-tooltip__trigger {
    display: block;
    width: 100% !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.c-el-tooltip {
  padding: 5px 10px !important;
  border: 1px solid var(--bcp) !important;
  border-radius: 4px !important;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  // background: var(--bg-card) !important;
  opacity: 1;
  color: var(--fcp) !important;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129)) !important;

  .c-tooltip-content {
    max-width: 800px;
    line-height: 20px;
    font-size: 14px;
    color: var(--fcp);
  }

  .el-popper__arrow {
    position: absolute;

    &::before,
    &::after {
      // background-color: var(--bg-card) !important;
      background: linear-gradient(45deg, #b2e68d, #bce689) !important;
      border-color: var(--bcp) !important;
    }
  }
}
</style>