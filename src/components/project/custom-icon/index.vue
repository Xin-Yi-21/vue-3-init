<template>
  <i :class="{ 'c-icon': true, 'is-disabled': disabled }" :style="`color:${color};font-size:${size}px;cursor:${cursor};--hoverColor:${hoverColor || color};`" @click="handleIconClick">
    <el-tooltip trigger="hover" :offset="5" placement="top" effect="light" popper-class="c-icon-tooltip" v-if="tip && showType == 'el'" :hide-after="0">
      <svg-icon :icon-class="i"></svg-icon>
      <template #content> <span :style="`color:${hoverColor || color};`">{{ tip }}</span></template>
    </el-tooltip>
    <template v-else>
      <svg-icon :icon-class="i"> </svg-icon>
      <span class="icon-tip" :style="`top:${topTipPx}px`" v-if="tip">{{ tip }}</span>
    </template>
  </i>
</template>

<script setup>
const props = defineProps({
  // 引用svg文件名称
  i: { type: String, default: '', },
  // 图标颜色
  color: { type: String, default: 'inherit', },
  // 图标悬浮颜色
  hoverColor: { type: String, default: '', },
  // 图标大小
  size: { type: [Number, String], default: '16', },
  // 图标提示
  tip: { type: String, default: '', },
  // 禁用
  disabled: { type: Boolean, default: false, },
  // 间距
  topTipPx: { type: [Number, String], default: -1, },
  // 显示类型
  showType: { type: String, default: 'custom', },
  // 悬浮效果
  cursor: { type: String, default: 'auto', },
})
const emit = defineEmits()
const handleIconClick = (e) => {
  e.stopImmediatePropagation()
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.c-icon {
  position: relative;
  display: inline-flex;
  font-style: normal;
  font-weight: 400;
  margin: 0 5px;
  // color: var(--color);

  &:hover {
    * {
      color: var(--hoverColor);
    }
  }

  &[class*="is-disabled"] {
    cursor: not-allowed !important;
    // pointer-events: none; 禁止元素接收鼠标事件
    opacity: 0.6;
  }

  .svg-icon {
    font-size: inherit;
  }

  .svg-icon:hover~.icon-tip {
    display: block;
  }

  .icon-tip {
    position: absolute;
    display: none;
    top: -1px;
    left: 50%;
    transform: translate(-50%, calc(-100% - 2px));
    white-space: nowrap;
    font-size: 12px;
    line-height: 12px;
    z-index: 9999;
  }
}
</style>
