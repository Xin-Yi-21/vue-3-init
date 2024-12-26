<template>
  <el-button class="c-button" :size="size" :type="type" :plain="plain" :round="round" :circle="circle" :loading="loading" :disabled="disabled" :icon="icon" :autofocus="autofocus" :native-type="nativeType" :style="`width:${width ? width + 'px' : 'auto'};height:${height ? height + 'px' : settingStore.theme?.cssV?.hc}`">
    <svg-icon v-if="i" :icon-class="i" :style="`fontSize:${iSize ? iSize + 'px' : settingStore.theme?.cssV?.fs}`"></svg-icon>
    <span class="button-text">
      <slot></slot>
    </span>
  </el-button>
</template>

<script setup>
const props = defineProps({
  // 按钮图标
  i: { type: String, default: '', },
  // 按钮图标 (element自带)
  icon: { type: String, default: '' },
  // 按钮图标大小
  iSize: { type: [Number, String], default: '' },
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
import useSettingStore from '@/store/system/setting'
const settingStore = useSettingStore()
</script>

<style lang="scss" scoped>
.c-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  // height: var(--hc);
  margin: 0 10px;
  padding: 0 15px;

  &[class*="is-disabled"] {
    cursor: not-allowed !important;
  }

  &:last-child {
    margin-right: 0;
  }

  >span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .svg-icon {
      flex-shrink: 0;
      font-size: 14px;
    }

    .button-text {
      text-indent: 5px;
    }
  }
}
</style>