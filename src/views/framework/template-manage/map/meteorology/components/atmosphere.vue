<template>
  <div class="atmosphere-box">
    <div
      :class="['atmosphere-item', currentSelected.field === item.field ? 'active' : '']"
      v-for="(item, index) in atmosphereTypeList"
      :key="index"
      @click="handleClick($event, item)">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
// # 一、综合
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import 'leaflet-velocity/dist/leaflet-velocity.min.css'
import 'leaflet-velocity/dist/leaflet-velocity.min.js'
import { renderWindImage, tooltipLayer, renderOtherAtmosphereImage } from '../hooks/atmosphere-load.js'
import useMapStore from "@/store/map.js";
const { map } = storeToRefs(useMapStore())
const { currentTime, apiData, atmosphereTypeList, configInfo } = defineProps({
  // 当前时间
  currentTime: {
    type: String,
    required: true
  },
  // 接口返回数据
  apiData: {
    type: Object,
    required: true,
  },
  // 气象类型列表
  atmosphereTypeList: {
    type: Array,
    required: true
  },
  // 配置信息
  configInfo: {
    type: Object,
    required: true
  }
})
// ^

// # 二、模块功能
// # 点击事件 
let lastSelected = ref() // 上次点击
let currentSelected = ref({ label: '2米气温', field: 'tempPath', unit: '°C', icon: '' }) // 当前点击
function handleClick(event, item) {
  // 获取当前点击
  currentSelected.value = item
  // 上次选中有值时，去除上次点击元素的active类
  lastSelected.value ? lastSelected.value.ele.classList.remove('active') : ''
  // 给当前点击元素添加active类
  event.target.classList.toggle('active')
  // 获取上次点击的元素的信息
  lastSelected.value = { type: item.field, ele: event.target }

  // 加载气象信息 
  loadAtmosphereInfo(configInfo, item, currentTime)
}
// ^
// # 渲染气象信息  
function loadAtmosphereInfo(configInfo, item, currentTime) {
  if (!item) return console.warn('须先选中类型')
  const prefix_url = 'http://192.168.130.17/nginxFiles/resources/shandongforecast'

  // 过滤当前日期数据
  const atmosphereData = apiData['2024-12-06 01:00:00']
  // const atmosphereData = apiData[currentTime]
  if (!atmosphereData) return

  // 如果地图上存在点击事件，则移除地图上所有的点击事件
  if (map.value.listens('click')) { map.value.off('click'); }
  // 去除已有气象图层 
  configInfo.currentModuleMap.imageLayer && configInfo.currentModuleMap.imageLayer.removeFrom(map.value)
  // 关闭并去除已有tooltip
  if (tooltipLayer.value) {
    tooltipLayer.value.close()
    tooltipLayer.value.remove()
  }

  let param = {
    map: map.value, // 地图
    boundings: [[25, 100], [50, 140]], // 影像范围：左下角、右上角
    position: { lng: null, lat: null }, // 点击位置
    imgUrl: prefix_url + atmosphereData[`${item.field}`], // 影像url
    url: prefix_url + atmosphereData[`${item.field}`]?.replace('.png', '.txt'), // 影像url转txt文本
    windUUrl: prefix_url + atmosphereData?.windUPath, // u向风url
    windVURl: prefix_url + atmosphereData?.windVPath, // v向风url
    currentModuleMap: configInfo?.currentModuleMap, // 配置信息
    legendLRV: configInfo?.legendLRV, // 配置信息
    areaCoordinate: configInfo?.areaCoordinate, // 指定区域，用于判断某个点是否在该区域内，是一个三维数组
    currentFactor: configInfo?.currentFactor, // 渲染类型：temp、pre、windSpeed、windDirection
    className: configInfo?.className, // tooltip类名
    currentSelected: currentSelected.value, // 当前点击
  }

  let windFields = ['wind10Path', 'wind100Path']
  windFields.includes(item.field) ? renderWindImage(param) : renderOtherAtmosphereImage(param)
}
// ^
// ^

// # 三、生命周期
// # 监听时间变化 
watch(() => currentTime, (value) => {
  loadAtmosphereInfo(configInfo, currentSelected.value, value)
}, { immediate: false })
// ^
// ^
</script>

<style lang="scss" scoped>
.atmosphere-box {
  position: absolute;
  left: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 2;
  border-radius: 20px;
  background-color: #eee;

  .atmosphere-item {
    &:hover {
      font-weight: 700;
      cursor: pointer;
    }
  }

  .active {
    font-weight: 700;
  }
}
</style>