<template>
  <el-dialog class="c-dialog file-upload-dialog" :visible="true" :modal-append-to-body="true" :append-to-body="true" :close-on-click-modal="false" :before-close="handleCloseDialog">
    <div class="c-d-header">
      <span class="c-d-title">上传文件</span>
      <i class="el-icon-close" @click="handleCloseDialog"></i>
    </div>
    <div class="c-d-content">
      <div class="c-d-c-inner">
        <div class="upload-card">
          <div class="upload-operate">
            <el-upload class="upload-file-button" ref="upload" action=" " accept="" :file-list="fileList" :show-file-list="false" :auto-upload="false" :before-upload="handleBeforeUpload" :on-change="handleChangeUpload">
              <c-button type="primary" i="add" :disabled="isUploadDisabled">上传文件</c-button>
            </el-upload>
          </div>
          <c-file-list class="upload-content" :fileList="fileList" name="name" @view="handlePreview" @delete="handleDelete" :showDownload="false"></c-file-list>
        </div>
      </div>
    </div>
    <div class="c-d-footer">
      <el-button class="cancel-button" @click="handleCloseDialog">取消</el-button>
      <el-button type="primary" class="confirm-button" @click="handleConfirmUpload" :loading="isConfirmLoading">上传</el-button>
    </div>

  </el-dialog>
</template>
<script>
import { fileUpload } from '@/api/framework/template-manage/file'
export default {
  props: {
    currentActiveNode: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      isConfirmLoading: false,
      fileList: [],
      isUploadDisabled: false,
    }
  },
  created() { },
  methods: {
    // 二、操作相关
    // 1、上传相关
    // （1）上传检查
    handleBeforeUpload(file) {
      //   const isFileType = file.type === 'image/jpeg' || 'image/png'
      //   const isFileSize = file.size / 1024 / 1024 <= 1;
      //   if (!isFileType) { this.$message.error('上传文件只能是jpg、png格式!') }
      //   if (!isFileSize) { this.$message.error('上传文件大小要求小于1M'); }
      //   return isFileType && isFileSize;
      return true
    },
    // （2）限制单次上传数量
    handleChangeUpload(files, fileList) {
      // // 单个上传
      if (fileList.length > 1) { fileList.splice(0, 1) }
      // 多个上传
      // this.$set(this, 'fileList', fileList)
      this.fileList = fileList
    },
    // （3）预览
    handlePreview(rowItem) {
      this.$previewFile(rowItem.raw, rowItem.raw.name, '_blank')
    },
    // （4）删除
    handleDelete(rowItem) {
      let deleteIndex = this.fileList.findIndex(item => rowItem.uid === item.uid)
      this.fileList.splice(deleteIndex, 1)
      //   this.handleRemove()
    },
    // （5）确认上传
    handleConfirmUpload() {
      const file = this.fileList[0].raw
      var formData = new FormData()
      formData.append('file', file)
      this.isUploadDisabled = true
      fileUpload(formData, this.currentActiveNode.id).then(res => {
        if (res.code === 200) {
          this.$message.success('上传文件成功！')
          this.$emit('success')
        } else {
          this.$message.error('上传文件失败！')
        }
        this.isUploadDisabled = false
      }).catch(() => { })
    },
    // 2、关闭模态框
    handleCloseDialog() {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.file-upload-dialog {
  width: 600px;

  .c-d-content {
    padding: 40px 40px 20px;

    .c-d-c-inner {
      min-width: calc(600px - 85px);

      .upload-card {
        width: 500px;
        // max-height: 320px;
        background: #eef4f4;
        border-radius: 4px;
        border: 1px solid #dedede;

        .upload-operate {
          margin: 20px auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;

          ::v-deep .c-icon {
            &:hover {
              color: var(--themeColor) !important;
            }
          }

          .upload-description {
            color: #999;
          }
        }

        .upload-content {
          margin: 0 auto 20px;
          width: 400px;
          max-height: 225px;
          background-color: #fff;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>