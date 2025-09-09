<template>
  <div class="form-vue">
    <c-tab type="underline" :tabList="tabList" v-model="currentTab"></c-tab>
    <div class="tab-pane">
      <CrossPageSelect v-if="currentTab === '跨页选择'"> </CrossPageSelect>
      <Merge v-if="currentTab === '合并表格'"> </Merge>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
import CrossPageSelect from './cross-page-select/index.vue'
import Merge from './merge/index.vue'
// ^
// # 二、模块功能
// # 1、辅助交互
// # tab
const currentTab = ref('合并表格')
const tabList = [
  { label: '跨页选择', value: '跨页选择' },
  { label: '高亮表格', value: '高亮表格' },
  { label: '编辑表格', value: '编辑表格' },
  { label: '合并表格', value: '合并表格' },
  { label: '统计表格', value: '统计表格' },

  { label: '单项表格', value: '单项表格' },
  { label: '大数据表格', value: '大数据表格' },
]
// ^
// ^
// # 三、机制
// ^
</script>

<style lang="scss" scoped>
.form-vue {
  height: 100%;

  >.tab-pane {
    height: calc(100% - 36px);
  }
}
</style>