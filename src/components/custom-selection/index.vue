<template>
  <div :class="['c-selection', onlySelected ? 'only-selected' : '']">
    <el-alert v-if="tip && !onlySelected && form.selectedIE.tableData?.length" :title="tip" type="warning" :closable="false" />
    <div class="selected" v-if="tableShow.includes('selected') || onlySelected">
      <el-tag type="info" v-if="!onlySelected">{{ form.selected.label }} <span class="selected-count">{{ form.selected.tableData?.length }}</span> 条</el-tag>
      <el-table v-if="form.selected.tableData?.length" :data="form.selected.tableData" class="c-table" border max-height="250">
        <template v-for="(item, index) in form.selected.tableColumnShow" :key="index">
          <el-table-column v-if="item.type === 'nativeIndex'" :label="item.label || '序号'" type="index" align="center" :width="item.width || 60" />
          <el-table-column v-else :label="item.label" align="center" :width="item.width">
            <template #default="scope"> <c-tooltip :content="scope.row?.[item.value]"> {{ scope.row?.[item.value] }}</c-tooltip> </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="selectedE" v-if="tableShow.includes('selectedE') && !onlySelected">
      <el-tag type="success">{{ form.selectedE.label }} <span class="selectedE-count">{{ form.selectedE.tableData?.length }}</span> 条</el-tag>
      <el-table v-if="form.selectedE.tableData?.length" :data="form.selectedE.tableData" class="c-table" border max-height="250">
        <template v-for="(item, index) in form.selectedE.tableColumnShow" :key="index">
          <el-table-column v-if="item.type === 'nativeIndex'" :label="item.label || '序号'" type="index" align="center" :width="item.width || 60" />
          <el-table-column v-else :label="item.label" align="center" :width="item.width">
            <template #default="scope"> <c-tooltip :content="scope.row?.[item.value]"> {{ scope.row?.[item.value] }}</c-tooltip> </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="selectedIE" v-if="tableShow.includes('selectedIE') && !onlySelected">
      <el-tag type="danger">{{ form.selectedIE.label }} <span class="selectedIE-count">{{ form.selectedIE.tableData?.length }}</span> 条</el-tag>
      <el-table v-if="form.selectedIE.tableData?.length" :data="form.selectedIE.tableData" class="c-table" border max-height="250">
        <template v-for="(item, index) in form.selectedIE.tableColumnShow" :key="index">
          <el-table-column v-if="item.type === 'nativeIndex'" :label="item.label || '序号'" type="index" align="center" :width="item.width || 60" />
          <el-table-column v-else :label="item.label" align="center" :width="item.width">
            <template #default="scope"> <c-tooltip :content="scope.row?.[item.value]"> {{ scope.row?.[item.value] }}</c-tooltip> </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  // 选择提示
  tip: { type: String, default: '当前选择存在不符合条件的数据，如继续执行将对其自动筛选忽略！' },
  // 只显示选择的
  onlySelected: { type: Boolean, default: false },
  // 显示表格
  tableShow: { type: Array, default: () => [] },
  // 显示表格列
  tableColumnShow: { type: Array, default: () => [] },
  // 选择的数据
  selected: { type: Object, default: () => ({ tableData: [], tableColumnShow: [], label: '已选择的数据：' }) },
  // 选择的符合条件的数据
  selectedE: { type: Object, default: () => ({ tableData: [], tableColumnShow: [], label: '符合条件的数据：' }) },
  // 选择的不符合条件的数据
  selectedIE: { type: Object, default: () => ({ tableData: [], tableColumnShow: [], label: '不符合条件的数据：' }) },
})
// ^

// # 二、模块功能
// ^

// # 三、机制
const form = computed(() => {
  return {
    selected: {
      label: props.selected?.label || '已选择的数据：',
      tableData: props.selected?.tableData || [],
      tableColumnShow: props.selected?.tableColumnShow || props.tableColumnShow || []
    },
    selectedE: {
      label: props.selectedE?.label || '符合条件的数据：',
      tableData: props.selectedE?.tableData || [],
      tableColumnShow: props.selectedE?.tableColumnShow || props.tableColumnShow || []
    },
    selectedIE: {
      label: props.selectedIE?.label || '不符合条件的数据：',
      tableData: props.selectedIE?.tableData || [],
      tableColumnShow: props.selectedIE?.tableColumnShow || props.tableColumnShow || []
    }
  }
})
// ^
</script>

<style lang="scss" scoped>
.c-selection {
  overflow: hidden;
  margin-bottom: 20px;

  &.only-selected {
    margin-bottom: 0;

    .selected {
      margin-top: 0;
    }
  }

  >.el-alert {
    margin-top: 10px;
  }

  .selected,
  .selectedE,
  .selectedIE {
    margin-top: 10px;

    >.el-tag {
      height: 30px;
      font-size: 14px;
      margin-bottom: 5px;
    }
  }


  .el-table {
    width: calc(100%);
    margin: 0;
  }

}
</style>