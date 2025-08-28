<template>
  <el-drawer v-model="isShowSet" :withHeader="false" direction="rtl" size="320px">
    <div class="settingStore-part">
      <div class="settingStore-item">
        <span class="settingStore-label">主题风格</span>
        <el-radio-group v-model="settingStore.themeStyle" @change="handleThemeStyle">
          <el-radio value="light">浅色</el-radio>
          <el-radio value="dark">深色</el-radio>
        </el-radio-group>
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">主题颜色</span>
        <el-color-picker v-model="settingStore.themeColor" :predefine="predefineColors" @change="handleThemeColor" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">布局大小</span>
        <el-radio-group v-model="settingStore.themeSize" @change="handleThemeSize">
          <el-radio value="large">较大</el-radio>
          <el-radio value="normal">普通</el-radio>
          <el-radio value="small">较小</el-radio>
        </el-radio-group>
      </div>

      <div class="settingStore-item">
        <span class="settingStore-label">开启左侧边栏</span>
        <el-switch v-model="settingStore.leftSide.isShow" @change="handleLeftSide" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">开启左侧折叠</span>
        <el-switch v-model="settingStore.leftSide.isCollapse" @change="handleLeftSide" />
      </div>

      <!-- <div class="settingStore-item">
        <span class="settingStore-label">开启顶部页头</span>
        <el-switch v-model="settingStore.topHeader.isShow" />
      </div> -->
      <div class="settingStore-item">
        <span class="settingStore-label">开启顶部导航</span>
        <el-switch v-model="settingStore.topNav.isShow" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">开启顶部标签</span>
        <el-switch v-model="settingStore.topTag.isShow" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">开启标签面包</span>
        <el-switch v-model="settingStore.topHeader.isBreadcrumbShow" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">开启动态标题</span>
        <el-switch v-model="settingStore.isDynamicTitle" />
      </div>

      <!-- <div class="settingStore-item">
        <span class="settingStore-label">开启水印</span>
        <el-switch v-model="settingStore.isWaterMark" @change="handleWaterMark" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">开启全屏</span>
        <el-switch v-model="settingStore.isFullScreen" @change="handleFullScreen(settingStore)" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">固定头部</span>
        <el-switch v-model="settingStore.isFixHeader" @change="handleFixHeader(settingStore)" />
      </div>
      <div class="settingStore-item">
        <span class="settingStore-label">设置缩放</span>
        <el-slider v-model="settingStore.scale" @change="handleScale" />
      </div> -->
    </div>
    <div class="settingStore-footer">
      <el-button type="primary" @click="handleSaveSetting">保存配置</el-button>
      <c-button @click="handleResetSetting">重置配置</c-button>
    </div>
  </el-drawer>
</template>

<script setup>
// # 一、综合
// 工具
import { handleFixHeader, handleFullScreen } from '@/utils/setting'
// pinia
import useStore from '@/store'
// 声明
const { proxy } = getCurrentInstance()
const { settingStore } = useStore()
const predefineColors = ref(['#F00', '#FF6100', '#FF0', '#0F0', '#0FF', '#00F', '#F0F', '#FF1493', '#55c791',])
// ^

// # 二、模块功能
// # 1、布局设置显示
const isShowSet = ref(false)
function openSetting() {
  isShowSet.value = true
}
// ^
// # 2、修改主题风格
function handleThemeStyle() {
  settingStore.setThemeStyle()
  settingStore.setTheme()
}
// ^
// # 3、修改主题颜色
function handleThemeColor() {
  settingStore.setThemeColor()
  settingStore.setTheme()
}
// ^
// # 4、修改主题大小
function handleThemeSize() {
  settingStore.setThemeSize()
  settingStore.setTheme()
}
// ^
// # 5、左侧边栏
function handleLeftSide() {
  settingStore.setLeftSide()
}
// ^
// # 6、保存配置
function handleSaveSetting() {
  proxy.$modal.loading("正在保存到本地，请稍候...");
  localStorage.setItem("layout-settingStore", JSON.stringify(settingStore))
  setTimeout("window.location.reload()", 1000)
  setTimeout(proxy.$modal.closeLoading(), 1000)
}
// ^
// # 7、重置配置
function handleResetSetting() {
  proxy.$modal.loading("正在清除设置缓存并刷新，请稍候...")
  localStorage.removeItem("layout-settingStore")
  setTimeout("window.location.reload()", 1000)
}
// ^
// ^

// # 三、机制
defineExpose({ openSetting, })
// ^
</script>

<style lang="scss" scoped>
.el-drawer {

  // padding: 0 10px;
  .el-drawer__body {
    padding: 20px;
    // background-color: var(--bg-primary);

    & *:not(.el-button):not(.el-button *) {
      color: var(--fcs);
    }
  }

  .settingStore-part {
    margin-bottom: 10px;

    .settingStore-item {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .settingStore-label {
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

  .settingStore-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>