<template>
  <div class="echarts-vue">
    <c-tab type="bg-card" :tabList="tabList" v-model="currentTab"></c-tab>

    <div class="tab-pane">
      <Basic v-if="currentTab === '基础'"></Basic>
      <Upgrade v-if="currentTab === '进阶'"></Upgrade>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Basic from './basic/index.vue'
import Upgrade from './upgrade/index.vue'
// ^

// # 二、模块功能
// # tab页
const currentTab = ref('基础')
const tabList = [
  { label: '基础', value: '基础' },
  { label: '进阶', value: '进阶' },
]
// ^
// ^
</script>

<style lang="scss" scoped>
.echarts-vue {
  >.tab-pane {
    height: calc(100% - 36px);
  }
}
</style>