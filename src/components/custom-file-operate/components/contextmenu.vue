<template>
  <div class="contextmenu-container">
    <div class="operate-part">
      <template>
        <div class="operate-item" @click="handleCreateCatalogue">新建子目录</div>
        <div class="operate-item" @click="handleRename">重命名</div>
        <div class="operate-item" @click="handleDelete">删除</div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentRightNode: {
      type: Object,
      default: () => { }
    },
    cutInfo: {
      type: Object,
      default: () => { }
    },
    copyInfo: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {

    }
  },
  mounted() {
    window.addEventListener('click', this.globalClick)
  },

  methods: {
    // 二、操作相关
    // 0、全局点击
    globalClick() {
      this.$emit('close')
    },
    // 1、项目集右键操作
    // (1) 新建项目
    handleCreateCatalogue() {
      this.$emit('operate', 'createCatalogue')
    },
    // (2) 重命名
    handleRename() {
      this.$emit('operate', 'rename')
    },
    // (3) 删除
    handleDelete() {
      this.$emit('operate', 'delete')
    },
  },
  beforeDestroy() {
    window.removeEventListener('click', this.globalClick)
  }
}
</script>

<style lang="scss" scoped>
.contextmenu-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 120px;
  // background-color: #696b6d;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 99999;
  color: #333;
  .operate-part {
    overflow: hidden;
    .operate-item {
      padding: 0 10px;
      height: 25px;
      line-height: 25px;
      font-size: 12px;

      &:hover {
        color: var(--themeColor);
        font-weight: 700;
        cursor: pointer;
      }
      &:first-child {
        margin-top: 5px;
      }
      &:last-child {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
