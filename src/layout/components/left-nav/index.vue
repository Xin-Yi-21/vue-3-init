<template>
  <div :class="['left-nav-vue', appStore.leftNav.isExpand ? 'is-expand' : 'is-collapse']">

  </div>
</template>

<script setup>
  import useAppStore from '@/store/system/app'
  const appStore = useAppStore()
</script>

<style scoped lang="scss">
.left-nav-vue {
  height: 100%;
  background-color: pink;

  &.is-expand {
    width: 240px;
  }

  &.is-collapse {
    width: 50px;
  }
}
</style>