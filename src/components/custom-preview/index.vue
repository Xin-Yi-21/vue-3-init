<template>
  <div class="c-preview" v-if="showPreview">
    <template v-if="info.previewType === '_self'">
      <el-dialog class="c-dialog c-preview-self" :style="info.fileType === 'ppt' ? `width:1400px;` : ''" v-model="visible" :modal-append-to-body="true" :append-to-body="true" :close-on-click-modal="false" :before-close="handleCloseDialog">
        <div class="c-d-header">
          <span class="c-d-title">文件预览 - {{ info.fileName }}</span>
          <i class="el-icon-close" @click="handleCloseDialog"></i>
        </div>
        <div class="c-d-content">
          <div class="c-d-c-inner">
            <vue-office-docx v-if="info.fileType === 'word'" :src="info.fileUrl" @rendered="rendered" style="width:100%; height: 100%;" />
            <vue-office-excel v-if="info.fileType === 'excel'" :src="info.fileUrl" @rendered="rendered" style="width: 100%; height: 100%;" />
            <vue-office-pdf v-if="info.fileType === 'pdf'" :src="info.fileUrl" @rendered="rendered" style="width: 100%; height: 100%;" />
            <img v-if="info.fileType === 'image'" :src="info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;border:0;objectFit:contain;">
            <!-- <iframe v-if="info.fileType === 'pdf'" :src="info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;"></iframe> -->

            <iframe v-if="info.fileType === 'txt'" :src="info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;"></iframe>
            <video v-if="info.fileType === 'video'" controls :src="info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;"></video>
            <audio v-if="info.fileType === 'audio'" controls :src="info.fileUrl"></audio>

            <iframe v-if="info.fileType === 'ppt'" :src="`/PPTXjs/index.html?file=` + info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;"></iframe>
          </div>
        </div>
      </el-dialog>
    </template>
    <template v-else>
      <div class="c-preview-blank" style="width: calc(100% - 10px);height: calc(100% - 10px);display: flex;justify-content: center;align-items: center;">
        <vue-office-excel v-if="info.fileType === 'excel'" :src="info.fileUrl" style="width: 100%; height: 100%;" />
        <video v-if="info.fileType === 'video'" controls :src="info.fileUrl" style="width: 100%; height: 100%;"></video>
        <audio v-if="info.fileType === 'audio'" controls :src="info.fileUrl"></audio>
        <iframe v-if="info.fileType === 'ppt'" :src="`/PPTXjs/index.html?file=` + info.fileUrl" style="width: 100%; height: calc(100% - 4px);border:0;"></iframe>
      </div>
    </template>
  </div>
</template>
<script setup>
// # 一、综合
// 组件
// VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
// VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
// VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'
// props
const props = defineProps({
  info: { type: Object, default: () => { } },
})

// ^
// # 二、模块功能
const visible = ref(true)
const showPreview = ref(true)
const vueInstance = ref(null)
function rendered() {
  // console.log("渲染完成")
}
// 关闭模态框
function handleCloseDialog() {
  showPreview.value = false
}
// ^
</script>

<style lang="scss" scoped>
.c-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

:deep(.c-preview-self) {
  top: 50%;
  left: 50%;
  bottom: auto;
  transform: translate(-50%, -50%);
  background-color: transparent;
  border-radius: 4px;
  height: 85vh;
  // max-height: 90vh;
  // max-width: 90vw;
  width: 1000px;

  // 去除默认样式
  .el-dialog {
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: transparent;
    box-shadow: 0 0 0 !important;
    overflow: hidden;

    &:not(.is-fullscreen) {
      margin-top: 0 !important;
    }

    .el-dialog__header {
      padding: 0;
      display: none;

      .el-dialog__title {
        display: none;
      }

      .el-dialog__headerbtn {
        display: none;
      }
    }

    .el-dialog__body {
      height: 100%;
      padding: 0;
      box-shadow: 0;
    }
  }

  // 设置自定义样式
  .el-dialog__body {
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fff;

    .c-d-header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      // color: var(--themeColor);
      color: #333;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;

      &::before {
        content: "";
        display: none;
        width: 6px;
        height: 18px;
        background-color: var(--themeColor);
        margin: 0 4px 0 8px;
      }

      .c-d-title {
        flex: 1;
        margin-left: 10px;
        display: flex;
        align-items: center;
      }

      .el-icon-close {
        font-size: 22px;
        margin-right: 20px;
        color: #333;
        cursor: pointer;

        &:hover {
          scale: 1.1;
        }
      }
    }

    .c-d-content {
      height: calc(100% - 50px);
      // flex: 1;
      padding-top: 0;
      overflow: auto;
      margin-bottom: 0px;

      // 滚动条大小
      &::-webkit-scrollbar {
        display: block !important;
        width: 5px !important;
        height: 5px !important;
      }

      // 滚动条轨道
      &::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: #efefef;
      }

      // 滚动条滑块
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: var(--themeColor);
      }

      // 滚动条右下角
      &::-webkit-scrollbar-corner {
        background: transparent;
      }

      .c-d-c-inner {
        height: 100%;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .vue-office-docx {
          overflow-y: auto;

          // 滚动条大小
          &::-webkit-scrollbar {
            display: block !important;
            width: 5px !important;
            height: 5px !important;
          }

          // 滚动条轨道
          &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #efefef;
          }

          // 滚动条滑块
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: var(--themeColor);
          }

          // 滚动条右下角
          &::-webkit-scrollbar-corner {
            background: transparent;
          }

          .docx-wrapper {
            padding: 10px;
            padding-top: 20px;
            background-color: transparent;
          }
        }
      }
    }

    .c-d-footer {
      flex-shrink: 0;
      width: 100%;
      height: 50px;
      margin-top: auto;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-radius: 0px 0px 4px 4px;
      padding: 0 40px;

      .confirm-button {
        background: var(--themeColor);
        border: 1px solid var(--themeColor);
        border-radius: 4px;
      }

      .el-button {
        margin: 0 20px 0 0;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
