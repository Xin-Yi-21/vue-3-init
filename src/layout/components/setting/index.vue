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
        <el-switch v-model="setting.isTopNav" @change="handleTopNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启左侧导航</span>
        <el-switch v-model="setting.isLeftNav" @change="handleLeftNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启面包屑</span>
        <el-switch v-model="setting.isTopBar" @change="handleTopBar" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启标签</span>
        <el-switch v-model="setting.isTopTag" @change="handleTopTag" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启水印</span>
        <el-switch v-model="setting.isWaterMark" @change="handleWaterMark" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启全屏</span>
        <el-switch v-model="setting.isFullScreen" @change="handleFullScreen" />
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

const { proxy } = getCurrentInstance()
const setting = useSettingStore()
// const setting = computed(() => settingStore)
const predefineColors = ref(["#409EFF", "#ff4500", "#ff8c00", "#ffd700", "#90ee90", "#00ced1", "#1e90ff", "#c71585"])
// 显示
const isShowSet = ref(false)
function openSetting() {
  isShowSet.value = true
}
defineExpose({
  openSetting,
})
// 修改主题风格
function handleThemeStyle() {

}
// 修改主题颜色
function handleThemeColor(val) {
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
    "themeStyle": setting.themeStyle,
    "themeColor": setting.themeColor,
    "themeLightColor": setting.themeLightColor,
    "isLeftNav": setting.isLeftNav,
    "isTopNav": setting.isTopNav,
    "isTopBar": setting.isTopBar,
    "isTopTag": setting.isTopTag,
  }
  localStorage.setItem("layout-setting", JSON.stringify(layoutSetting));
  setTimeout(proxy.$modal.closeLoading(), 1000)
}
// 重置配置
function handleResetSetting() {
  proxy.$modal.loading("正在清除设置缓存并刷新，请稍候...");
  localStorage.removeItem("layout-setting")
  setTimeout("window.location.reload()", 1000)
}

</script>

<style lang="scss" scoped>
.el-overlay {
  background-color: pink;
}
</style>