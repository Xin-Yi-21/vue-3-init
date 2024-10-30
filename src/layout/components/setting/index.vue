<template>
  <el-drawer v-model="isShowSet" :withHeader="false" direction="rtl" size="300px">
    <div class="setting-part">
      <div class="setting-item">
        <div class="set-title">主题风格</div>
        <el-radio-group v-model="setting.themeStyle" @change="handleThemeStyle">
          <el-radio label="dark">黑色</el-radio>
          <el-radio label="light">白色</el-radio>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <div class="set-title">主题颜色</div>
        <el-color-picker v-model="setting.themeColor" :predefine="predefineColors" @change="handleThemeColor" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部导航</span>
        <el-switch v-model="settingsStore.isTopNav" @change="handleTopNav" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启左侧导航</span>
        <el-switch v-model="settingsStore.isLeftNav" @change="handleLeftNav" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启面包屑</span>
        <el-switch v-model="settingsStore.isTopBar" @change="handleTopBar" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启标签</span>
        <el-switch v-model="settingsStore.isTopTag" @change="handleTopTag" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启水印</span>
        <el-switch v-model="settingsStore.isWaterMark" @change="handleWaterMark" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启全屏</span>
        <el-switch v-model="settingsStore.isFullScreen" @change="handleFullScreen" class="drawer-switch" />
      </div>
      <div class="setting-item">
        <span class="setting-label">布局大小</span>
        <el-radio-group v-model="setting.size" @change="handleSize">
          <el-radio label="big">较大</el-radio>
          <el-radio label="normal">普通</el-radio>
          <el-radio label="small">较小</el-radio>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span class="setting-label">设置缩放</span>
        <el-slider v-model="setting.scale" @change="handleScale" />
      </div>
    </div>
    <div class="setting-footer">
      <el-button @click="handleSaveSetting">保存配置</el-button>
      <el-button @click="handleResetSetting">重置配置</el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import useSettingStore from '@/store/system/setting'
import { handleColor } from '@/utils/theme'

const settingStore = useSettingStore()
const setting = computed(() => settingStore)
const predefineColors = ref(["#409EFF", "#ff4500", "#ff8c00", "#ffd700", "#90ee90", "#00ced1", "#1e90ff", "#c71585"]);
// 显示
const isShowSet = ref(false)
function openSetting() {
  console.log('查3',)
  isShowSet.value = true
}
defineExpose({
  openSetting,
})
// 修改主题风格
function handleThemeStyle() {
  let val = setting.themeStyle
  settingsStore.sideTheme = val
  sideTheme.value = val
}
// 修改主题颜色
function handleThemeColor(val) {
  settingsStore.theme = val
  handleColor(val)
}
// 顶部导航
function handleTopNav() {

}
// 左侧导航
function handleLeftNav() {

}
// 面包屑
function handleTopBar() {

}
// 标签
function handleTopTag() {

}
// 水印
function handleWaterMark() {

}
// 全屏 
function handleFullScreen() {

}
// 大小
function handleSize() {

}
// 缩放
function handleScale() {

}
// 保存配置
function handleSaveSetting() {
  proxy.$modal.loading("正在保存到本地，请稍候...");
  let layoutSetting = {
    "topNav": storeSettings.value.topNav,
    "tagsView": storeSettings.value.tagsView,
    "fixedHeader": storeSettings.value.fixedHeader,
    "sidebarLogo": storeSettings.value.sidebarLogo,
    "dynamicTitle": storeSettings.value.dynamicTitle,
    "sideTheme": storeSettings.value.sideTheme,
    "theme": storeSettings.value.theme
  };
  localStorage.setItem("layout-setting", JSON.stringify(layoutSetting));
  setTimeout(proxy.$modal.closeLoading(), 1000)
}
// 重置配置
function handleResetSetting() {

}

</script>

<style lang="scss" scoped>
.el-overlay {
  background-color: pink;
}
</style>