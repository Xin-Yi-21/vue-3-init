<template>
  <div class="c-card-header" :style="border ? `border-bottom:1px solid var(--bcp)` : ''">
    <div class="left">
      <c-card-title v-if="title" :title="title" :icon="icon"></c-card-title>
      <slot name="left"></slot>
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
  width: 100%;
  height: 50px;
  padding: 0 10px;

  .left {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: auto;
  }

  .right {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>