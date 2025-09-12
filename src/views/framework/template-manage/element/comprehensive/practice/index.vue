<template>
  <div class="practice-vue">
    <c-preview :info="fileInfo"></c-preview>
  </div>
</template>

<script setup>
// # 一、综合
// ^

// # 二、模块功能
// # 1、初始化
const fileInfo = ref({
  fileName: '前端规范.pdf',
  fileType: 'pdf',
  fileUrl: '/A/framework-file/前端规范.pdf',
  previewType: '_self',
})
// ^
// ^

// # 三、机制
onMounted(() => {
  // init()
})
// ^
</script>

<style lang="scss" scoped>
.practice-vue {
  width: 100%;
  height: 100%;
}
</style>