<template>
  <div class="meteorology-vue">
    <div class="main-page">
      <div id="map"></div>
    </div>
    <MapTool :toolsList="toolsList" />
    <Atmosphere :currentTime="currentTime" :apiData="apiData" :atmosphereTypeList="atmosphereTypeList" :configInfo="configInfo" />
  </div>
</template>

<script setup>
// # 一、综合 
import { storeToRefs } from "pinia";
import * as L from 'leaflet'
import "leaflet/dist/leaflet.css";
import MapTool from './components/map-tool.vue';
import Atmosphere from './components/atmosphere.vue'
import useMapStore from "@/store/project/map.js";
import { toolsList, atmosphereTypeList, configInfo } from './hooks/enums'
const { tianDiToken } = storeToRefs(useMapStore())
const { obtainMap, obtainBaseLayer } = useMapStore()
// ^

// # 二、模块功能
// #  初始化地图
let map
function initMap() {
  // 优先采用本地缓存的底图
  let vectorUrl = `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianDiToken.value}`
  const cacheUrl = localStorage.getItem('baseLayerUrl')
  // 优先才用本地缓存的底图类型
  const currentLayer = L.tileLayer(cacheUrl || vectorUrl);
  obtainBaseLayer(currentLayer)
  // 配置地图
  map = L.map("map", {
    layers: [currentLayer],
    center: [36.7, 117],
    zoom: 8,
    minZoom: 4,
    maxZoom: 16,
    // 属性控件
    attributionControl: false,
    // 缩放控件
    zoomControl: false,
    // 是否自动关闭popup(为false时可以同时显示多个popup)
    closePopupOnClick: true,
    // 地图是否会自动根据浏览器窗口的大小来更新自己
    trackResize: true,
    // 是否可以在按住shift键的同时缩放至选中矩形区域
    boxZoom: false,
    // 是否可以以在按住shift键的同时双击缩小地图, 不按住shift放大地图
    doubleClickZoom: false,
    // 是否允许通过滚轮缩放地图: 如果设置为'center'，则不管鼠标在哪，都只会放大到视图的中心
    scrollWheelZoom: true,
    // 地图是否可以被拖动
    dragging: true,
    // 地图在拖动时是否有惯性(阻尼)
    inertia: true,
  });
  obtainMap(map)
}
// ^
// # 模拟接口 
let apiData = ref({})
function getApiData() {
  fetch('/map/qxsj').then(response => response.json()).then(result => {
    for (let index = 0; index < result.data.length; index++) {
      apiData.value[result.data[index]['dataTime']] = result.data[index]
    }
  })
}
// ^
// # 时间轴 
let currentTime = ref('2024-12-06 01:00:00')
// ^
// ^

// # 三、生命周期 
onMounted(() => {
  getApiData()
  if (!map) { initMap() }
})
// ^
</script>

<style lang="scss" scoped>
.meteorology-vue {
  position: relative;
  width: 100%;
  height: 100%;

  .main-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    #map {
      width: 100%;
      height: calc(100% - 90px);
      z-index: 1;
    }

  }

  // .txt-image-tooltip：直接修改.leaflet-tooltip也能改变样式，但控制台可能会有不影响功能的报错
  :deep(.txt-image-tooltip) {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    //min-width:100px;
    min-height: 50px;
    background: rgba(0, 0, 0, .55);
    border-radius: 5px;
    color: #fff;

    .tooltip-item {
      display: flex;
      align-items: center;
      height: 15px;
      padding: 8px;

      .item-icon {
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin-right: 8px;
      }

      .item-text {
        display: flex;
        justify-content: space-between;
        min-width: 150px;

        .text-left {
          color: #fff;
        }

        .text-right {
          color: rgba(255, 255, 255, 0.8);
          margin-left: 40px;
        }
      }
    }
  }
}
</style>