<template>
  <span class="c-card-circle out-circle" :style="`width:${outerSize}px;height:${outerSize}px;backgroundColor:${outerColor};`">
    <span class="inner-circle" :style="`width:${innerSize}px;height:${innerSize}px;backgroundColor:${innerColor};`"></span>
  </span>
</template>

<script setup>
const props = defineProps({
  // 外圆颜色
  outerColor: { type: String, default: '', },
  // 内圆颜色
  innerColor: { type: String, default: '', },
  // 外圆大小
  outerSize: { type: [String, Number], default: 12, },
  // 内圆大小
  innerSize: { type: [String, Number], default: 6, },
})
</script>

<style lang="scss" scoped>
.c-card-circle {
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: var(--tca2);

  .inner-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--tc);
  }
}
</style>