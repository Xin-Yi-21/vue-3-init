<template>
  <div class="echarts-vue">
    <div class="v-header">
      <c-tab :tabList="tabList" :currentTab="currentTab" @change="handleChangeTab"></c-tab>
    </div>
    <div class="v-content">
      <basic-echart v-if="currentTab == 'basic'"></basic-echart>
      <integration-echart v-if="currentTab == 'integration'"></integration-echart>
      <!-- <interaction-echart v-if="currentTab == 'interaction'"></interaction-echart>
      <map-echart v-if="currentTab == 'map'"></map-echart> -->
    </div>
  </div>
</template>

<script setup>
import BasicEchart from './basic-echart/index.vue'
import IntegrationEchart from './integration-echart/index.vue'
// import InteractionEchart from './interaction-echart/index.vue'
// import MapEchart from './map-echart/index.vue'

const tabList = ref(
  [{ label: '基础echarts', value: 'basic' },
  { label: '集成echarts', value: 'integration' },
  { label: '图表交互echarts', value: 'interaction' },
  { label: '地图echarts', value: 'map' },]
)
const currentTab = ref('basic')

function handleChangeTab(newCurrentTab) {
  currentTab.value = newCurrentTab.value
}
</script>

<style lang="scss" scoped>
.echarts-vue {
  .v-header {
    width: calc(100% - 20px);
    height: 50px;
    margin: 10px;
    background-color: var(--bg-card);
    border-radius: 4px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }

  .v-content {
    width: calc(100% - 20px);
    height: calc(100% - 80px);
    margin: 10px;
    border-radius: 4px;
  }
}
</style>