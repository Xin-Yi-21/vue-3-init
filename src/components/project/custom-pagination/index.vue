<template>
  <el-pagination class="c-pagination" @size-change="handleChangePageSize" @current-change="handleChangePageNum" :current-page.sync="pageNum" :page-size.sync="pageSize" :page-sizes="pageSizeList" :layout="layout" :total="total" background prev-text="上一页" next-text="下一页">
  </el-pagination>
</template>

<script setup>
const props = defineProps({
  // 当前页码值
  currentPageNum: { type: Number, default: 1, },
  // 当前页容量
  currentPageSize: { type: Number, dafault: 10, },
  // 总数
  total: { type: Number, default: 0 },
  // 页容量选择数组
  pageSizeList: { type: Array, default: () => { return [5, 10, 15, 20, 30] } },
  // 分页布局配置
  layout: { type: String, default: 'total,prev,pager,next,sizes,jumper', },
})

const emit = defineEmits(['update:currentPageNum', 'update:currentPageSize', 'getTable'])
const pageNum = computed({
  get: () => props.currentPageNum,
  set: (newValue) => emit('update:currentPageNum', newValue)
})

const pageSize = computed({
  get: () => props.currentPageSize,
  set: (newValue) => emit('update:currentPageSize', newValue)
})
// 分页-改变页容量
function handleChangePageSize(pageSize) {
  emit('update:currentPageSize', pageSize)       // this.$parent.form.currentPageSize = pageSize // vue2写法2
  emit('getTable')
}
// 分页-改变页码值
function handleChangePageNum(pageNum) {
  emit('update:currentPageNum', pageNum)
  emit('getTable')
}
</script>

<style lang="scss" scoped>
.c-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  margin: 10px 20px;
  padding: 0;
  text-align: right;
  // background-color: red;

  * {
    font-size: 13px;
  }


  :deep(.btn-prev),
  :deep(.btn-next) {
    height: 100%;
    padding: 0 10px !important;
  }

  :deep(.el-pager) {
    height: 100%;

    li {
      height: 100%;
    }

    .active {
      background-color: var(--tc) !important;
    }
  }

  :deep(.el-pagination__sizes) {
    height: 32px;
    margin: 0 5px;

    .el-select {
      height: 100%;

      .el-select__wrapper {
        height: 100%;
        min-height: 100%;
      }
    }
  }

  :deep(.el-pagination__jump) {
    height: 32px;
    margin-left: 5px;

    .el-input {
      height: 100%;
    }
  }
}
</style>