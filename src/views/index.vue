<template>
  <div class="index-home">
    首页
    <el-table :data="tableData">
      <el-table-column label="列名" prop="field" align="center" />
      <el-table-column label="状态" prop="field" align="center" />
      <!-- <el-table-column label="状态" prop="" align="center">
        <template slot-scope="scope"> {{ scope.row.field }} </template>
</el-table-column> -->
    </el-table>
  </div>
</template>

<script setup name="Index">
const tableData = ref([{ field: '你好' }, { field: '世界' }, { field: 1 }, { field: 1 }])
</script>

<style scoped lang="scss"></style>
