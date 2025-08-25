<template>
  <el-tooltip popper-class="c-tooltip" :disabled="isDisabled" :placement="placement" v-bind="$attrs">
    <template #content>
      <div class="c-tooltip-content" :style="`max-width:${maxWidth}px;`">{{ content }}</div>
    </template>
    <template #default>
      <div :class="['c-tooltip-trigger', triggerClass || '']" ref="slotRef" @mouseenter="handleMouseEnter">
        <slot></slot>
      </div>
    </template>
  </el-tooltip>
</template>

<script setup>
// # 一、综合
const props = defineProps({
  // 触发类名
  triggerClass: { type: String, default: '' },
  // 目标类名
  targetClass: { type: String, default: '' },
  // 提示内容
  content: { type: [Number, String], default: '' },
  // 提示最大宽度
  maxWidth: { type: [Number, String], default: 360 },
  // 提示一直显示
  alwaysShow: { type: Boolean, default: false },
  // 提示位置
  placement: { type: String, default: 'top' },
})
// ^

// # 二、模块功能
// # 1、检查内容是否超出
const slotRef = ref(null)
const isDisabled = ref(true)
let overflowChecked = false // 缓存标记
function checkOverflow() {
  if (props.alwaysShow) {
    isDisabled.value = false
    return
  }
  let targetElement = slotRef.value
  if (targetElement && props.targetClass) {
    targetElement = targetElement.querySelector('.' + props.targetClass)
    if (targetElement) targetElement.style.display = 'inline-block'
  }

  if (targetElement) {
    const { scrollWidth, clientWidth } = targetElement
    isDisabled.value = !(scrollWidth > clientWidth)
  } else {
    isDisabled.value = true
  }
}
// 鼠标悬入监测
function handleMouseEnter() {
  if (!overflowChecked) {
    nextTick(() => {
      checkOverflow()
      overflowChecked = true
    })
  }
}
// ^
// ^

// # 三、机制
watch(() => props.content, () => {
  overflowChecked = false
})
onUpdated(() => {
  overflowChecked = false
})
defineExpose({ checkOverflow })
// ^
</script>

<style lang="scss">
// 全局样式
.c-tooltip-trigger {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.c-tooltip {
  padding: 4px 9px !important;
  border: 1px solid var(--bcp) !important;
  border-radius: 4px !important;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);

  opacity: 1;
  color: var(--fcp) !important;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129)) !important;

  .c-tooltip-content {
    line-height: 20px;
    font-size: 14px;
    color: var(--fcp);
  }

  .el-popper__arrow {
    position: absolute;

    &::before,
    &::after {
      background: linear-gradient(45deg, #b2e68d, #bce689) !important;
      border-color: var(--bcp) !important;
    }
  }
}
</style>
