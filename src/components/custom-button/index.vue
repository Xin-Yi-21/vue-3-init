<template>
  <el-button class="c-button" v-bind="$attrs" :style="`${width ? `--width:${$setCssSize(width)};` : ''} ${height ? `--height:${$setCssSize(height)};` : ''} ${iSize ? `--iSize:${setCssSize(iSize)};` : ''} ${fSize ? `--fSize:${$setCssSize(fSize)};` : ''} ${cColor ? `--cColor:${cColor};` : ''}`">
    <template #loading>
      <c-icon i="c-loading-circle" class="el-icon is-loading"></c-icon>
    </template>

    <template #icon v-if="slots.icon || i">
      <c-icon v-if="i" :i="i" :size="iSize"></c-icon>
    </template>
    <template #default v-if="slots.default">
      <span class="button-text">
        <slot></slot>
      </span>
    </template>
  </el-button>
</template>

<script setup>


const props = defineProps({
  // 非element按钮图标
  i: { type: String, default: '', },
  // 按钮图标大小
  iSize: { type: [Number, String], default: '' },
  // 按钮字体大小
  fSize: { type: [Number, String], default: '' },
  // 按钮宽度
  width: { type: [Number, String], default: '' },
  // 按钮高度
  height: { type: [Number, String], default: '' },
  // 内容颜色
  cColor: { type: String, default: '' },
})
const slots = useSlots()
defineOptions({ inheritAttrs: false })
</script>

<style lang="scss" scoped>
.c-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // overflow: hidden;
  width: var(--width, 'auto');
  height: var(--height, var(--ch));
  margin: 0 10px;
  padding: 0 15px;
  color: var(--cColor, var(--el-button-text-color));

  &[class*="is-disabled"] {
    cursor: not-allowed;
  }

  // &[class*="is-loading"] {
  //   cursor: wait;
  //   pointer-events: auto;
  // }


  &:last-child {
    margin-right: 0;
  }

  :deep(.el-icon) {
    font-size: var(--iSize, var(--cfs));
  }


  :deep([class*="el-icon"]+span) {
    margin-left: 5px;
  }

  >span {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .button-text {
      font-size: var(--fSize, var(--cfs));
      font-weight: 400;
    }
  }
}
</style>