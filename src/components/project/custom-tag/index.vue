<template>
  <el-tag :class="['c-tag', button ? 'is-button' : '']" :color="color" v-bind="$attrs" :style="styleObj">
    <template #default>
      <slot></slot>
    </template>
  </el-tag>
</template>

<script setup>
import { getAlphaColor } from '@/utils/theme'
const props = defineProps({
  // 宽度
  width: { type: [Number, String], default: '' },
  // 高度
  height: { type: [Number, String], default: '' },
  // 主色
  color: { type: String, default: '' },
  // 按钮化
  button: { type: Boolean, default: false },
})

const styleObj = computed(() => {
  const res = {
    'width': props.width ? props.width + 'px' : 'auto',
    'height': props.height ? props.height + 'px' : '',
  }
  if (props.color) {
    res['--color'] = props.color
    res['--light-border-color'] = getAlphaColor(props.color, 0.4)
    res['--light-bg-color'] = getAlphaColor(props.color, 0.1)
  }
  return res
})
</script>

<style lang="scss" scoped>
.c-tag {
  position: relative;
  transition: box-shadow 0.3s ease, transform 0.2s ease;

  :deep(.el-tag__content) {
    height: calc(100% - 2px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.el-tag--dark {
    color: #fff;
    border-color: var(--color, var(--el-tag-border-color));
    background-color: var(--color, var(--el-tag-bg-color)) !important;
  }

  &.el-tag--plain {
    color: var(--color, var(--el-tag-text-color));
    border-color: var(--color, var(--el-tag-border-color));
    background-color: #fff !important;
  }

  &.el-tag--light {
    color: var(--color, var(--el-tag-text-color));
    border-color: var(--light-border-color, var(--el-tag-border-color));
    background-color: var(--light-bg-color, var(--el-tag-bg-color)) !important;
  }

  &.is-button:not(.is-disabled):hover {
    cursor: pointer;
    box-shadow: 0 4px 8px var(--color, var(--el-tag-bg-color)), 0 0 15px var(--color, var(--el-tag-bg-color));
  }
}
</style>