import { ref } from 'vue'
import { getTxtData, getIsClickInside, getRowColIndex, createLeafletTip, rowColInfoInTxt } from './handle-tools'

// 渲染风场
async function renderWindImage(options) {
  let imgWindConfig = await handleWindImageConfig(options)
  const newOptions = Object.assign({}, options, { imgWindConfig })
  loadWindOnMap(newOptions)
}

// 处理影像配置
async function handleWindImageConfig(options) {
  // A.获取二维数组数据
  let windSpeedData = await getTxtData(options?.url)
  let windUData = await getTxtData(options?.windUUrl)
  let windVData = await getTxtData(options?.windVURl)
  // B.设置一维数组数据
  let rowLength = windUData.length
  let colLength = windUData[0].length
  let uData = new Array()
  let vData = new Array()
  let sData = new Array()
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < colLength; j++) {
      uData.push(windUData[i][j] == -9999 ? '' : windUData[i][j])
      vData.push(windVData[i][j] == -9999 ? '' : windVData[i][j])
      sData.push(windSpeedData[i][j] == -9999 ? '' : windSpeedData[i][j])
    }
  }
  // C.设置数据header配置
  let header = {
    parameterCategory: 2, // 固定配置，参数类别，2表示动量(风速和风向)
    parameterNumber: 2, // 固定配置，参数编号，2表示U向风分量,3表示V向风分量，8代表风速,10代表风向
    lo1: options?.currentModuleMap.BC.minLng, // 最小经度
    la1: options?.currentModuleMap.BC.maxLat, // 最大纬度
    lo2: options?.currentModuleMap.BC.maxLng, // 最大经度
    la2: options?.currentModuleMap.BC.minLat, // 最小纬度
    numberPoints: rowLength * colLength, // 网格数量
    nx: colLength, // 横向网格数量
    ny: rowLength, // 竖向网格数量
    dx: options?.currentModuleMap.resolution, // 经度间距，1网格代表度数，即分辨率
    dy: options?.currentModuleMap.resolution, // 纬度间距，1网格代表度数，即分辨率
  }
  let uHeader = JSON.parse(JSON.stringify(header))
  let vHeader = JSON.parse(JSON.stringify(header))
  let sHeader = JSON.parse(JSON.stringify(header))
  uHeader.parameterNumber = 2
  vHeader.parameterNumber = 3
  sHeader.parameterNumber = 8
  // D.数据整合
  let windData = new Array()
  windData.push({ header: uHeader, data: uData })
  windData.push({ header: vHeader, data: vData })
  windData.push({ header: sHeader, data: sData })
  let config = {
    displayValues: true, // 设置为 true 以在地图上显示风速值（默认为 false）。
    displayOptions: {
      velocityType: '', // 统一label前缀，如 "Global Wind" 或 "Surface Wind"。
      directionString: '风向', // 风向label
      speedString: '风速', // 风速label
      position: 'bottomright', // 指定风流场图信息的显示位置，如 "topleft"、"topright"、"bottomleft" 或 "bottomright"。
      emptyString: '暂无风数据', // 无数据显示文本。
      speedUnit: 'm/s', // 风速的单位，如 "m/s"、"km/h" 或 'mph' "kt"。
      angleConvention: 'bearingCW', // 指定风向的角度约定，如 "bearingCW" 表示顺时针方向为0°。
      showCardinal: false, // 禁用风向基本符号。默认值false。
    },
    className: 'custom-velocity-layer',
    maxVelocity: 50, // 风场流图中显示最大风速值，用于调整风场流图的显示颜色。默认值10。
    data: windData, // 包含风数据的数组或对象，每个数据点通常包括经纬度、风速和风向等信息。
    frameRate: 30, // 风流场图粒子的动画帧率，单位为帧/秒。默认值20。
    particleAge: 90, // 风流场图粒子的生命周期，单位为帧。默认值90。
    opacity: 0.8, // 风场流图的透明度，取值范围为 0 到 1。默认值0.8。
    // particleMultiplier: 1, // 风流场图粒子的数量。默认值1？。
    lineWidth: 2, // 风场流图箭头线宽。默认值1。
    velocityScale: 0.01, // 风速缩放比例，用于调整风流场图箭头长度。默认值0.005。
    arrowHeadSize: 10, // 风流场图箭头头部大小。默认值10。
    arrowBodySize: 6, // 风流场图箭头主体大小。默认值6。
    arrowColor: '#000', // 风流场图箭头颜色。默认值'#000'。
    colorScale: [
      'rgb(255,255,255)',
      'rgb(35, 135, 230)',
      'rgb(45, 190, 15)',
      'rgb(230, 230, 0)',
      'rgb(240, 120, 13)',
      'rgb(210, 44, 21)',
      'rgb(170, 15, 30)',
      'rgb(185, 33, 106)',
      'rgb(255, 120, 255)',
      'rgb(210, 90, 217)',
      'rgb(117, 17, 118)',
    ], // 自定义风速值与颜色之间的映射关系，可使用渐变色来表示不同的风速值。
    clearCanvas: true, // 是否在绘制新风流场图之前清除画布上内容。默认值true。
    customData: { // 自定义数据
      header: header,
      windSpeedData: windSpeedData, // 风速二维数组网格数据
      windUData: windUData, // U向风二维数组网格数据
      windVData: windVData, // V向风二维数组网格数据
    }
  }
  return config
}

