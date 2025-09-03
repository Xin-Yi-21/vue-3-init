<template>
  <div class="hamburger" @click="handleToggle">
    <c-icon i="c-operate-hamburger-side-collapse" :class="{ 'is-collapse': isCollapse }" cursor="pointer" size="12" v-if="type === 'left'"></c-icon>
    <c-icon i="c-hamburger-collapse" :class="{ 'is-collapse': isCollapse }" cursor="pointer" size="24" v-if="type === 'top'"></c-icon>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'left' },
  isCollapse: { type: Boolean, default: false },
})
const emit = defineEmits()
const handleToggle = () => {
  if (props.type === 'left') {
    emit('toggleClick')
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  color: var(--fct);

  .is-collapse {
    transform: rotate(180deg);
  }
}
</style>