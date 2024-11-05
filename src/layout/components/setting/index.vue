<template>
  <el-drawer v-model="isShowSet" :withHeader="false" direction="rtl" size="320px">
    <div class="setting-part">
      <div class="setting-item">
        <span class="setting-label">主题风格</span>
        <el-radio-group v-model="setting.themeStyle" @change="handleThemeStyle">
          <el-radio value="dark">黑色</el-radio>
          <el-radio value="light">白色</el-radio>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span class="setting-label">主题颜色</span>
        <el-color-picker v-model="setting.themeColor" :predefine="predefineColors" @change="handleThemeColor" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部导航</span>
        <el-switch v-model="setting.isTopNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启左侧导航</span>
        <el-switch v-model="setting.isLeftNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启面包栏</span>
        <el-switch v-model="setting.isTopBar" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启导航面包栏</span>
        <el-switch v-model="setting.isBreadcrumb" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启标签</span>
        <el-switch v-model="setting.isTopTag" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启动态标题</span>
        <el-switch v-model="setting.isDynamicTitle" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启水印</span>
        <el-switch v-model="setting.isWaterMark" @change="handleWaterMark" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启全屏</span>
        <el-switch v-model="setting.isFullScreen" @change="handleFullScreen(setting)" />
      </div>
      <div class="setting-item">
        <span class="setting-label">固定头部</span>
        <el-switch v-model="setting.isFixHeader" @change="handleFixHeader(setting)" />
      </div>
      <div class="setting-item">
        <span class="setting-label">布局大小</span>
        <el-radio-group v-model="setting.elSize">
          <el-radio value="large">较大</el-radio>
          <el-radio value="default">普通</el-radio>
          <el-radio value="small">较小</el-radio>
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
import { handleFixHeader, handleFullScreen } from '@/utils/setting'

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

// 水印
function handleWaterMark() {

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
    "elSize": setting.elSize,
    "isTopNav": setting.isTopNav,
    "isLeftNav": setting.isLeftNav,
    "isTopBar": setting.isTopBar,
    "isTopTag": setting.isTopTag,
    "isBreadcrumb": setting.isBreadcrumb,
    "isDynamicTitle": setting.isDynamicTitle,
    "isFixHeader": setting.isFixHeader,
    "isFullScreen": setting.isFullScreen,
  }
  localStorage.setItem("layout-setting", JSON.stringify(layoutSetting))
  setTimeout("window.location.reload()", 1000)
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
  .setting-part {
    .setting-item {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .setting-label {
        width: 100px;
        margin-right: 10px;
      }

      .el-radio-group {
        flex-wrap: nowrap;

        .el-radio {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>