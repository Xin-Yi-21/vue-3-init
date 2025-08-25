<template>
  <div class="c-card-tip">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  // 背景色
  bg: { type: String, default: '', },
})
</script>

<style lang="scss" scoped>
.c-card-tip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tc);
  font-size: 16px;
  font-weight: 700;
}
</style>