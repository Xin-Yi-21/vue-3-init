// import Vue from 'vue'
import { ElMessage, } from 'element-plus'
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

// 确认弹框
export function $cConfirm(confirmRef, options = {}) {
  return new Promise((resolve, reject) => {
    if (!confirmRef?.value?.openDialog) {
      reject()
      return
    }

    confirmRef.value.openDialog({
      ...options,
      // confirm: () => resolve(true),
      confirm: async () => {
        const res = await options.confirm?.()
        if (res === false) return false
        resolve(true)
        return true
      },
      cancel: () => reject(),
    })
  })
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
  return (value !== undefined && value !== null && value !== '' && !Number.isNaN(value))
}
// 设置值
export function $setValue(value, noData = null) {
  let isHasValue = (value !== undefined && value !== null && value !== '')
  return isHasValue ? value : noData
}

// 导出dom为图片
import domtoimage from 'dom-to-image-more'
export async function $exportDomToImage(domIdOrDom, fileName = '图片', options = {}) {
  const { format = 'png', quality = 1 } = options

  let domElement
  if (typeof domIdOrDom === 'string') {
    domElement = document.getElementById(domIdOrDom)
  } else if (domIdOrDom instanceof HTMLElement) {
    domElement = domIdOrDom
  } else {
    console.error('参数错误：需传入 id 字符串或 DOM 元素')
    return Promise.reject('参数错误')
  }

  if (!domElement) {
    console.error('未找到指定 DOM 元素')
    return Promise.reject('未找到指定 DOM 元素')
  }

  // 动态选择方法
  const method = format === 'jpeg'
    ? domtoimage.toJpeg
    : format === 'webp'
      ? domtoimage.toBlob
      : domtoimage.toPng

  try {
    const data = await method(domElement, { quality })

    let dataUrl
    if (format === 'webp' && data instanceof Blob) {
      dataUrl = URL.createObjectURL(data)
    } else {
      dataUrl = data
    }

    const link = document.createElement('a')
    const ext = format.toLowerCase()
    link.href = dataUrl
    link.download = fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (format === 'webp' && data instanceof Blob) {
      setTimeout(() => URL.revokeObjectURL(dataUrl), 1000)
    }

    return true
  } catch (error) {
    console.error('将 DOM 转为图片时出错:', error)
    return Promise.reject(error)
  }
}

// 下载文件
export async function $downloadFile(fileData, fileName = '', options = {}) {
  const { mimeType = 'application/octet-stream', tip = true, responseHeaders } = options

  // 空内容检查
  if (!fileData) {
    const msg = '下载失败：文件内容为空'
    tip && ElMessage.error(msg)
    return { download: false, message: msg }
  }

  let blob

  // 1️⃣ Blob
  if (fileData instanceof Blob) {
    // 判断是否为 JSON 错误返回
    if (fileData.type === 'application/json') {
      try {
        const text = await fileData.text()
        const json = JSON.parse(text)
        const msg = json?.message || '文件导出错误！'
        tip && ElMessage.error(msg)
        return { download: false, message: msg }
      } catch {
        const msg = '文件导出失败（JSON 解析错误）'
        tip && ElMessage.error(msg)
        return { download: false, message: msg }
      }
    }
    blob = fileData
  }
  // 2️⃣ ArrayBuffer
  else if (fileData instanceof ArrayBuffer) {
    // 先转换成 Blob
    const tempBlob = new Blob([fileData], { type: mimeType })

    // 判断是否为 JSON 错误返回
    if (tempBlob.type === 'application/json') {
      try {
        const text = await tempBlob.text()
        const json = JSON.parse(text)
        const msg = json?.message || '文件导出错误！'
        tip && ElMessage.error(msg)
        return { download: false, message: msg }
      } catch {
        const msg = '文件导出失败（JSON 解析错误）'
        tip && ElMessage.error(msg)
        return { download: false, message: msg }
      }
    }
    blob = tempBlob
  }
  // 3️⃣ Base64
  else if (typeof fileData === 'string' && fileData.startsWith('data:')) {
    const arr = fileData.split(',')
    const inferredMime = arr[0].match(/:(.*?);/)?.[1] || mimeType
    const bstr = atob(arr[1])
    const u8arr = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    blob = new Blob([u8arr], { type: inferredMime })
  }
  // ❌ 不支持类型
  else {
    const msg = '下载失败：不支持的文件类型'
    tip && ElMessage.error(msg)
    return { download: false, message: msg }
  }

  // 空文件流
  if (blob.size === 0) {
    const msg = '下载失败：文件流为空'
    tip && ElMessage.error(msg)
    return { download: false, message: msg }
  }

  // ===== 自动解析文件名 =====
  let finalName = fileName
  if (!finalName) {
    let parsedName = ''
    if (responseHeaders?.['content-disposition']) {
      const disposition = responseHeaders['content-disposition']

      // 优先解析 UTF-8 编码格式
      const utf8Match = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)
      if (utf8Match?.[1]) parsedName = decodeURIComponent(utf8Match[1])
      else {
        // 兼容普通 ASCII filename=""
        const asciiMatch = disposition.match(/filename="?([^"]+)"?/i)
        if (asciiMatch?.[1]) parsedName = decodeURIComponent(asciiMatch[1])

        // 兼容 filename=* 格式，URL 编码的文件名
        const starMatch = disposition.match(/filename\*\s*=\s*([^;]+)/i)
        if (starMatch?.[1]) parsedName = decodeURIComponent(starMatch[1])
      }
    }
    finalName = parsedName || '下载文件'
  }

  // ===== 触发下载 =====
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', finalName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  tip && ElMessage.success('文件下载成功！')
  return { download: true, message: '' }
}





