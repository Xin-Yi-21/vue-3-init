<template>
  <div class="practice-vue">
    <!-- <c-table :data="table.data">
      <el-table-column label="字段1" prop="" align="center" />
      <el-table-column label="字段2" prop="" align="center" />
      <el-table-column label="字段3" prop="" align="center" />
      <el-table-column label="字段4" prop="" align="center" />
      <el-table-column label="字段5" prop="" align="center" />
    </c-table> -->
  </div>
</template>

<script setup>
// # 一、综合
// import cTable from '@/components/custom-table'
// ^

// # 二、模块功能
// # 1、初始化
const table = ref({
  data: [{}, {}, {}]
})
function init() {

}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
// ^
</script>

<style lang="scss" scoped>
.practice-vue {
  width: 100%;
  height: 100%;
}
</style>