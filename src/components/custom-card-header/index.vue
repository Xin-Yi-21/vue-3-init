<template>
  <div class="c-card-header" :style="`${border ? `border-bottom:1px solid var(--bcs);` : ''}`">
    <div class="left">
      <c-card-title v-if="title" :title="title" :icon="icon"></c-card-title>
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 头部图标
  icon: { type: String, default: '' },
  // 头部标题
  title: { type: String, default: '' },
  // 是否有底部边框线
  border: { type: Boolean, default: true },
})
</script>

<style lang="scss" scoped>
.c-card-header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 50px;
  padding: 0 10px;

  .left {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: auto;

    :deep(.c-card-title) {
      padding: 0 10px 0 0;
    }
  }

  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .right {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>