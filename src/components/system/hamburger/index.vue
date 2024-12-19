<template>
  <div class="hamburger" @click="handleToggle">
    <c-icon i="c-hamburger-collapse" :class="{ 'is-collapse': isCollapse }" size="24"></c-icon>
  </div>
</template>

<script setup>
defineProps({
  isCollapse: {
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
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  color: var(--fcpl);

  .is-collapse {
    transform: rotate(180deg);
  }
}
</style>