// 将风场加载到地图
function loadWindOnMap(options) {
  options.currentModuleMap.imageLayer && options.currentModuleMap.imageLayer.removeFrom(options?.map)
  options.currentModuleMap.imageLayer = L.velocityLayer(options?.imgWindConfig).addTo(options?.map)
  options.currentModuleMap.imageLayer.getPane().style.zIndex = 202;
  options.currentModuleMap.imageLayer.getPane().style.width = '1920px';
  options.currentModuleMap.imageLayer.getPane().style.height = '1080px';

  addWindTips(options)
}

// 风场添加tooltip
let tooltipLayer = ref()
function addWindTips(options) {
  let sRasterData = options?.imgWindConfig.customData.windSpeedData
  let uRasterData = options?.imgWindConfig.customData.windUData
  let vRasterData = options?.imgWindConfig.customData.windVData
  let BC = {
    maxLat: options?.imgWindConfig.customData.header.la1,
    maxLng: options?.imgWindConfig.customData.header.lo2,
    minLat: options?.imgWindConfig.customData.header.la2,
    minLng: options?.imgWindConfig.customData.header.lo1,
  }
  let resolution = options?.imgWindConfig.customData.header.dy
  options?.map.on('click', (e) => {
    let isClickInside = getIsClickInside(e.latlng, options?.areaCoordinate)
    if (isClickInside) {
      let rc = getRowColIndex(BC, e.latlng, resolution)
      let windSpeed = ''
      let u = ''
      let v = ''
      let windDirection = ''
      if (uRasterData && uRasterData[rc.rowIndex] && uRasterData[rc.rowIndex][rc.colIndex]) {
        u = parseFloat(Number(uRasterData[rc.rowIndex][rc.colIndex]).toFixed(2))
      }
      if (vRasterData && vRasterData[rc.rowIndex] && vRasterData[rc.rowIndex][rc.colIndex]) {
        v = parseFloat(Number(vRasterData[rc.rowIndex][rc.colIndex]).toFixed(2))
      }
      // 计算风速
      if (sRasterData && sRasterData[rc.rowIndex] && sRasterData[rc.rowIndex][rc.colIndex]) {
        windSpeed = parseFloat(Number(sRasterData[rc.rowIndex][rc.colIndex]).toFixed(2))
      }
      // 计算风向
      windDirection = Number(((Math.atan2(u, v) * 180 / Math.PI + 360) % 360).toFixed(2))

      // 设置tooltip内容
      const tooltipContentArr = [
        { label: '风向', value: String(windDirection) ? (String(windDirection) + ' °') : '', isShow: true },
        { label: '风速', value: `${windSpeed} ${options?.legendLRV[options?.currentFactor].data.unit}`, isShow: (windSpeed || windSpeed === 0) && windSpeed != (-9999) }
      ]

      const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
      let html = ``
      tooltipContentArr.forEach((item, index) => {
        html += `
                    <div class="tooltip-item" v-show="item.isShow">
                        <div class="item-icon" style="background-color:${colors[index]}"></div>
                        <div class="item-text">
                            <div class="text-left">${item.label}</div>
                            <div class="item-right">${item.value}</div>
                        </div>
                    </div>
                `
      })
      let newOptions = Object.assign({}, options, { html, position: e.latlng })
      if (html) {
        tooltipLayer.value = createLeafletTip(newOptions);
      }
    } else {
      if (tooltipLayer.value) {
        tooltipLayer.value.close()
      }
    }
  })
}

// 渲染风场及台风外其它气象影像
function renderOtherAtmosphereImage(options) {
  // 去除其它影像及添加影像图层
  options.currentModuleMap.imageLayer && options.currentModuleMap.imageLayer.removeFrom(options?.map)
  options.currentModuleMap.imageLayer = L.imageOverlay(options.imgUrl, options.boundings).addTo(options?.map)
  // 添加点击事件
  options?.map.on('click', (event) => {
    // 判断点击坐标是否在指定范围
    let isClickInside = getIsClickInside(event.latlng, options?.areaCoordinate)
    if (isClickInside) {
      options.position = event.latlng
      // 获取tooltip内容
      const rc = rowColInfoInTxt(options)
      rc.then(res => {
        let html = `
            <div class="tooltip-item">
                <div class="item-icon"></div>
                <div class="item-text">
                    <div class="text-left">${options.currentSelected.label}</div>
                    <div class="item-right">${res} ${options.currentSelected.unit}</div>
                </div>
            </div>
        `
        options['html'] = html
        tooltipLayer.value = createLeafletTip(options);
      })
    } else {
      tooltipLayer.value.close()
    }
  })
}

export {
  renderWindImage,
  tooltipLayer,
  renderOtherAtmosphereImage
}