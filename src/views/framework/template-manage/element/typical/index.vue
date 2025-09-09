<template>
  <div class="element-vue">
    <c-tab type="bg-card" :tabList="tabList" v-model="currentTab"></c-tab>

    <div class="tab-pane">
      <Table v-if="currentTab === '表格'"></Table>
    </div>

  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Table from './table/index.vue'
// ^

// # 二、模块功能
// # tab
const currentTab = ref('表格')
const tabList = [
  { label: '表格', value: '表格' },
]
// ^
// ^
</script>

<style lang="scss" scoped>
.element-vue {
  >.tab-pane {
    height: calc(100% - 36px);
  }
}
</style>