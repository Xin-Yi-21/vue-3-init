import Vue from "vue"
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
// 加载
let loading
export function $loadingStart(dom, text) {
    loading = Vue.prototype.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        text: text || '加载中',
        background: 'rgba(255, 255, 255, 0.8)',
        target: document.querySelector(dom), // 设置加载动画区域
    })
}
export function $loadingEnd() {
    loading.close()
}
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
// tableData：要导出的查询表格数据
// tableHeaderLRV：表头的label和prop对应关系，建议设置el-table的ref属性和el-table-column的prop属性来动态获取
// fileName：导出的文件名
// handleSpecialProp：特殊列的数据展示处理
export function $exportTableByGlobal(tableData, tableHeaderLRV, fileName, handleSpecialProp) {
    // 表格数据
    let exportTableData = []
    tableData.forEach((item, index) => {
        let rowArr = []
        for (var label in tableHeaderLRV) {
            let prop = tableHeaderLRV[label]
            let rowcol = item[prop]
            if (handleSpecialProp) { rowcol = handleSpecialProp(prop, item, index) }
            rowArr.push(rowcol)
        }
        exportTableData.push(rowArr)
    })
    // 表头中文
    let tableHeaderCnList = []
    for (var k in this.tableHeaderLRV) { tableHeaderCnList.push(k) }
    import('@/utils/exportExcel').then(excel => {
        excel.export_json_to_excel({
            header: tableHeaderCnList,
            data: exportTableData,
            filename: fileName,
            autoWidth: true,
            bookType: 'xlsx'
        })
    })
}

import FileSaver from "file-saver"
// import XLSX from "xlsx"
import * as XLSX from "xlsx"
export function $exportDomTableByGlobal(domId, fileName, deleteIndexArr) {
    let xlsxParam = { raw: true }
    let wb = XLSX.utils.table_to_book(document.querySelector('#' + domId), xlsxParam)
    if (deleteIndexArr && deleteIndexArr.length > 0) {
        deleteIndexArr.forEach((item, index) => {
            wb.Sheets.Sheet1['!cols'][item] = { hidden: true }
        })
    }
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName + '.xlsx')
    } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
    }
    this.isDownloading = false
    return wbout
}

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