// 导出表格
import ExcelJS from 'exceljs'

import FileSaver from 'file-saver'
import * as xlsx from 'xlsx'
// （1）导出data表格
// 旧
export async function $exportExcel(tableData, {
  tableName = '表格',
  tableHeader = {},
  isDownLoading,
  isTip = true,
  boldHeader = false, // 是否表头加粗
  specifyColumnWidth = false, // 是否为每列指定列宽
  specifyRowHeightValue = 0, // 指定行高的值
  borderStyle = null, // 边框样式
} = {}) {
  try {
    if (isDownLoading) { isDownLoading.value = true }
    // 无数据
    if (!tableData || tableData.length === 0) return ElMessage.warning('暂无数据可供导出！')
    // 表头配置
    tableHeader.columnList = tableHeader.columnList || Object.keys(tableData[0]).map(field => ({ 'name': field, 'field': field })) || []
    tableHeader.matchField = tableHeader.matchField || { nameField: 'name', fieldField: 'field' }
    const { columnList: thColumnList, matchField: thMatchField } = tableHeader
    // 创建一个工作簿和工作表
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')
    // 设置表头  
    worksheet.columns = thColumnList.map(header => ({
      header: header[thMatchField.nameField],
      key: header[thMatchField.fieldField],
      width: 15  // 默认宽度，可以稍后根据内容进行调整
    }))
    // 添加数据行
    tableData.forEach(row => { worksheet.addRow(row) })
    // 调整列宽，确保每列宽度足够容纳最长的数据内容
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0
      // 计算每列的最大长度
      tableData.forEach(row => {
        const cellValue = row[thColumnList[index][thMatchField.fieldField]]
        maxLength = Math.max(maxLength, (cellValue ? String(cellValue).length : 0))
      })
      const headerLength = thColumnList[index][thMatchField.nameField].length
      maxLength = Math.max(maxLength, headerLength)
      if (specifyColumnWidth) {
        // 指定列宽
        column.width = thColumnList.find(item => item.field === column._key).width
      } else {
        // 设置列宽，+10 为了留白， 默认 10，避免过窄
        column.width = Math.max(maxLength + 10, 10)
      }
    })
    // 设置行样式
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      // 表头加粗
      if (rowNumber === 1 && boldHeader) { row.font = { bold: true } }
      // 指定行高 
      if (specifyRowHeightValue > 0) { row.height = specifyRowHeightValue }
      // 单元格对齐方式 
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.alignment.wrapText = true
        // 添加边框
        if (borderStyle) {
          cell.border = {
            top: { style: borderStyle.type, },
            left: { style: borderStyle.type, },
            bottom: { style: borderStyle.type, },
            right: { style: borderStyle.type, }
          }
        }
      })
    })
    // // 延时测试
    // function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
    // await delay(1000)
    // 导出文件
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = tableName + '.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    if (isDownLoading) { isDownLoading.value = false }
    if (isTip) { ElMessage.success('文件导出成功！') }
  } catch (error) {
    if (isDownLoading) { isDownLoading.value = false }
    if (isTip) { ElMessage.error('文件导出失败！') }
    console.log('文件导出失败error：', error)
  }
}
// 新
export async function $exportDataToExcel(tableData, fileName = '表格', options = {}) {
  let {
    tableHeader,            // 表头： { columnList: [{ name: '人物', field: 'personName', width: 40 },], matchFiled: { nameField: 'name', fieldField: 'field' } }
    minWidth = 10,          // 最小宽
    maxWidth = null,        // 最大宽
    align = 'center',       // 对齐方式
    boldHeader = false,     // 表头是否加粗
  } = options

  if (!tableData || tableData.length === 0) {
    console.warn('暂无数据可供导出！')
    return
  }

  if (!tableHeader || !tableHeader.columnList) {
    tableHeader = {
      columnList: Object.keys(tableData[0] || {}).map(key => ({ name: key, field: key, })),
      matchFiled: { nameField: 'name', fieldField: 'field' },
    }
  }

  const { columnList, matchFiled } = tableHeader
  const nameField = matchFiled?.nameField || 'name'
  const fieldField = matchFiled?.fieldField || 'field'

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  worksheet.columns = columnList.map(col => ({
    header: col[nameField],
    key: col[fieldField],
    width: col.width || 15,
  }))

  tableData.forEach(row => worksheet.addRow(row))

  const calcTextWidth = (text) => {
    let width = 0
    if (!text) return width
    const str = String(text)
    for (const char of str) {
      width += /[\u4e00-\u9fa5]/.test(char) ? 1.5 : 1
    }
    return width
  }

  worksheet.columns.forEach((col, index) => {
    if (columnList[index].width) {
      col.width = columnList[index].width
      return
    }
    const headerText = col.header || ''
    let maxContentWidth = calcTextWidth(headerText)

    for (const row of tableData) {
      const cellValue = row[col.key]
      const cellWidth = calcTextWidth(cellValue)
      if (cellWidth > maxContentWidth) maxContentWidth = cellWidth
    }

    let finalWidth = Math.max(maxContentWidth + 10, minWidth)
    if (maxWidth !== null) {
      finalWidth = Math.min(finalWidth, maxWidth)
    }
    col.width = finalWidth
  })

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell(cell => {
      cell.alignment = {
        horizontal: align,
        vertical: 'middle',
        wrapText: true,
      }
      if (rowNumber === 1 && boldHeader) {
        cell.font = { bold: true }
        if (borderHeader) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        }
      }
    })
  })

  try {
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.endsWith('.xlsx') ? fileName : fileName + '.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('导出失败', err)
  }
}
// （2）导出dom表格
// 方式1：依赖exceljs，支持样式
export async function $exportDomToExcel(domIdOrDom, fileName = '表格', options = {}) {
  // await $exportDomToExcel('myTable', '导出文件名', { deleteCols: ['操作', '.no-export'], deleteRows: [0], minWidth: 12, maxWidth: 50, align: 'left' });

  const {
    deleteCols = [],        // 删除的列：支持 索引(1)、类名('.a')、表头文本('序号')三种形式
    deleteRows = [],        // 删除的行：支持索引
    minWidth = 10,          // 最小宽
    maxWidth = null,        // 最大宽
    align = 'center',       // 对齐方式
    boldHeader = false,     // 表头是否加粗
  } = options

  // 获取根元素
  let rootEl
  if (typeof domIdOrDom === 'string') {
    rootEl = document.querySelector(`#${domIdOrDom}`)
  } else if (domIdOrDom instanceof HTMLElement) {
    rootEl = domIdOrDom
  } else {
    console.error('参数错误：需传入 id 字符串或 DOM 元素')
    return
  }
  if (!rootEl) {
    console.error('未找到指定 DOM')
    return
  }

  const headTable = rootEl.querySelector('thead')?.closest('table') || rootEl
  const bodyTable = rootEl.querySelector('tbody')?.closest('table') || rootEl

  const headerRows = Array.from(headTable.querySelectorAll('thead tr'))
  const bodyRows = Array.from(bodyTable.querySelectorAll('tbody tr'))

  if (!headerRows.length) {
    console.error('未找到 thead tr')
    return
  }

  // 解析表头为树并标记叶子索引
  function parseHeaderTree(rows) {
    const grid = []
    const nodesByRow = []
    const roots = []

    for (let r = 0; r < rows.length; r++) {
      const tr = rows[r]
      nodesByRow[r] = []
      let c = 0
      for (const cell of Array.from(tr.children)) {
        while (grid[r] && grid[r][c]) c++

        const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10)
        const colspan = parseInt(cell.getAttribute('colspan') || '1', 10)
        const label = (cell.innerText || '').trim()

        const node = {
          label,
          rowspan,
          colspan,
          start: c,
          end: c + colspan - 1,
          classList: Array.from(cell.classList || []),
          children: [],
          el: cell,
          depth: r + 1,
          _deleted: false,
          _leafIndex: -1,
        }

        for (let rr = 0; rr < rowspan; rr++) {
          for (let cc = 0; cc < colspan; cc++) {
            grid[r + rr] = grid[r + rr] || []
            grid[r + rr][c + cc] = true
          }
        }

        if (r === 0) {
          roots.push(node)
        } else {
          const parent = findParentNode(nodesByRow[r - 1], c)
          if (parent) parent.children.push(node)
          else roots.push(node)
        }

        nodesByRow[r].push(node)
        c += colspan
      }
    }

    return { roots, headerRowCount: rows.length }
  }

  function findParentNode(nodes, colIndex) {
    for (const n of nodes) {
      if (colIndex >= n.start && colIndex <= n.end) return n
    }
    return null
  }

  const leafList = []
  function collectLeaves(nodes) {
    for (const n of nodes) {
      if (n.children && n.children.length) {
        collectLeaves(n.children)
      } else {
        n._leafIndex = leafList.length
        leafList.push(n)
      }
    }
  }

  const parsed = parseHeaderTree(headerRows)
  const origRoots = parsed.roots
  collectLeaves(origRoots)

  function matchesDeleteTarget(node) {
    if (typeof node._leafIndex === 'number' && deleteCols.includes(node._leafIndex)) {
      return true
    }
    if (deleteCols.includes(node.label)) return true
    for (const d of deleteCols) {
      if (typeof d === 'string' && d.startsWith('.')) {
        const cls = d.slice(1)
        if (node.classList && node.classList.includes(cls)) return true
      }
    }
    return false
  }

  function markLeavesDeleted(node) {
    if (node.children && node.children.length) {
      node.children.forEach(markLeavesDeleted)
    } else {
      node._deleted = true
    }
  }

  function filterInPlace(nodes) {
    const out = []
    for (const node of nodes) {
      if (matchesDeleteTarget(node)) {
        markLeavesDeleted(node)
        continue
      }
      if (node.children && node.children.length) {
        node.children = filterInPlace(node.children);
        node.colspan = node.children.reduce((s, c) => s + (c.colspan || countLeaves(c)), 0)
        if (node.children.length === 0) continue
      }
      out.push(node)
    }
    return out
  }

  function countLeaves(node) {
    if (!node) return 0
    if (!node.children || !node.children.length) return 1
    return node.children.reduce((s, c) => s + countLeaves(c), 0)
  }

  const filteredRoots = filterInPlace(origRoots)

  const keepLeafIndexes = leafList
    .map((leaf, idx) => ({ leaf, idx }))
    .filter(item => !item.leaf._deleted)
    .map(item => item.idx)

  if (keepLeafIndexes.length === 0) {
    console.error('删除后没有剩余列可导出')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  function getDepth(nodes) {
    if (!nodes || !nodes.length) return 0
    return 1 + Math.max(...nodes.map(n => getDepth(n.children || [])))
  }
  const headerDepth = getDepth(filteredRoots)

  function drawHeader(nodes, row, startCol) {
    let col = startCol;
    for (const node of nodes) {
      const leafCount = countLeaves(node)
      const rowspan = (node.children && node.children.length) ? 1 : (headerDepth - row + 1)
      const colspan = leafCount

      const cell = worksheet.getCell(row, col)
      cell.value = node.label
      if (rowspan > 1 || colspan > 1) {
        worksheet.mergeCells(row, col, row + rowspan - 1, col + colspan - 1)
      }

      if (node.children && node.children.length) {
        drawHeader(node.children, row + 1, col)
      }

      col += colspan
    }
  }
  drawHeader(filteredRoots, 1, 1)

  for (let r = 0; r < bodyRows.length; r++) {
    if (deleteRows.includes(r)) continue
    const tr = bodyRows[r]
    const tds = Array.from(tr.children)
    const rowData = keepLeafIndexes.map(i => {
      // const td = tds[i];
      // return td ? td.innerText.trim() : ''
      const td = tds[i];
      let text = td ? td.innerText.trim() : ''
      text = text.replace(/[\r\n]+/g, '') // 去除换行符
      return text
    })
    worksheet.addRow(rowData)
  }

  const colCount = keepLeafIndexes.length
  const headerTexts = []
  for (let c = 1; c <= colCount; c++) {
    const texts = []
    for (let r = 1; r <= headerDepth; r++) {
      const v = worksheet.getCell(r, c).value
      if (v != null && v !== '') texts.push(String(v))
    }
    headerTexts.push(texts.join(' '))
  }

  const calcWidth = (s) => {
    let w = 0;
    for (const ch of String(s || '')) {
      w += /[\u4e00-\u9fa5]/.test(ch) ? 1.5 : 1
    }
    return Math.max(minWidth, Math.ceil(w) + 4)
  };

  for (let c = 1; c <= colCount; c++) {
    let maxLen = calcWidth(headerTexts[c - 1] || '')
    for (let r = headerDepth + 1; r <= worksheet.rowCount; r++) {
      const val = worksheet.getCell(r, c).value
      const text = val == null ? '' : String(val)
      const w = calcWidth(text)
      if (w > maxLen) maxLen = w
    }
    if (maxWidth != null && maxLen > maxWidth) maxLen = maxWidth
    worksheet.getColumn(c).width = maxLen
  }

  worksheet.eachRow(row => {
    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: ['left', 'center', 'right'].includes(align) ? align : 'center', wrapText: true };
    })
  })

  if (boldHeader) {
    const headerRowCount = parsed.headerRowCount || 1
    for (let r = 1; r <= headerRowCount; r++) {
      const row = worksheet.getRow(r)
      row.eachCell(cell => {
        cell.font = Object.assign({}, cell.font, { bold: true })
      })
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  if (typeof FileSaver !== 'undefined' && FileSaver.saveAs) {
    FileSaver.saveAs(blob, `${fileName}.xlsx`)
  } else {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  }
}
// 方式2：依赖xlsx ，不支持样式
export async function $exportDomToExcelByXlsx(domIdOrDom, fileName = '表格', options = {}) {
  const {
    deleteCols = [],    // 删除的列：支持 索引(1)、类名('.a')、表头文本('序号')三种形式
    deleteRows = [],    // 删除的行：支持索引
    minWidth = 10,      // 最小宽
    maxWidth = null,    // 最大宽
  } = options


  // 定位根元素
  let rootEl
  if (typeof domIdOrDom === 'string') {
    rootEl = document.querySelector(`#${domIdOrDom}`)
  } else if (domIdOrDom instanceof HTMLElement) {
    rootEl = domIdOrDom
  } else {
    console.error('参数错误：需传入 id 字符串或 DOM 元素')
    return
  }
  if (!rootEl) {
    console.error('未找到指定 DOM')
    return
  }

  // 找到表头和表体对应的 table 元素
  const headTable = rootEl.querySelector('thead')?.closest('table') || rootEl
  const bodyTable = rootEl.querySelector('tbody')?.closest('table') || rootEl

  const headerRows = Array.from(headTable.querySelectorAll('thead tr'))
  const bodyRows = Array.from(bodyTable.querySelectorAll('tbody tr'))

  if (!headerRows.length) {
    console.error('未找到 thead tr')
    return
  }

  // ----- 解析表头为树状结构（复用你的解析逻辑） -----
  function parseHeaderTree(rows) {
    const grid = []
    const nodesByRow = []
    const roots = []

    for (let r = 0; r < rows.length; r++) {
      const tr = rows[r]
      nodesByRow[r] = []
      let c = 0
      for (const cell of Array.from(tr.children)) {
        while (grid[r] && grid[r][c]) c++

        const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10)
        const colspan = parseInt(cell.getAttribute('colspan') || '1', 10)
        const label = (cell.innerText || '').trim()

        const node = {
          label,
          rowspan,
          colspan,
          start: c,
          end: c + colspan - 1,
          classList: Array.from(cell.classList || []),
          children: [],
          _deleted: false,
          _leafIndex: -1,
        }

        for (let rr = 0; rr < rowspan; rr++) {
          for (let cc = 0; cc < colspan; cc++) {
            grid[r + rr] = grid[r + rr] || []
            grid[r + rr][c + cc] = true
          }
        }

        if (r === 0) {
          roots.push(node)
        } else {
          const parent = nodesByRow[r - 1].find(n => c >= n.start && c <= n.end)
          if (parent) parent.children.push(node)
          else roots.push(node)
        }

        nodesByRow[r].push(node)
        c += colspan
      }
    }
    return roots
  }

  // 收集叶子节点
  const leafList = []
  function collectLeaves(nodes) {
    for (const n of nodes) {
      if (n.children.length) {
        collectLeaves(n.children)
      } else {
        n._leafIndex = leafList.length
        leafList.push(n)
      }
    }
  }

  const roots = parseHeaderTree(headerRows)
  collectLeaves(roots)

  // ----- 过滤需要删除的列 -----
  function matchesDelete(node) {
    if (deleteCols.includes(node.label)) return true
    for (const d of deleteCols) {
      if (typeof d === 'string' && d.startsWith('.')) {
        const cls = d.slice(1)
        if (node.classList.includes(cls)) return true
      }
    }
    return false
  }

  function markDeleted(node) {
    if (node.children.length) {
      node.children.forEach(markDeleted)
    } else {
      node._deleted = true
    }
  }

  function filterNodes(nodes) {
    const out = []
    for (const node of nodes) {
      if (matchesDelete(node)) {
        markDeleted(node)
        continue
      }
      if (node.children.length) {
        node.children = filterNodes(node.children)
        node.colspan = node.children.reduce((sum, c) => sum + (c.colspan || 1), 0)
        if (!node.children.length) continue
      }
      out.push(node)
    }
    return out
  }

  const filteredRoots = filterNodes(roots)

  const keepLeafIndexes = leafList
    .map((leaf, i) => ({ leaf, i }))
    .filter(({ leaf }) => !leaf._deleted)
    .map(({ i }) => i)

  if (keepLeafIndexes.length === 0) {
    console.error('删除后没有剩余列可导出')
    return
  }

  // ----- 计算表头深度 -----
  function getDepth(nodes) {
    if (!nodes.length) return 0
    return 1 + Math.max(...nodes.map(n => getDepth(n.children)))
  }
  const headerDepth = getDepth(filteredRoots)

  // ----- 创建 sheet 数据和合并范围 -----
  const sheetData = []
  const merges = []

  function drawHeader(nodes, row = 0, col = 0) {
    let curCol = col;
    for (const node of nodes) {
      const colspan = node.colspan || 1;
      const rowspan = node.children.length > 0 ? 1 : (headerDepth - row)
      if (!sheetData[row]) sheetData[row] = []
      sheetData[row][curCol] = node.label

      if (rowspan > 1 || colspan > 1) {
        merges.push({
          s: { r: row, c: curCol },
          e: { r: row + rowspan - 1, c: curCol + colspan - 1 },
        })
      }

      if (node.children.length) {
        drawHeader(node.children, row + 1, curCol)
      }

      curCol += colspan
    }
  }

  drawHeader(filteredRoots)

  // ----- 写入 body 行，只保留保留的叶子列 -----
  for (let r = 0; r < bodyRows.length; r++) {
    if (deleteRows.includes(r)) continue
    const tr = bodyRows[r]
    const tds = Array.from(tr.children)
    const rowData = keepLeafIndexes.map(i => {
      const td = tds[i]
      return td ? td.innerText.trim() : ''
    });
    sheetData.push(rowData)
  }

  // ----- 生成 worksheet -----
  const ws = xlsx.utils.aoa_to_sheet(sheetData)

  // 设置合并单元格
  ws['!merges'] = merges

  // ----- 调整列宽 -----
  ws['!cols'] = []
  function calcWidth(s) {
    let w = 0
    for (const ch of String(s || '')) {
      w += /[\u4e00-\u9fa5]/.test(ch) ? 1.5 : 1
    }
    return Math.max(minWidth, Math.ceil(w) + 2)
  }

  for (let c = 0; c < keepLeafIndexes.length; c++) {
    let maxLen = minWidth
    // header
    for (let r = 0; r < headerDepth; r++) {
      if (sheetData[r] && sheetData[r][c]) {
        const w = calcWidth(sheetData[r][c])
        if (w > maxLen) maxLen = w
      }
    }
    // body
    for (let r = headerDepth; r < sheetData.length; r++) {
      if (sheetData[r] && sheetData[r][c]) {
        const w = calcWidth(sheetData[r][c])
        if (w > maxLen) maxLen = w
      }
    }
    if (maxWidth !== null && maxLen > maxWidth) maxLen = maxWidth
    ws['!cols'][c] = { wch: maxLen }
  }

  // ----- 对齐样式 -----
  // xlsx官方js版不支持设置单元格样式，如果你用的是xlsx-style或者其它版本可自行添加样式

  // ----- 生成工作簿 -----
  const wb = {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: ws,
    },
  }

  // ----- 导出 -----
  const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  if (typeof FileSaver !== 'undefined' && FileSaver.saveAs) {
    FileSaver.saveAs(blob, `${fileName}.xlsx`)
  } else {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  }
}

