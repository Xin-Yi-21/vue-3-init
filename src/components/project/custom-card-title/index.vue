<template>
  <div class="c-card-title">
    <c-card-circle v-if="icon === 'circle'"></c-card-circle>
    <c-card-rectangle v-else-if="icon === 'rectangle'"></c-card-rectangle>
    <svg-icon v-else-if="icon" :icon-class="icon" class-name="card-title-icon"></svg-icon>
    <span class="card-title">{{ title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: '', },
  title: { type: String, default: '', },
})
</script>

<style lang="scss" scoped>
.c-card-title {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  height: 100%;
  padding: 0 10px;

  .card-title-icon-svg {
    flex-shrink: 0;
    font-size: 18px;
  }

  .card-title {
    color: var(--fcp);
    font-weight: 700;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>