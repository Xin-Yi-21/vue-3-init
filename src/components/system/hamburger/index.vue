<template>
  <div class="hamburger" @click="handleToggle">
    <c-icon i="c-hamburger-expand" :class="{ 'is-expand': isExpand }" size="24"></c-icon>
  </div>
</template>

<script setup>
  defineProps({
    isExpand: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits()
  const handleToggle = () => {
    emit('toggleClick')
  }
</script>

<style lang="scss" scoped>
.hamburger {
  padding: 0 8px;
  height: 100%;
  display: inline-flex;
  align-items: center;

  .is-expand {
    transform: rotate(180deg);
  }
}
</style>