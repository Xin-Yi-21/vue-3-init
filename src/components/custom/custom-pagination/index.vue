<template>
  <el-pagination class="c-pagination" @size-change="handleChangePageSize" @current-change="handleChangePageNum" :current-page.sync="pageNum" :page-size.sync="pageSize" :page-sizes="pageSizeList" :layout="layout" :total="total" background prev-text="上一页" next-text="下一页">
  </el-pagination>
</template>

<script>
export default {
  props: {
    currentPageNum: {
      type: Number,
      default: 1,
    },
    currentPageSize: {
      type: Number,
      dafault: 10,
    },
    pageSizeList: {
      type: Array,
      default: () => { return [5, 10, 15, 20, 30] }
    },
    layout: {
      type: String,
      default: 'total,prev,pager,next,sizes,jumper',
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    pageNum: {
      get() { return this.currentPageNum },
      set() { }
    },
    pageSize: {
      get() { return this.currentPageSize },
      set() { }
    }
  },
  mounted() {
  },
  data() {
    return {

    }
  },
  methods: {
    // 分页-改变页容量
    handleChangePageSize(pageSize) {
      this.$emit('update:currentPageSize', pageSize)       // this.$parent.form.currentPageSize = pageSize // 写法2
      this.$emit('getTable')
      // this.$parent.getTableData()
    },
    // 分页-改变页码值
    handleChangePageNum(pageNum) {
      this.$emit('update:currentPageNum', pageNum)
      // this.$parent.getTableData()
      this.$emit('getTable')
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep.c-pagination {
  margin: 10px 20px;
  text-align: right;
  padding: 1px 5px;
  .btn-prev,
  .btn-next {
    padding: 0 5px;
  }

  .el-pager {
    // .number {
    // &:hover {
    //   color: #3ea48b !important;
    // }
    // }
    .active {
      background-color: var(--themeColor) !important;
    }
  }
  .el-pagination__sizes {
    margin: 0 5px;
  }
  .el-pagination__jump {
    margin-left: 5px;
  }
}
</style>