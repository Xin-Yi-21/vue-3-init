<template>
  <el-button class="c-button" v-bind="$attrs" :style="`width:${width ? width + 'px' : 'auto'};${height ? 'height:' + height + 'px' : ''}`">
    <template #loading>
      <svg-icon icon-class="c-loading-circle" class-name="el-icon is-loading" :style="`${iSize ? 'fontSize:' + iSize + 'px' : ''}`"></svg-icon>
    </template>

    <template #icon v-if="slots.icon || i">
      <svg-icon v-if="i" :icon-class="i" :style="`${iSize ? 'fontSize:' + iSize + 'px' : ''}`"></svg-icon>
    </template>
    <template #default v-if="slots.default">
      <span class="button-text" :style="`${fSize ? 'fontSize:' + fSize + 'px' : ''}`">
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
  height: var(--ch);
  margin: 0 10px;
  padding: 0 15px;

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
    font-size: var(--cfs);
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
      font-size: var(--cfs);
      font-weight: 400;
    }
  }
}
</style>