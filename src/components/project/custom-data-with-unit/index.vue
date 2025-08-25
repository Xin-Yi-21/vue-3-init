<template>
  <div class="c-data-with-unit">
    <template v-if="data != undefined && data !== ''">
      <template v-if="showTip">
        <c-tooltip :content="data + ''" ref="tooltipRef" triggerClass="data" v-bind="$attrs"> {{ data }}</c-tooltip>
        <span class="unit">{{ unit }}</span>
      </template>
      <template v-else>
        <span class="data">{{ data }}</span>
        <span class="unit">{{ unit }}</span>
      </template>
    </template>
    <span v-else class="no-data">{{ noDataText }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  // 数据
  data: { default: '', },
  // 单位
  unit: { type: String, default: '', },
  // 是否显示提示
  showTip: { type: Boolean, default: false },
  // 无数据显示文字
  noDataText: { type: String, default: '暂无数据' },
})
// const tooltipRef = ref(null)
// onUpdated(() => {
//   nextTick(() => { tooltipRef.value && tooltipRef?.value?.checkOverflow() })
// })
</script>

<style lang="scss" scoped>
.c-data-with-unit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;

  :deep(.c-tooltip-trigger) {
    width: auto;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    color: var(--tc);
    font-size: var(--cfs);
    font-weight: 700;
  }

  .unit {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
    padding-left: 5px;
    font-size: var(--cfs);
  }

  .no-data {
    color: var(--fct);
    font-size: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

}
</style>