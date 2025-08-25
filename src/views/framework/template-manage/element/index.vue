<template>
  <div class="element-vue">
    <c-tab type="bg-card" :tabList="tabList" v-model="currentTab"></c-tab>

    <div class="tab-pane">
      <Form v-if="currentTab === '表单'"></Form>
      <Table v-if="currentTab === '表格'"></Table>
      <Catalog v-if="currentTab === '目录'"></Catalog>
      <Show v-if="currentTab === '展示'"></Show>
    </div>

  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Form from './form/index.vue'
import Table from './table/index.vue'
import Catalog from './catalog/index.vue'
import Show from './show/index.vue'
// ^

// # 二、模块功能
// # tab
const currentTab = ref('表单')
const tabList = [
  { label: '表单', value: '表单' },
  { label: '表格', value: '表格' },
  { label: '目录', value: '目录' },
  { label: '展示', value: '展示' },
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