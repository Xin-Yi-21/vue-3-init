<template>
  <div class="custom-echart-vue">
    <div class="normal-view" v-show="!isShowTable.normal">
      <div :id="eId" class="echart-area"> </div>
      <div class="echart-tool" v-if="tool?.length > 0">
        <c-icon v-if="tool.includes('changeView')" i="c-change-view" tip="切换视图" size="16" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleChangeView('normal')"></c-icon>
        <c-icon v-if="tool.includes('copyData')" i="c-copy-text" tip="复制数据" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleCopyData()"></c-icon>
        <c-icon v-if="tool.includes('exportImage')" i="c-export-image" tip="导出图片" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportImage()"></c-icon>
        <c-icon v-if="tool.includes('exportExcel')" i="c-export-excel" tip="导出表格" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportExcel()"></c-icon>
        <c-icon v-if="tool.includes('fullScreen')" i="c-fullscreen-in" tip="开启全屏" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleFullscreenIn()"></c-icon>
      </div>
    </div>

    <div class="table-view" v-show="isShowTable.normal">
      <div class="button-part">
        <c-button type="primary" height="30" @click="handleCloseTable('normal')">关闭表格</c-button>
        <c-button type="primary" height="30" @click="handleCloseTableAndRefresh('normal')">关闭并刷新</c-button>
      </div>
      <el-table :data="eInfo.tableData" border class="c-table">
        <el-table-column :label="item.label" :prop="item.field" align="center" v-for="(item, index) in eInfo.tableHeader" :key="index"></el-table-column>
      </el-table>
    </div>

    <el-dialog class="echart-fullscreen-view c-dialog" v-model="isShowFullscreen" :modal-append-to-body="false" align-center :close-on-click-modal="false" :before-close="handleFullscreenOut">
      <div class="normal-view-fs" v-show="!isShowTable.fullscreen">
        <div :id="eId + '-fs'" class="echart-area-fs"> </div>
        <div class="echart-tool-fs" v-if="tool?.length > 0">
          <c-icon v-if="tool.includes('changeView')" i="c-change-view" tip="切换视图" size="16" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleChangeView('fullscreen')"></c-icon>
          <c-icon v-if="tool.includes('copyData')" i="c-copy-text" tip="复制数据" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleCopyData()"></c-icon>
          <c-icon v-if="tool.includes('exportImage')" i="c-export-image" tip="导出图片" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportImage()"></c-icon>
          <c-icon v-if="tool.includes('exportExcel')" i="c-export-excel" tip="导出表格" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleExportExcel()"></c-icon>
          <c-icon v-if="tool.includes('fullScreen')" i="c-fullscreen-out" tip="退出全屏" size="18" cursor="pointer" color="#999" :hoverColor="settingStore?.themeColor" showType="el" @click="handleFullscreenOut()"></c-icon>
        </div>
      </div>
      <div class="table-view-fs" v-show="isShowTable.fullscreen">
        <div class="button-part">
          <c-button type="primary" height="30" @click="handleCloseTable('fullscreen')">关闭表格</c-button>
          <c-button type="primary" height="30" @click="handleCloseTableAndRefresh('fullscreen')">关闭并刷新</c-button>
        </div>
        <el-table :data="eInfoFs.tableData" border class="c-table">
          <el-table-column :label="item.label" :prop="item.field" align="center" v-for="(item, index) in eInfoFs.tableHeader" :key="index"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// # 一、综合
import useSettingStore from '@/store/system/setting'
const props = defineProps({
  eId: { type: String, default: '' },
  eInfo: { type: Object, default: () => { } },
  eInfoFs: { type: Object, default: () => { } },
  tool: { type: Array, default: () => ['changeView', 'copyData', 'exportImage', 'exportExcel', 'fullScreen'] },
})

const settingStore = useSettingStore()
const { proxy } = getCurrentInstance()
const emit = defineEmits()
// ^

// # 二、模块功能
// # 1、工具栏操作
// # (1) 切换视图
const isShowTable = ref({ normal: false, fullscreen: false })
function handleChangeView(type) {
  if (type === 'normal') {
    isShowTable.value.normal = !isShowTable.value.normal
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = !isShowTable.value.fullscreen
  }
}
function handleCloseTable(type) {
  if (type === 'normal') {
    isShowTable.value.normal = false
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = false
  }
}
function handleCloseTableAndRefresh(type) {
  if (type === 'normal') {
    isShowTable.value.normal = false
    emit('refresh', 'normal')
  }
  if (type === 'fullscreen') {
    isShowTable.value.fullscreen = false
    emit('refresh', 'fullscreen')
  }
}
// ^
// # (2) 复制数据
function handleCopyData() {
  const tableHeader = props.eInfo.tableHeader
  const tableData = props.eInfo.tableData
  // 判断字符的长度
  function getCharLength(str) {
    let length = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i)
      // 中文字符占3个单位长度
      if (/[\u4e00-\u9fa5]/.test(char)) { length += 3 }
      // 数字或字母占2个单位长度
      else if (/[a-zA-Z0-9]/.test(char)) { length += 2 }
      // 其他字符占1个单位长度
      else { length += 1 }
    }
    return length
  }
  // 获取表头的字段
  const headers = tableHeader.map(header => header.label)
  const fields = tableHeader.map(header => header.field)
  // 计算每列的最大宽度（字符数）
  const columnWidths = tableHeader.map((header, index) => {
    // 先计算表头的宽度
    let maxLength = getCharLength(header.label)
    // 然后计算数据行中的最大宽度
    tableData.forEach(row => {
      const field = fields[index]
      const value = row[field] !== undefined ? String(row[field]) : ''
      maxLength = Math.max(maxLength, getCharLength(value))
    })
    return maxLength
  })
  // 定义右侧间隔（每列右侧添加10个空格）
  const rightSpacing = 10
  // 创建表头行
  const headerRow = headers.map((header, index) => {
    const padding = ' '.repeat(columnWidths[index] + rightSpacing - getCharLength(header))
    return header + padding
  }).join('')
  // 生成表格数据行
  const dataRows = tableData.map(row => {
    return fields.map((field, index) => {
      const value = row[field] !== undefined ? String(row[field]) : ''
      const padding = ' '.repeat(columnWidths[index] + rightSpacing - getCharLength(value))
      return value + padding
    }).join('')
  })
  // 合并表头和数据行
  const tableText = [headerRow, ...dataRows].join('\n')
  // 复制到剪贴板
  navigator.clipboard.writeText(tableText)
    .then(() => { proxy.$message.success('数据已复制到粘贴板！') })
    .catch(err => { proxy.$message.error('数据复制失败！') })
}

