import * as pako from 'pako'
import * as turf from '@turf/turf'

// 获取地图的txt栅格数据
async function getTxtData(url) {
  return new Promise(function (resolve, reject) {
    fetch(url, {
      method: 'get',
      responseType: "arraybuffer"
    }).then(response => {
      if (response.status >= 200 && response.status < 300) { return response.arrayBuffer() }
      else { throw new Error(response.statusText); }
    }).then(result => {
      let responseText = pako.ungzip(result, { to: "string", });
      let array = responseText.split("\n")
      let raster_data = new Array();
      array.pop()
      for (let arr of array) { raster_data.push(arr.split(" ")) }
      if (raster_data && raster_data.length) { resolve(raster_data) } else { reject('raster_data为空') }
    })
  })
}

// 判断点是否在指定区域
function getIsClickInside(pointCoordinate, areaCoordinate) {
  let isClickInside = false

  let clickedPoint = turf.point([pointCoordinate.lng, pointCoordinate.lat])
  let targetArea = turf.polygon(areaCoordinate)

  turf.booleanPointInPolygon(clickedPoint, targetArea) ? isClickInside = true : isClickInside = false

  return isClickInside
}

// 根据点击位置获取数据索引
function getRowColIndex(BC, clickCoordinate, resolution,) {
  let lat = clickCoordinate.lat
  let lng = clickCoordinate.lng
  let rowIndex = Math.floor((BC.maxLat - lat) / resolution)
  let colIndex = Math.floor((lng - BC.minLng) / resolution)

  return { rowIndex, colIndex }
}

// 创建leaflet提示图层
function createLeafletTip(options) {
  let tooltip = L.tooltip({
    sticky: false,
    opacity: 1,
    className: options?.className,
    direction: 'auto',
    offset: [5, 5],
    permanent: false,
  }).setLatLng([options?.position?.lat, options?.position?.lng])
    .setContent(options?.html)
    .addTo(options?.map)

  return tooltip
}

// 获取txt中对应行列信息(暂时不行,rc多一行)
async function rowColInfoInTxt(options) {
  let targetData = await getTxtData(options.url)
  let rc = getRowColIndex(options.currentModuleMap.BC, options.position, options.currentModuleMap.resolution, options.url)
  return targetData?.[rc.rowIndex]?.[rc.colIndex]
}

export {
  getTxtData,
  getIsClickInside,
  getRowColIndex,
  createLeafletTip,
  rowColInfoInTxt
}