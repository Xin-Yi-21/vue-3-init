<template>
  <el-button class="c-button" :size="size" :type="type" :plain="plain" :round="round" :circle="circle" :loading="loading" :disabled="disabled" :icon="icon" :autofocus="autofocus" :native-type="nativeType" :style="`width:${width ? width + 'px' : 'auto'};height:${height ? height + 'px' : '36px'}`" @click="$emit('click')">
    <svg-icon v-if="i" :icon-class="i" :style="`fontSize:${iSize}px`"></svg-icon>
    <slot></slot>
  </el-button>
</template>

<script setup>
const props = defineProps({
  // 按钮图标
  i: { type: String, default: '', },
  // 按钮图标 (element自带)
  icon: { type: String, default: '' },
  // 按钮图标大小
  iSize: { type: [Number, String], default: '14' },
  // 按钮宽度
  width: { type: [Number, String], default: '' },
  // 按钮高度
  height: { type: [Number, String], default: '' },
  // 按钮类型 (element自带)
  type: { type: String, default: '', },
  // 按钮是否禁用 (element自带)
  disabled: { type: Boolean, default: false, },
  // 按钮是否加载 (element自带)
  loading: { type: Boolean, default: false, },
  // 按钮大小 (element自带)
  size: { type: String, default: '', },
  plain: { type: Boolean, default: false, },
  round: { type: Boolean, default: false, },
  circle: { type: Boolean, default: false, },
  autofocus: { type: Boolean, default: false, },
  nativeType: { type: String, default: 'button' },

})
</script>

<style lang="scss" scoped>
:deep(.c-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 36px;
  margin: 0 10px;
  padding: 0 15px;

  &[class*="is-disabled"] {
    cursor: not-allowed !important;
  }

  &:last-child {
    margin-right: 0;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .svg-icon {
      flex-shrink: 0;
      margin-right: 5px;
      font-size: 14px;
    }
  }
}
</style>