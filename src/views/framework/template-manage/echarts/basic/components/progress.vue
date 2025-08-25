<template>
  <div class="progress-vue">
    <div class="card-title">进度图</div>
    <c-icon class="echart-export" i="c-download" tip="导出图片" size="20" cursor="pointer" :color="settingStore.themeColor" :hoverColor="settingStore.themeColor" showType="el" @click="handleExportEchart()"></c-icon>
    <el-progress type="circle" :percentage="36" :stroke-width="20" stroke-linecap="butt" :indeterminate="true" :color="settingStore.themeColor"></el-progress>
  </div>
</template>
<script setup>
// stroke-linecap: butt round square
// # 一、综合
import useSettingStore from '@/store/framework/setting'
const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
// ^
// # 二、模块功能
// # 1、导出echart
function handleExportEchart() {

}
// ^
// ^
</script>

<style lang="scss" scoped>
.progress-vue {
  width: 100%;
  height: 100%;
  position: relative;
  color: var(--fcp);

  .card-title {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--fcp);
    font-weight: bold;
    font-size: 14px;
  }

  .echart-export {
    position: absolute;
    top: 5px;
    right: 10px;
    font-weight: 700;
    z-index: 9;
  }

  :deep(.el-progress) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 10px));

    .el-progress-circle {
      width: 240px !important;
      height: 240px !important;
    }

    .el-progress__text {
      font-size: 20px !important;
      font-weight: bold;
      color: var(--tc);
    }
  }
}
</style>