// （3）读取excel
export function $readExcel(event, sheetIndex = 0) {
  const files = event.raw
  let fileType = files.name.split('.')[1]
  if (fileType !== 'xlsx' && fileType !== 'xls') return ElMessage.$message.warning('须上传.xls文件或.xlsx文件')

  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(files)
    fileReader.onload = (fileEvent) => {
      let myXls = xlsx.read(fileEvent.target.result, { type: 'binary' })
      let sheetName = myXls.SheetNames[sheetIndex]
      let jsonArr = xlsx.utils.sheet_to_json(myXls.Sheets[sheetName])

      resolve(jsonArr)
    }
  })

}


// 根据路由生成类名
export function $getRouteClass() {
  const route = useRoute()
  const path = route.path.replace(/^\/|\/$/g, '') // 去掉首尾 /
  if (!path) return []
  return path.split('/')
}

// // 添加表格索引
// export function $addTableIndex(data, currentPageNum = 1, currentPageSize, fieldName = 'index') {
//   if (!Array.isArray(data)) return []
//   return data.map((item, index) => {
//     let indexValue
//     if (currentPageSize && currentPageNum) {
//       // 分页模式
//       indexValue = (currentPageNum - 1) * currentPageSize + index + 1
//     } else {
//       // 非分页模式
//       indexValue = index + 1
//     }
//     return { ...item, [fieldName]: indexValue }
//   })
// }


// 添加表格索引
export function $addTableIndex(data, options = {}) {
  if (!Array.isArray(data)) return []
  const { currentPageNum = 1, currentPageSize, fieldName = 'index' } = options
  try {
    data.forEach((item, index) => {
      if (currentPageSize && currentPageNum) {
        // 分页模式
        item[fieldName] = (currentPageNum - 1) * currentPageSize + index + 1
      } else {
        // 非分页模式
        item[fieldName] = index + 1
      }
    })
  } catch {

  }
  return data
}






