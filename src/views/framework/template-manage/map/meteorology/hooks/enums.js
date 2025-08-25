import { ref } from 'vue'

// 工具列表
const toolsList = [
  { label: '放大', field: 'addZoom', icon: 'c-m-plus' },
  { label: '缩小', field: 'subtractZoom', icon: 'c-m-minus' },
  { label: '切换图层', field: 'changeLayer', icon: 'c-m-layer' },
  { label: '查看台风', field: 'viewTyphoon', icon: 'c-m-typhoon' },
]

// 气象类型列表
const atmosphereTypeList = [
  { label: '10米风', field: 'wind10Path', unit: 'm/s', icon: '' },
  { label: '100米风', field: 'wind100Path', unit: 'm/s', icon: '' },
  { label: '2米气温', field: 'tempPath', unit: '°C', icon: '' },
  { label: '降水', field: 'rainPath', unit: 'mm', icon: '' },
]

// 配置信息
let configInfo = ref({
  legendLRV: {
    temp: {
      style: { textColorType: 'normal' },
      data: {
        unit: '℃',
        colorList: [
          [160, 0, 150, -20],
          [255, 0, 250, -10],
          [0, 0, 255, 5],
        ],
      },
    },
    pre: {
      style: { textColorType: 'normal' },
      data: {
        unit: 'mm',
        colorList: [
          [18, 124, 223, 0],
          [0, 248, 237, 5],
          [45, 190, 15, 10],
        ],
      },
    },
    windSpeed: {
      data: {
        unit: 'm/s',
        colorList: [
          [255, 255, 255, 0],
          [35, 135, 230, 5],
          [45, 190, 15, 10],
        ],
      },
    },
    windDirection: {
      data: {
        unit: '°',
        colorList: [
          [255, 255, 255, 0],
          [35, 135, 230, 5],
          [45, 190, 15, 10],
        ],
      },
    }
  },
  currentFactor: 'windSpeed',
  className: 'txt-image-tooltip',
  currentModuleMap: {
    resolution: 0.1,
    imageLayer: '',
    tooltip: '',
    BC: {
      maxLat: 50,
      maxLng: 140,
      minLat: 25,
      minLng: 100
    },
  },
  areaCoordinate: [
    [
      [100, 25], [100, 50], [140, 50], [140, 25], [100, 25],
    ]
  ],
})

export {
  toolsList,
  atmosphereTypeList,
  configInfo
}