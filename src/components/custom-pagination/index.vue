<template>
  <div class="c-pagination">
    <el-popover placement="top" :trigger="selectedOptions.trigger" :teleported="true" popper-class="c-pagination-selected-popover" v-if="selectedOptions.show" :disabled="false">
      <template #default>
        <slot name="selected" v-if="selectedOptions.show"> </slot>
      </template>
      <template #reference>
        <el-tag type="info" v-show="selectedOptions.total > 0 || selectedOptions.alwaysShow">已选择数据： {{ selectedOptions.total || 0 }}条</el-tag>
      </template>
    </el-popover>

    <el-pagination v-bind="componentAttrs" v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizeList" :total="total">
      <template #default v-if="pageSizeOptions?.isCustom">
        <el-select class="custom-pagination__sizes" :teleported="false" v-model="pageSize" :filterable="pageSizeOptions?.isUpdate" :allow-create="pageSizeOptions?.isUpdate" placeholder="请选择或输入页容量" @change="handleChangePageSize">
          <el-option v-for="(item, index) in customPageList" :key="index" :label="item.label === '全部' ? item.label : item.label + '条/页'" :value="item.value">
            <template #default v-if="!item.origin">
              <span>{{ item.label }}条/页</span>
              <el-icon @click.stop="handleDeletePageSize(item.value)" class="close-icon">
                <Close />
              </el-icon>
            </template>
          </el-option>
        </el-select>
      </template>
    </el-pagination>
    <!-- <el-tooltip placement="top" effect="light" trigger="hover" popper-class="operate-model-el-tooltip">
      <template #content>
        <div class="tip">
          <div class="tip-item">1、下方分页器配置改变会自动应用到全局。清空缓存后自动恢复至默认设置。</div>
          <div class="tip-item">2、是否开启自定义页容量。</div>
        </div>
      </template>
      <c-icon i="c-attention" size="14" cursor="pointer"></c-icon>
    </el-tooltip> -->
  </div>
</template>
<script setup>
// # 一、综合
// props
const props = defineProps({
  // 当前页码值
  currentPageNum: { type: Number, default: 1 },
  // 当前页容量
  currentPageSize: { type: Number, default: 10 },
  // 总数
  total: { type: Number, default: 0 },
  // 选中的总数
  selectedTotal: { type: Number, default: 0 },
  // 页容量选择数组
  pageSizeList: { type: Array, default: () => [5, 10, 15, 20, 30] },
  // 页容量配置
  pageSizeOptions: { type: Object, default: () => ({ isCustom: true, isAll: true, isUpdate: true, }) },
  // 选中配置
  selectedOptions: { type: Object, default: () => ({ total: 0, show: false, alwaysShow: false, trigger: 'hover', isTip: true }) },
})
// ^

// # 二、模块功能
// # 1、双向绑定
const emit = defineEmits(['update:currentPageNum', 'update:currentPageSize', 'getTable'])
const pageNum = computed({
  get: () => props.currentPageNum,
  set: (newValue) => emit('update:currentPageNum', newValue)
})

const pageSize = computed({
  get: () => props.currentPageSize,
  // set: (newValue) => emit('update:currentPageSize', newValue)
  set: (newValue) => handleChangePageSize(newValue)
})

watch(() => props.currentPageNum, () => emit('getTable'))
watch(() => props.currentPageSize, () => emit('getTable'))
// ^
// # 2、继承el-pagination其他属性
// defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const componentAttrs = computed(() => {
  const base = {
    background: true,
    'prev-text': '上一页',
    'next-text': '下一页',
    layout: 'total,prev,pager,next,sizes,jumper',
    ...attrs,
  }

  // 替换 layout 中的 sizes 为 slot，以使用自定义插槽
  if (props.pageSizeOptions?.isCustom & base.layout.includes('sizes')) {
    base.layout = base.layout.replace(/sizes/, 'slot')
  }

  return base
})
// ^
// # 3、页容量配置
const customPageList = ref(props.pageSizeList?.map(i => ({ label: i, value: i, origin: true })) || [])
if (props.pageSizeOptions?.isAll) { customPageList.value.push({ label: '全部', value: 'ALL', origin: true }) }
function handleChangePageSize(val) {
  if (val === 'ALL') {
    emit('update:currentPageSize', props.total)
    return
  }

  const num = Number(val)
  if (!Number.isInteger(num) || num <= 0) {
    emit('update:currentPageSize', props.currentPageSize)
    return
  }
  const exists = customPageList.value.some(item => item.value === num)
  if (!exists) {
    customPageList.value.push({ label: num, value: num, origin: false })
  }
  emit('update:currentPageSize', num)
}

function handleDeletePageSize(value) {
  const index = customPageList.value.findIndex(item => item.value === value)
  if (index !== -1) customPageList.value.splice(index, 1)

  // 如果删除的是当前值，重置一个默认
  if (pageSize.value === value) {
    pageSize.value = 10
  }
}
// ^
// ^
</script>

<style lang="scss" scoped>
.c-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  margin: 10px 10px;
  padding: 0;
  text-align: right;
  margin-left: auto;

  * {
    font-size: var(--cfs);
  }

  :deep(>.el-tag) {
    cursor: pointer;
    height: 30px;
    margin-right: 20px;
  }



  .el-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    margin: 10px 0;
    padding: 0;
    text-align: right;
    margin-left: auto;

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

    :deep(.custom-pagination__sizes) {
      height: 32px;
      margin: 0 5px;

      .el-select__wrapper {
        height: 100%;
        min-height: 100%;
      }

      .el-select-dropdown__item {
        position: relative;
        text-align: left;

        .close-icon {
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);

          &:hover {
            color: red;
          }
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
}

.operate-model-el-tooltip {
  .tip {
    font-size: 14px;
    color: #FF6100;

    .tip-item {
      display: flex;
      align-items: center;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss">
// 全局样式
.c-pagination-selected-popover {
  width: auto !important;
  padding: 9px !important;
}
</style>