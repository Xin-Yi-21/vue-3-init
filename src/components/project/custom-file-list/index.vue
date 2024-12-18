<template>
  <div class="c-file-list y-scroll" v-if="fileList.length > 0">
    <div class="file-list-item" v-for="(item, index) in fileList" :key="index">
      <c-icon i="file-choose" class="file-icon" size="16" tip=""></c-icon>
      <span class="file-name">{{ item[name] }}</span>
      <c-icon i="table-view" class="view-icon" color="#55c791" tip="查看" v-if="showView" :disabled="disabledView" @click="handleView(item)" v-preventReClick="2000"></c-icon>
      <c-icon i="download" color="#55c791" tip="下载" size="18" v-if="showDownload" :disabled="disabledDownload" @click="handleDownload(item)" v-preventReClick="2000"></c-icon>
      <c-icon i="table-delete" class="delete-icon" color="#FA4B4B" tip="删除" v-if="showDelete" :disabled="disabledDelete" @click="handleDelete(item)" v-preventReClick="2000"></c-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'fileName'
    },
    fileList: {
      type: Array,
      default: () => []
    },
    showView: {
      type: Boolean,
      default: true
    },
    disabledView: {
      type: Boolean,
      default: false,
    },
    showDownload: {
      type: Boolean,
      default: true
    },
    disabledDownload: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    disabledDelete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    }
  },

  methods: {
    // 1、查看
    handleView(rowItem) {
      this.$emit('view', rowItem)
    },
    // 2、下载
    handleDownload(rowItem) {
      this.$emit('download', rowItem)
    },
    // 3、删除
    handleDelete(rowItem) {
      this.$emit('delete', rowItem)
    }
  },
}
</script>

<style lang="scss" scoped>
.c-file-list {
  padding: 10px 10px 5px;
  height: 100%;
  box-sizing: border-box;

  // overflow-y: auto;
  // // 滚动条大小
  // &::-webkit-scrollbar {
  //   display: block !important;
  //   width: 5px !important;
  //   height: 5px !important;
  // }
  // // 滚动条轨道
  // &::-webkit-scrollbar-track {
  //   border-radius: 10px;
  //   background-color: #efefef;
  // }
  // // 滚动条滑块
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 10px;
  //   background-color: var(--themeColor);
  // }
  // // 滚动条右下角
  // &::-webkit-scrollbar-corner {
  //   background: transparent;
  // }
  .file-list-item {
    display: flex;
    align-items: center;
    height: 30px;
    margin-bottom: 5px;

    &:hover {
      background-color: #eefaf4;
    }

    .file-icon {
      width: 30px;
    }

    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>