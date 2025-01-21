<template>
  <div class="c-tab" :style="`--tabHeight:${height}px`">
    <div :class="['tab-item', currentTab == item.value ? 'is-active' : '']" v-for="(item, index) in tabList" :key="index" @click="handleChangeTab(item)">{{ item.label }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  // tab页数组
  tabList: { type: Array, default: () => [] },
  // 当前tab页
  currentTab: { type: String, default: '' },
  // 高度
  height: { type: [String, Number], default: 36 },
})
const emit = defineEmits(['change'])
function handleChangeTab(tabItem) {
  emit('change', tabItem)
}

</script>

<style lang="scss" scoped>
.c-tab {
  display: inline-flex;
  width: auto;
  height: var(--tabHeight);
  overflow: hidden;
  border-radius: 18px;
  font-size: var(--fs);

  .tab-item {
    min-width: 120px;
    height: 100%;
    padding: 0 20px;
    border: 1px solid var(--bcs);
    border-right: 0;
    color: var(--fcp);
    line-height: var(--tabHeight);
    text-align: center;
    cursor: pointer;

    &:first-child {
      border-top-left-radius: 18px;
      border-bottom-left-radius: 18px;
    }

    &:last-child {
      border-right: 1px solid var(--bcs);
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
    }

    &.is-active {
      background-color: var(--tc);
      border-color: var(--tc);
      color: #fff;
      font-weight: 700;

      &+div {
        border-left-color: var(--tc);
      }
    }
  }
}
</style>