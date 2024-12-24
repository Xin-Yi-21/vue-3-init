<template>
  <div class="basic-echart-vue y-scroll">
    <div class="echart-card line">
      <line-echart></line-echart>
    </div>
    <div class="echart-card bar">
      <!-- <bar-echart></bar-echart> -->
    </div>
    <div class="echart-card pie">
      <!-- <pie-echart></pie-echart> -->
    </div>
    <div class="echart-card radar">
      <!-- <radar-echart></radar-echart> -->
    </div>
    <div class="echart-card rose">
      <!-- <wind-rose-echart></wind-rose-echart> -->
    </div>
    <div class="echart-card liquid">
      <!-- <liquid-echart></liquid-echart> -->
    </div>

    <div class="echart-card gauge">
      <!-- <dashbord-echart></dashbord-echart> -->
    </div>
  </div>
</template>

<script setup>
import LineEchart from './components/line'
import BarEchart from './components/bar'
import PieEchart from './components/pie'
import RadarEchart from './components/radar'
import LiquidEchart from './components/liquid'
import DashbordEchart from './components/dashbord'
import WindRoseEchart from './components/wind-rose'
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