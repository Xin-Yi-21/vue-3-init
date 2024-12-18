<template>
  <div class="layout-vue">
    <top-header @setLayout="setLayout" v-if="settingStore.topHeader.isShow"></top-header>
    <div class="main-container">
      <left-nav v-if="settingStore.leftNav.isShow"></left-nav>
      <div class="main-right-container">
        <div class="top-container">
          <top-nav v-if="settingStore.topNav.isShow"></top-nav>
          <top-bar v-if="settingStore.topBar.isShow"></top-bar>
          <top-tag v-if="settingStore.topTag.isShow"></top-tag>
        </div>
        <app-main />
      </div>
      <setting ref="settingRef"></setting>
    </div>
  </div>
</template>

<script setup>
import TopHeader from '@/layout/components/top/top-header/index.vue'
import TopBar from '@/layout/components/top/top-bar/index.vue'
import TopTag from '@/layout/components/top/top-tag/index.vue'
import TopNav from '@/layout/components/top/top-nav/index.vue'
import LeftNav from '@/layout/components/left-nav/index.vue'
import AppMain from '@/layout/components/app-main/index.vue'
import Setting from '@/layout/components/setting/index.vue'

import { handleColor } from '@/utils/theme'
import useEnumsStore from '@/store/project/enums'
import useSettingStore from '@/store/system/setting'

// 一、综合初始化
const settingStore = useSettingStore()
onMounted(() => { init() })
function init() {
  getEnums()
}
// 二、模块功能
// 1、获取枚举
const isDataInitDone = ref(true)
async function getEnums() {
  try { await useEnumsStore().getEnums() } catch { }
  isDataInitDone.value = true
}

// 2、处理颜色
handleColor(settingStore.themeColor)

// 3、打开布局抽屉
const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
</script>

<style lang="scss" scoped>
.layout-vue {
  width: 100%;
  height: 100%;

  .main-container {
    display: flex;
    height: calc(100% - 60px);

    .main-right-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      flex-shrink: 0;
      height: 100%;

      .app-main-vue {
        flex: 1;
        flex-shrink: 0;
      }
    }
  }
}

.layout-vue.is-fixed {
  .top-header-vue {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  .main-container {
    .left-nav-vue {
      position: fixed;
      width: 200px;
      height: calc(100% - 60px);
      top: 60px;
      z-index: 99;
    }

    .main-right-container {
      padding-left: 200px;
      width: calc(100% - 200px);

      .top-container {
        position: fixed;
        top: 60px;
        left: 200px;
        width: calc(100% - 200px);
        z-index: 98;
      }

      .app-main-vue {
        width: 100%;
      }
    }
  }

  .main-container:has(.left-nav-vue.is-collapse) {
    .left-nav-vue {
      width: 50px;
    }

    .main-right-container {
      padding-left: 50px;
      width: calc(100% - 50px);

      .top-container {
        position: fixed;
        top: 60px;
        left: 50px;
        width: calc(100% - 50px);
        z-index: 98;
      }

      .app-main-vue {
        width: 100%;
      }
    }
  }
}
</style>
