<template>
  <el-drawer v-model="isShowSet" :withHeader="false" direction="rtl" size="320px">
    <div class="setting-part">
      <div class="setting-item">
        <span class="setting-label">主题风格</span>
        <el-radio-group v-model="setting.themeStyle" @change="handleThemeStyle">
          <el-radio value="light">浅色</el-radio>
          <el-radio value="dark">深色</el-radio>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span class="setting-label">主题颜色</span>
        <el-color-picker v-model="setting.themeColor" :predefine="predefineColors" @change="handleThemeColor" />
      </div>
      <div class="setting-item">
        <span class="setting-label">布局大小</span>
        <el-radio-group v-model="setting.themeSize" @change="handleThemeSize">
          <el-radio value="large">较大</el-radio>
          <el-radio value="normal">普通</el-radio>
          <el-radio value="small">较小</el-radio>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span class="setting-label">开启左侧导航</span>
        <el-switch v-model="setting.leftNav.isShow" @change="handleLeftNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启左侧折叠</span>
        <el-switch v-model="setting.leftNav.isCollapse" @change="handleLeftNav" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部页头</span>
        <el-switch v-model="setting.topHeader.isShow" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部导航</span>
        <el-switch v-model="setting.topNav.isShow" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部工具</span>
        <el-switch v-model="setting.topBar.isShow" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启顶部标签</span>
        <el-switch v-model="setting.topTag.isShow" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启页头面包</span>
        <el-switch v-model="setting.topHeader.isBreadcrumbShow" />
      </div>
      <div class="setting-item">
        <span class="setting-label">开启动态标题</span>
        <el-switch v-model="setting.isDynamicTitle" />
      </div>
      <!-- <div class="setting-item">
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
        <span class="setting-label">设置缩放</span>
        <el-slider v-model="setting.scale" @change="handleScale" />
      </div> -->
    </div>
    <div class="setting-footer">
      <el-button type="primary" @click="handleSaveSetting">保存配置</el-button>
      <c-button @click="handleResetSetting">重置配置</c-button>
    </div>
  </el-drawer>
</template>

<script setup>
// 一、综合初始化
import useSettingStore from '@/store/system/setting'
import { handleFixHeader, handleFullScreen } from '@/utils/setting'

const { proxy } = getCurrentInstance()
const setting = useSettingStore()
const predefineColors = ref(['#F00', '#FF6100', '#FF0', '#0F0', '#0FF', '#00F', '#F0F', '#FF1493', '#55c791',])
// 二、模块功能
// 1、布局设置显示
const isShowSet = ref(false)
function openSetting() {
  isShowSet.value = true
}
defineExpose({ openSetting, })
// 2、修改主题风格
function handleThemeStyle() {
  setting.setThemeStyle()
  setting.setTheme()
}
// 3、修改主题颜色
function handleThemeColor() {
  setting.setThemeColor()
  setting.setTheme()
}
// 4、修改主题大小
function handleThemeSize() {
  setting.setThemeSize()
  setting.setTheme()
}
// 5、左侧导航
function handleLeftNav() {
  setting.setLeftNav()
}
// 6、保存配置
function handleSaveSetting() {
  proxy.$modal.loading("正在保存到本地，请稍候...");
  // let layoutSetting = {
  //   'themeStyle': setting.themeStyle,
  //   'themeColor': setting.themeColor,
  //   'themeSize': setting.themeSize,
  //   'leftNav': {
  //     'isShow': setting.leftNav.isShow,
  //     'isCollapse': setting.leftNav.isCollapse
  //   },
  //   'topHeader': {
  //     'isShow': setting.topHeader.isShow,
  //     'isBreadcrumbShow': setting.topHeader.isBreadcrumbShow
  //   },
  //   'topNav': {
  //     'isShow': setting.topNav.isShow,
  //     'isBreadcrumbShow': setting.topNav.isBreadcrumbShow
  //   },
  //   'topBar': {
  //     'isShow': setting.topBar.isShow,
  //   },
  //   'topTag': {
  //     'isShow': setting.topTag.isShow,
  //   },
  //   'isDynamicTitle': setting.isDynamicTitle,
  // }
  localStorage.setItem("layout-setting", JSON.stringify(setting))
  setTimeout("window.location.reload()", 1000)
  setTimeout(proxy.$modal.closeLoading(), 1000)
}
// 5、重置配置
function handleResetSetting() {
  proxy.$modal.loading("正在清除设置缓存并刷新，请稍候...")
  localStorage.removeItem("layout-setting")
  setTimeout("window.location.reload()", 1000)
}
</script>

<style lang="scss" scoped>
.el-drawer {

  // padding: 0 10px;
  .el-drawer__body {
    padding: 20px;
    background-color: var(--bg-primary);

    & *:not(.el-button):not(.el-button *) {
      color: var(--fcpl);
    }
  }

  .setting-part {
    margin-bottom: 10px;

    .setting-item {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .setting-label {
        width: 100px;
        margin-right: 10px;
        font-size: var(--cfs);
      }

      .el-radio-group {
        display: inline-flex;
        justify-content: flex-end;
        flex-wrap: nowrap;
        flex: 1;

        .el-radio {
          display: inline-flex;
          align-items: center;
          margin-right: 10px;

          .el-radio__input {
            display: inline-flex;
            align-items: center;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .el-slider {
        flex: 1;
      }
    }
  }

  .setting-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>