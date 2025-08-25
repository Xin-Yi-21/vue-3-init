<template>
  <div class="xxx-vue">

  </div>
</template>

<script setup>
import { json } from 'express';

// # 一、综合
// # (2) 设置默认
const form = ref({})
function setDefault() {
  let newForm = {}
  Object.assign(form.value, newForm)
}
// ^
// ^


// # 二、模块功能
// # 1、初始化
// # (1) 初始化总调用
function init() {

}
// ^
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
// ^
</script>

<style lang="scss" scoped>
.xxx-vue {
  width: 100%;
  height: 100%;
}
</style>