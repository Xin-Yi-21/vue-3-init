<template>
  <div class="warning-vue">
    <div class="warning-header">
      <div :class="['tab-item', currentTab === 'warningQuery' ? 'active' : '']" @click="handleTabChange('warningQuery')">
        <div class="rectangle"><svg-icon icon-class="warning-query"></svg-icon> </div>告警查询
      </div>
      <div :class="['tab-item', currentTab === 'warningSet' ? 'active' : '']" @click="handleTabChange('warningSet')">
        <div class="rectangle"><svg-icon icon-class="warning-set"></svg-icon> </div>告警设置
      </div>
    </div>
    <div class="warning-content">
      <WarningQuery v-if="currentTab === 'warningQuery'"></WarningQuery>
      <WarningSet v-if="currentTab === 'warningSet'"></WarningSet>
    </div>
  </div>
</template>

<script setup>
import WarningQuery from './components/warning-query.vue'
import WarningSet from './components/warning-set.vue'
const currentTab = ref('warningSet')
function handleTabChange(type) {
  currentTab.value = type
}

</script>

<style scoped lang="scss">
.warning-vue {
  width: 100%;
  height: 100%;

  .warning-header {
    height: 50px;
    background-color: #f8f8f8;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .tab-item {
      width: 140px;
      height: 30px;
      border: 1px solid #168CFF;
      background: #E6F7FF;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      margin: 0 10px;
      color: #168CFF;
      cursor: pointer;

      .rectangle {
        width: 18px;
        height: 18px;
        background-color: #168CFF;
        text-align: center;
        line-height: 18px;
        border-radius: 4px;
        margin-right: 5px;
        color: #fff;
      }

      &.active {
        background: #168CFF;
        color: #fff;

        .rectangle {
          background-color: #fff;
          color: #168CFF;
        }
      }
    }
  }

  .warning-content {
    height: calc(100% - 70px);
    margin: 0 10px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #CDD0D4;
    display: flex;
    flex-direction: column;

  }
}
</style>