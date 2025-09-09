<template>
  <c-button @click="handleExport">导出表格</c-button>
  <el-table id="a-table" ref="tableRef" :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="150" align="center" />
    <el-table-column label="Delivery Info">
      <el-table-column prop="name" label="Name" width="120" align="center" />
      <el-table-column label="Address Info">
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="zip" label="Zip" width="120" />
      </el-table-column>
    </el-table-column>
  </el-table>

  <!-- <el-table id="a-table" ref="tableRef" :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="150" align="center" />
    <el-table-column prop="name" label="Name" width="150" align="center" />
    <el-table-column prop="state" label="State" width="120" />
    <el-table-column prop="city" label="City" width="120" />
    <el-table-column prop="address" label="Address" class-name="selection" />
    <el-table-column prop="zip" label="Zip" width="120" />
  </el-table> -->
  <div ref="aRef"></div>
  <c-icon i="c-add" ref="cRef"></c-icon>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]
const { proxy } = getCurrentInstance()
const tableRef = ref(null)
const aRef = ref(null)
const cRef = ref(null)
async function handleExport() {
  await proxy.$exportDomToExcel(tableRef.value.$el, '表格1', {
    deleteCols: ['Name', 'City'],
    deleteRows: [0],
    align: 'center',
  })
  // proxy.$exportDomToImage(tableRef.value.$el, '图片1', { format: 'jpg' })
  proxy.$message.success('导出成功！')
}
</script>
