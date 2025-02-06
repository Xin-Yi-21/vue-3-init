<template>
  <div class="basic-echart-vue y-scroll">
    <!-- 折线图，柱状图，折线柱状图，扇形图，雷达图，风向玫瑰图，扇形进度图（），仪表图，水球图 -->
    <div class="echart-card line">
      <line-echart></line-echart>
    </div>
    <div class="echart-card bar">
      <bar-echart></bar-echart>
    </div>
    <div class="echart-card line-bar">
      <line-bar-echart></line-bar-echart>
    </div>
    <div class="echart-card pie">
      <pie-echart></pie-echart>
    </div>
    <div class="echart-card radar">
      <radar-echart></radar-echart>
    </div>
    <div class="echart-card rose">
      <wind-rose-echart></wind-rose-echart>
    </div>
    <div class="echart-card liquid">
      <liquid-echart></liquid-echart>
    </div>
    <div class="echart-card gauge">
      <dashbord-echart></dashbord-echart>
    </div>
    <div class="echart-card progress">
      <progress-echart></progress-echart>
    </div>

  </div>
</template>

<script setup>
import LineEchart from './components/line'
import BarEchart from './components/bar'
import LineBarEchart from './components/line-bar'
import PieEchart from './components/pie'
import RadarEchart from './components/radar'
import WindRoseEchart from './components/wind-rose'
import LiquidEchart from './components/liquid'
import DashbordEchart from './components/dashbord'
import ProgressEchart from './components/progress'

</script>

<style lang="scss" scoped>
.basic-echart-vue {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  background-color: var(--bg-card);

  .echart-card {
    width: 33.33%;
    height: 50%;
    border-right: 1px solid var(--bcs);
    border-bottom: 1px solid var(--bcs);
    flex-shrink: 0;
  }
}
</style>