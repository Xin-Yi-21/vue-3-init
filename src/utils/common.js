// import Vue from 'vue'
// 单个枚举匹配中文
export function $getEnumsLabel(enumsList, value, labelField, valueField,) {
  let matchItem = enumsList && enumsList.find(item => {
    return valueField ? item[valueField] === value : item.value === value
  })
  let label = matchItem ? (labelField ? matchItem[labelField] : matchItem.label) : ''
  return label
}
// 多个枚举匹配中文
export function $getEnumsLabelList(enumsList, valueList, labelField, valueField,) {
  let labelList = JSON.parse(JSON.stringify(valueList))
  labelList = labelList && labelList.map(item => {
    return item = $getEnumsLabel(enumsList, item, labelField, valueField)
  })
  return labelList
}
// 防抖
export function $debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
// 节流
export function $throttle(func, wait, immediate) {
  let timeout
  return function (...args) {
    const context = this
    if (!timeout) {
      if (immediate) { func.apply(context, args) }
      timeout = setTimeout(() => {
        if (!immediate) { func.apply(context, args) }
        timeout = null
      }, wait)
    }
  }
}
// 深拷贝
export function $deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
// // 加载
// let loading
// export function $loadingStart(dom, text) {
//   loading = Vue.prototype.$loading({
//     lock: true,
//     spinner: 'el-icon-loading',
//     text: text || '加载中',
//     background: 'rgba(255, 255, 255, 0.8)',
//     target: document.querySelector(dom), // 设置加载动画区域
//   })
// }
// export function $loadingEnd() {
//   loading.close()
// }
// 导出表格
export function $getTableHeaderLRVByGlobal() {
  this.tableHeaderLRV = {}
  this.$refs.table.$children.forEach(item => {
    if (item.label != undefined && item.prop != undefined) {
      let columnChild = { [item.label]: item.prop }
      Object.assign(this.tableHeaderLRV, columnChild)
    }
  })
}
// // tableData：要导出的查询表格数据
// // tableHeaderLRV：表头的label和prop对应关系，建议设置el-table的ref属性和el-table-column的prop属性来动态获取
// // fileName：导出的文件名
// // handleSpecialProp：特殊列的数据展示处理
// export function $exportTable(tableData, tableHeaderLRV, fileName, handleSpecialProp) {
//   // 表格数据
//   let exportTableData = []
//   tableData.forEach((item, index) => {
//     let rowArr = []
//     for (var label in tableHeaderLRV) {
//       let prop = tableHeaderLRV[label]
//       let rowcol = item[prop]
//       if (handleSpecialProp) { rowcol = handleSpecialProp(prop, item, index) }
//       rowArr.push(rowcol)
//     }
//     exportTableData.push(rowArr)
//   })
//   // 表头中文
//   let tableHeaderCnList = []
//   for (var k in this.tableHeaderLRV) { tableHeaderCnList.push(k) }
//   import('@/utils/exportExcel').then(excel => {
//     excel.export_json_to_excel({
//       header: tableHeaderCnList,
//       data: exportTableData,
//       filename: fileName,
//       autoWidth: true,
//       bookType: 'xlsx'
//     })
//   })
// }

// import FileSaver from "file-saver"
// // import XLSX from "xlsx"
// import * as XLSX from "xlsx"
// export function $exportDomTable(domId, fileName, deleteIndexArr) {
//   let xlsxParam = { raw: true }
//   let wb = XLSX.utils.table_to_book(document.querySelector('#' + domId), xlsxParam)
//   if (deleteIndexArr && deleteIndexArr.length > 0) {
//     deleteIndexArr.forEach((item, index) => {
//       wb.Sheets.Sheet1['!cols'][item] = { hidden: true }
//     })
//   }
//   let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
//   try {
//     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName + '.xlsx')
//   } catch (e) {
//     if (typeof console !== 'undefined') console.log(e, wbout)
//   }
//   this.isDownloading = false
//   return wbout
// }

// echart 下载图片
// chartObject:echart实例对象
// options:配置参数。 type:导出图片类型；pixelRatio:放大倍数；backgroundColor:导出图片背景色；name:导出图片的名字
export function $exportEchartImg(chartObject, options) {
  let picInfo = chartObject.getDataURL({
    type: options.type ? options.type : 'png',
    pixelRatio: options.pixelRatio ? options.pixelRatio : 1,
    backgroundColor: options.backgroundColor ? options.backgroundColor : '#fff',
  });
  let a = document.createElement('a')
  a.download = options.name
  a.style.display = 'none'
  a.href = picInfo
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}


// 数组去重
export function $uniqueArray(arr, key) {
  // 数组是简单类型（字符串、数字等），直接去重
  if (arr.length > 0 && typeof arr[0] !== 'object') {
    return [...new Set(arr)]
  }
  // 如果提供了 key，按对象的该属性去重；否则，完全去重
  if (key) {
    const seen = new Set()
    return arr.filter(item => {
      if (!seen.has(item[key])) {
        seen.add(item[key])
        return true
      }
      return false
    })
  } else {
    // 按整个对象去重
    return arr.filter((item, index, self) => {
      return index === self.findIndex((t) => (
        JSON.stringify(t) === JSON.stringify(item)
      ))
    })
    // let obj = {}
    // return arr.filter((item, index) => {
    //   let newItem = item + JSON.stringify(item)
    //   return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
    // })
  }
}