// ^
// # (3) 导出图片
function handleExportImage() {
  let newExportFileName = (props.eInfo.exportFileName || '') + '图'
  proxy.$exportEchartImage(props.eInfo.instance, { name: newExportFileName, type: 'png', pixelRatio: 10, backgroundColor: settingStore.theme.echartTheme.bg })
}
// ^
// # (4) 导出表格
import ExcelJS from 'exceljs'
function handleExportExcel() {
  const tableHeader = props.eInfo.tableHeader
  const tableData = props.eInfo.tableData
  // 创建一个工作簿和工作表
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  // 设置表头
  worksheet.columns = tableHeader.map(header => ({
    header: header.label,
    key: header.field,
    width: 15  // 默认宽度，可以稍后根据内容进行调整
  }))
  // 添加数据行
  tableData.forEach(row => { worksheet.addRow(row) })
  // 调整列宽，确保每列宽度足够容纳最长的数据内容
  worksheet.columns.forEach((column, index) => {
    let maxLength = 0
    // 计算每列的最大长度
    tableData.forEach(row => {
      const cellValue = row[tableHeader[index].field]
      maxLength = Math.max(maxLength, (cellValue ? String(cellValue).length : 0))
    })
    // 设置列宽，考虑至少为 10，避免过窄
    column.width = Math.max(maxLength + 2, 10) // 加上 2 是为了留白
  })
  // 设置单元格对齐方式（居中）
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
    })
  })
  let newExportFileName = (props.eInfo.exportFileName || '') + '表'
  // 导出文件
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = newExportFileName + '.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  })
}
// ^
// # (5) 开启全屏
const isShowFullscreen = ref(false)
function handleFullscreenIn() {
  isShowFullscreen.value = true
  emit('fullscreenIn')
  // nextTick(() => { initEchartFs() })
}
function handleFullscreenOut() {
  isShowFullscreen.value = false
  emit('fullscreenOut')
  // proxy.$destroyEchart(echartInfoFs)
}
// ^
// ^
// ^

// # 三、生命周期
// init()
// const timer = ref(null)
// timer.value = setInterval(() => { init() }, 60000)
// onBeforeUnmount(() => {
//   clearInterval(timer.value)
//   proxy.$destroyEchart(echartInfo)
//   proxy.$destroyEchart(echartInfoFs)
// })
// watch(() => settingStore.themeStyle, (nv, ov) => {
//   nextTick(() => { initEchart() })
// })
// ^
</script>

<style lang="scss" scoped>
.custom-echart-vue {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  color: var(--fcp);

  .normal-view {
    width: 100%;
    height: 100%;

    .echart-area {
      width: 100%;
      height: 100%;
    }

    .echart-tool {
      position: absolute;
      top: 0px;
      right: 0px;
      display: flex;
      align-items: center;

      height: 30px;
      padding: 0 10px;
      border-radius: 4px;
      z-index: 99;

      .c-icon {
        margin: 0 10px;
        font-size: 12px;
      }
    }
  }

  .table-view {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    background-color: var(--bg-card);

    .button-part {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 30px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .el-table {
      height: calc(100% - 50px);
    }
  }

  :deep(.echart-fullscreen-view) {
    width: 90vw;
    height: 70vh;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: var(--bg-card);

      .normal-view-fs {
        width: 100%;
        height: 100%;

        .echart-area-fs {
          width: 100%;
          height: 100%;
        }

        .echart-tool-fs {
          position: absolute;
          top: 15px;
          right: 10px;
          display: flex;
          align-items: center;

          height: 30px;
          padding: 0 10px;
          border-radius: 4px;
          z-index: 99;

          .c-icon {
            margin: 0 10px;
            font-size: 12px;
          }
        }
      }

      .table-view-fs {
        width: 100%;
        height: 100%;
        padding: 10px 0;
        background-color: var(--bg-card);

        .button-part {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 30px;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .el-table {
          height: calc(100% - 50px);
        }
      }
    }
  }
}
</style>