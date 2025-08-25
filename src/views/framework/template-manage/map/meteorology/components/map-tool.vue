<template>
  <!--  地图工具-->
  <div class="map-tools">
    <c-icon
      v-for="(item, index) in toolsList" :key="index"
      class="view-icon"
      :i="item.icon"
      :tip="item.label"
      @click.stop="handleClick($event, item)">
    </c-icon>
  </div>
  <!--  切换影像的box-->
  <div class="switch-layer-box" v-show="isShowSwitchLayer">
    <el-radio-group v-model="currentLayer" @change="handleLayerChange">
      <el-radio value="vector">矢量底图</el-radio>
      <el-radio value="image">影像底图</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
// # 一、综合
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import useMapStore from "@/store/map.js";
const { map, tianDiToken, baseLayer } = storeToRefs(useMapStore())
const { toolsList } = defineProps({
  toolsList: {
    type: Array,
    required: true
  }
})
// ^

// # 二、模块功能
// # 点击事件  
let lastSelected = ref() // 上次点击
let isShowSwitchLayer = ref(false) // 是否展示切换图层的box
function handleClick(event, item) {
  if (!item || !map.value) return
  // 当前zoom
  const zoom = map.value.getZoom()
  // 根据点击的要素不同执行不同逻辑
  switch (item.field) {
    case 'addZoom':
      // 不能超过initMap中定义的最大等级
      const maxZoom = map.value.getMaxZoom() // 最大zoom
      if (zoom >= maxZoom) return ElMessage.warning('已达最大缩放等级')
      map.value.setZoom(zoom + 1)
      break;
    case 'subtractZoom':
      // 不能小于initMap中定义的最小等级
      const minZoom = map.value.getMinZoom() // 最小zoom
      if (zoom <= minZoom) return console.warn('已达最小缩放等级')
      map.value.setZoom(zoom - 1)
      break;
    case 'changeLayer':
      // 添加active类 
      event.target.classList.add('active')
      break;
    case 'viewTyphoon':
      // 添加active类
      event.target.classList.add('active')
      break;
    default:
      break;
  }
  // 当前选中为 changeLayer 时(即重复点击changeLayer)， 在‘关闭’与‘打开'间切换，点击其它时关闭
  isShowSwitchLayer.value = item.field === 'changeLayer' ? !isShowSwitchLayer.value : false
  // 上次选中有值时，去除上次点击元素的active类
  lastSelected.value ? lastSelected.value.ele.classList.remove('active') : ''
  // 获取上次点击的元素的信息
  lastSelected.value = { type: item.field, ele: event.target }
}
// ^ 
// # 图层切换 : vector, image
const cacheBaseLayerType = localStorage.getItem('cacheBaseLayerType')
let currentLayer = ref(cacheBaseLayerType || 'vector')
function handleLayerChange(layerType) {
  if (!layerType || typeof layerType !== 'string') return

  // 底图类型对应的url
  const layObj = {
    'vector': `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianDiToken.value}`,
    'image': `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianDiToken.value}`
  }

  if (layObj[`${layerType}`]) {
    // 更新底图url
    baseLayer.value.setUrl(layObj[`${layerType}`])
    // 本地缓存(底图url和缓存的底图类型)
    localStorage.setItem('baseLayerUrl', layObj[`${layerType}`])
    localStorage.setItem('cacheBaseLayerType', layerType)
  }
}
// ^
// ^ 
</script>

<style lang="scss" scoped>
.map-tools {
  position: absolute;
  left: 30px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-height: 200px;
  overflow-y: auto;
  padding: 15px;
  background-color: #eee;
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 2;

  :deep(.c-icon) {
    &:has(.active) {
      .active {
        color: var(--tc);
        font-weight: 700;
      }

      .icon-tip {
        color: var(--tc);
        font-weight: 700;
      }
    }
  }
}

.switch-layer-box {
  position: absolute;
  left: 100px;
  bottom: 120px;
  border-radius: 10px;
  z-index: 2;
  background-color: #eee;

  .el-radio-group {
    display: block;
    padding: 10px;

    .el-radio {
      display: block;
    }
  }
}
</style>