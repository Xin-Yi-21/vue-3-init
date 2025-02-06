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

// 数字精确位数
export function $accurate(num, precision = 0, isAllPrecision = false) {
  const parsedNum = parseFloat(num)
  if (isNaN(parsedNum)) { return '' }
  const pow = Math.pow(10, precision)
  const res = Math.round(parsedNum * pow) / pow
  return isAllPrecision ? res.toFixed(precision) : res
}

// 判断是否有值
export function $hasValue(value) {
  return (value !== undefined && value !== null && value !== '')
}

// 导出dom为图片
export function exportDomToImage(domElement, config = {}) {
  // 设置默认配置
  const options = Object.assign({
    filename: 'image.png', // 默认导出名称
    imageFormat: 'png'     // 默认导出为 PNG 格式
  }, config);

  // 使用 html2canvas 将 DOM 元素渲染为 Canvas
  html2canvas(domElement).then(function (canvas) {
    // 将 Canvas 转换为指定格式的图片数据
    const imgData = canvas.toDataURL(`image/${options.imageFormat}`);

    // 创建一个下载链接
    const link = document.createElement('a');
    link.href = imgData;
    link.download = options.filename; // 使用提供的文件名

    // 触发下载
    link.click();
  }).catch(function (error) {
    console.error('Error while rendering the DOM element to image:', error);
  });
}