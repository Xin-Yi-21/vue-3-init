<template>
  <div class="c-data-with-unit">
    <template v-if="data != undefined && data !== ''">
      <template v-if="isShowTip">
        <!-- <c-tooltip :content="data + ''" targetClass="data"> <span class="data">{{ data }}</span></c-tooltip> -->
        <c-tooltip :content="data + ''" class="data"> {{ data }}</c-tooltip>
        <span class="unit">{{ unit }}</span>
      </template>
      <template v-else>
        <span class="data">{{ data }}</span>
        <span class="unit">{{ unit }}</span>
      </template>
    </template>
    <span v-else class="no-data">暂无数据</span>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { default: '', },
  unit: { type: String, default: '', },
  isShowTip: { type: Boolean, default: false },
  placement: { type: String, default: 'top' },
  effect: { type: String, default: 'light' },
})
</script>

<style lang="scss" scoped>
.c-data-with-unit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;

  .c-tooltip {
    display: block;
    overflow: hidden;
  }

  .data {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    line-height: 20px;
    color: var(--tc);
    font-size: 14px;
    font-weight: 700;
  }

  .unit {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
    padding-left: 5px;
    font-size: 14px;
  }

  .no-data {
    color: var(--tct);
    font-size: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

}
</style>