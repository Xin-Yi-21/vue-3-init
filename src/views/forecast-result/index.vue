<template>
  <div class="predictType">
    <a-radio-group v-model:value="predictType" style="display: inline-block;">
      <a-radio-button value="single">单点预报</a-radio-button>
      <a-radio-button value="area">区域预报</a-radio-button>
    </a-radio-group>
  </div>
  <div class="predictContent">
    <singlePredict v-if="predictType === 'single'"></singlePredict>
    <areaPredict v-else></areaPredict>
  </div>
</template>
<script setup>
import singlePredict from './components/singlePredict.vue'
import areaPredict from './components/areaPredict.vue'
let predictType = ref('single')
</script>

<style scoped lang="scss">
.predictType {
  height: 40px;
  width: 100%;
  padding: 5px 10px;
  background-color: #fff;
}

.predictContent {
  height: 100%;
  width: 100%;
}
</style>