// 数组排序
export function $sortArray(arr, type, key, order = 'asc',) {
  // 检查传入数组是否为空或未定义
  if (!Array.isArray(arr) || arr.length === 0) { return [] }
  return arr.sort((a, b) => {
    // 获取排序字段值
    let valA = key ? a[key] : a
    let valB = key ? b[key] : b
    // 排序类型
    switch (type) {
      case 'time':
        valA = new Date(valA)
        valB = new Date(valB)
        break
      case 'string':
        valA = valA.toString().toLowerCase()
        valB = valB.toString().toLowerCase()
        break
      case 'number':
        valA = Number(valA)
        valB = Number(valB)
        break
      case '':
      default:
        valA = valA
        valB = valB
    }
    // 排序方式（正序：acsending，倒序：descending）
    if (order === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0
    }
  })
}

// echart数据补全
export function $completeEchart(chart) {
  try {
    let xyData = chart.xyData || {}
    let xData = []
    let isTime = false
    for (var k in xyData) {
      xyData[k].forEach(item => { xData.push(item.value?.[0] || item[0]) })
    }
    xData = $uniqueArray(xData)
    let isTimeField = xData.some(item => this.$dayjs(item).isValid())
    this.$sortArray(xData, isTimeField ? 'time' : '')
    for (var k in xyData) { xyData[k] = fill(xyData[k], xData) }
    function fill(arr, xList) {
      let result = []
      let arrObj = {}
      arr.forEach(item => {
        if (item.value?.[0]) {
          arrObj[item.value[0]] = { y: item.value[1], isValue: true }
          arrObj.kPropertyValue = true
        } else if (item[0]) {
          arrObj[item[0]] = { y: item[1], isValue: false }
        }
      })
      xList.forEach(item => {
        if (arrObj[item]) {
          result.push(arrObj[item].isValue ? { value: [item, arrObj[item].y] } : [item, arrObj[item].y])
        } else {
          result.push(arrObj.kPropertyValue ? { value: [item, null] } : [item, null])
        }
      })

      // let arrMap = new Map(arr.map(item => [item.value?.[0] || item[0], item.value?.[1] || item[1]]))  // 将原数组转为一个 Map，方便查找
      // xList.forEach(item => {
      //   if (arrMap.has(item)) {
      //     result.push({ value: [item, arrMap.get(item)] }) // 如果原数组中存在该时间，直接添加
      //   } else {
      //     result.push({ value: [item, null] })  // 如果原数组中没有该时间，填充 null
      //   }
      // })
      return result
    }

    let tableData = []
    xData.forEach(item1 => {
      let rowItem = { time: item1, }
      for (var k in xyData) {
        xyData[k].forEach(item2 => {
          if (item1 === (item2.value?.[0] || item2[0])) {
            rowItem[k] = (item2.value?.[1] || item2.value?.[1] === 0 || item2[1] || item2[1] === 0) ? item2.value?.[1] || item2[1] : '-'
          }
        })
      }
      tableData.push(rowItem)
    })
    chart.xData = xData
    chart.tableData = tableData
  } catch {
    this.$message.warning('数据补全出现问题！')
  }

}

// 表格数据补全
export function $completeTable(data, callback = null, xFieldT = 'time', xFieldN = 'time') {
  let apiData = JSON.parse(JSON.stringify(data))
  let res = []
  let xData = []
  for (var k in apiData) {
    apiData[k].forEach(item => { xData.push(item[xFieldT]) })
  }
  xData = this.$uniqueArray(xData)
  let isTimeField = xData.some(item => this.$dayjs(item).isValid())
  this.$sortArray(xData, isTimeField ? 'time' : '')

  xData.forEach((item1, index1) => {
    res[index1] = { [xFieldN]: item1 }
    for (var k in apiData) {
      let matchItem = apiData[k].find(item2 => item1 === item2[xFieldT]) || {}
      if (callback && typeof callback === 'function') {
        callback(res[index1], matchItem, k)
      }
    }
  })
  return res
}

// echart容器大小变化监听
export function $newResizeObserver(fn = () => { }, isFirstResize = true) {
  return new ResizeObserver(() => {
    if (isFirstResize) {
      isFirstResize = false
      return
    }
    fn()
  })
}

// 数字精确位数
export function $accurate(num, precision = 0, isAllPrecision = false) {
  const parsedNum = parseFloat(num)
  if (isNaN(parsedNum)) { return '' }
  const pow = Math.pow(10, precision)
  const res = Math.round(parsedNum * pow) / pow
  return isAllPrecision ? res.toFixed(precision) : res
}
