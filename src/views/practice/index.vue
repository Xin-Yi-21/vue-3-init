<template>
  <div>
    <a-button type="primary" @click="handleOpen">打开模态框</a-button>
    <Operate></Operate>
  </div>
</template>

<script setup>
import Operate from './dialog.vue'
const operateDialog = ref({ visible: false })
function handleOpen() {

}
</script>

<style scoped lang="scss"></style>