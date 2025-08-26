<template>
  <router-view />
</template>

<script setup>
// 一、综合
// 插件
import { scaleFit, scaleAdapt } from '@/plugins/screen-adaptation/scale'
import { setRem } from '@/plugins/screen-adaptation/rem'
// ^
// # 二、模块功能
// # 1、初始化
function init() {
  scaleFit()
  setRem()
}
// ^
// ^

// 三、生命周期
onMounted(() => {
  init()
})
// ^
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-ExtraLight.otf');
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-Light.otf');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-Regular.otf');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-Medium.otf');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-Bold.otf');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Source Han Sans CN';
  src: url('@/assets/fonts/SourceHanSans/SourceHanSansCN-Heavy.otf');
  font-weight: 800;
  font-style: normal;
}
</style>