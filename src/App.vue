<template>
  <router-view />
</template>

<script setup>
import { scaleFit, scaleAdapt } from '@/utils/screen-adaptation/scale'
import { setRem } from '@/utils/screen-adaptation/rem'
// 一、综合初始化
import useSettingStore from '@/store/framework/setting'
const settingStore = useSettingStore()
// 二、模块功能
async function setSetting() {
  await settingStore.setThemeStyle()
  await settingStore.setThemeColor()
  await settingStore.setThemeSize()
  await settingStore.setTopHeader()
  await settingStore.setLeftNav()
  await settingStore.setTheme()
}
// 三、生命周期
onMounted(() => {
  scaleFit()
  setRem()
  setSetting()
  // scaleAdapt(document.getElementById('app'))
})


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