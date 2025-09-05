<template>
  <div :class="['hamburger', `${type}-hamburger`]" @click="handleToggle">
    <c-icon i="c-operate-hamburger-collapse-left" :class="{ 'is-collapse': isCollapse }" cursor="pointer" size="12" v-if="type === 'left'"></c-icon>
    <c-icon i="c-operate-hamburger-collapse-top" :class="{ 'is-collapse': isCollapse }" cursor="pointer" size="18" v-if="type === 'top'"></c-icon>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  type: { type: String, default: 'left' },
})
// pinia
import useStore from '@/store'
// 声明
const { settingStore } = useStore()
// 计算属性
const isCollapse = computed(() => settingStore.leftSide.isCollapse)
// ^
// # 二、模块功能
// # 1、切换 折叠展开
const handleToggle = () => {
  settingStore.leftSide.isCollapse = !settingStore.leftSide.isCollapse
  settingStore.setLeftSide()
}
// ^
// ^
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-flex;
  align-items: center;
  height: 100%;
  color: var(--fct);

  .is-collapse {
    transform: rotate(180deg);
  }
}
</style>