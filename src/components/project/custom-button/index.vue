<template>
  <el-button class="c-button" :size="size" :type="type" :plain="plain" :round="round" :circle="circle" :loading="loading" :disabled="disabled" :icon="icon" :autofocus="autofocus" :native-type="nativeType" :style="`width:${width ? width + 'px' : 'auto'};height:${height ? height + 'px' : '36px'}`" @click="$emit('click')">
    <svg-icon v-if="i" :icon-class="i" :style="`fontSize:${iSize}px`"></svg-icon>
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    i: { type: String, default: '', },
    iSize: { type: [Number, String], default: '14' },
    size: { type: String, default: '', },
    type: { type: String, default: '', },
    plain: { type: Boolean, default: false, },
    round: { type: Boolean, default: false, },
    circle: { type: Boolean, default: false, },
    loading: { type: Boolean, default: false, },
    disabled: { type: Boolean, default: false, },
    icon: { type: String, default: '' },
    autofocus: { type: Boolean, default: false, },
    nativeType: { type: String, default: 'button' },
    width: { type: [Number, String], default: '' },
    height: { type: [Number, String], default: '' },
  },
  data() {
    return {

    }
  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>
::v-deep.c-button {
  height: 36px;
  margin: 0 10px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &[class*="is-disabled"] {
    cursor: not-allowed !important;
    /* 改变鼠标指针样式为不允许操作 */
    // pointer-events: none; /* 禁止元素接收鼠标事件 */
    // opacity: 1;
    /* 设置元素透明度为半透明，以表示禁用状态 */
  }

  &:last-child {
    margin-right: 0;
  }

  span {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .svg-icon {
      flex-shrink: 0;
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>