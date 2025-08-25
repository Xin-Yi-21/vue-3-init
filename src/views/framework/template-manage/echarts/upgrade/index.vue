<template>
  <div class="upgrade-vue">
    <c-tab type="underline" :tabList="tabList" v-model="currentTab"></c-tab>
    <div class="tab-pane">
      <Integration v-if="currentTab == '折柱集成'"></Integration>
      <Interaction v-if="currentTab == '图表交互'"></Interaction>
      <Large v-if="currentTab == '大型数据'"></Large>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import Integration from './integration/index.vue'
import Interaction from './interaction/index.vue'
import Large from './large/index.vue'
// ^
// # 二、模块功能
// # tab页
const currentTab = ref('折柱集成')
const tabList = [
  { label: '折柱集成', value: '折柱集成' },
  { label: '图表交互', value: '图表交互' },
  { label: '大型数据', value: '大型数据' },
  { label: '相交差集', value: '相交差集' },
  { label: '背景区块', value: '背景区块' },
  { label: '提示联动', value: '提示联动' },
  { label: '悬浮跳转', value: '悬浮跳转' },
]
// ^
// ^
</script>

<style lang="scss" scoped>
.upgrade-vue {
  height: 100%;

  >.tab-pane {
    height: calc(100% - 50px);
  }
}
</style>