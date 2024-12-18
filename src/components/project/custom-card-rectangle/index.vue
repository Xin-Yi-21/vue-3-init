<template>
  <span class="c-card-rectangle" :style="`width:${width}px;height:${height}px;backgroundColor:${bg};`"></span>
</template>

<script setup>
// import variable from '@/assets/styles/variable.scss'
const props = defineProps({
  // 矩形背景色
  bg: { type: String, default: '', },
  // 矩形宽度
  width: { type: [String, Number], default: 5, },
  // 矩形高度
  height: { type: [String, Number], default: 20, }
})
</script>

<style lang="scss" scoped>
.c-card-rectangle {
  position: relative;
  display: inline-block;
  width: 5px;
  height: 20px;
  margin-right: 5px;
  background-color: var(--tc);
}
</style>