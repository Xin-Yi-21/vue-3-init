<template>
  <div class="layout-vue">
    <template v-if="isDataInitDone">
      <top-header @setLayout="setLayout" v-if="settingStore.topHeader.isShow"></top-header>
      <div class="main-container">
        <left-nav v-if="settingStore.leftNav.isShow"></left-nav>
        <div class="main-right-container">
          <div class="top-container">
            <!-- <top-nav v-if="settingStore.topNav.isShow"></top-nav> -->
            <top-bar v-if="settingStore.topBar.isShow"></top-bar>
            <!-- <top-tag v-if="settingStore.topTag.isShow"></top-tag> -->
          </div>
          <app-main />
        </div>
        <setting ref="settingRef"></setting>
      </div>
    </template>
  </div>
</template>

<script setup>
// # 一、综合初始化
import TopHeader from '@/layout/components/top/top-header/index.vue'
import TopBar from '@/layout/components/top/top-bar/index.vue'
import TopTag from '@/layout/components/top/top-tag/index.vue'
import TopNav from '@/layout/components/top/top-nav/index.vue'
import LeftNav from '@/layout/components/left-nav/index.vue'
import AppMain from '@/layout/components/app-main/index.vue'
import Setting from '@/layout/components/setting/index.vue'
import useEnumsStore from '@/store/enums'
import useSettingStore from '@/store/setting'
const settingStore = useSettingStore()
// ^

// # 二、模块功能
// # 1、获取枚举
const isDataInitDone = ref(false)
async function getEnums() {
  try { await useEnumsStore().getEnums() } catch { }
}
// ^
// # 2、打开布局抽屉
const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
// ctrl+shift+l 按下，打开布局
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'L') {
    event.preventDefault()
    setLayout()
  }
}
watch(() => settingStore.topHeader.isShow, (nv) => {
  if (!nv) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
}, { immediate: true })
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
// ^
// # 3、初始布局设置
async function setSetting() {
  await settingStore.setThemeStyle()
  await settingStore.setThemeColor()
  await settingStore.setThemeSize()
  await settingStore.setTopHeader()
  await settingStore.setLeftNav()
  await settingStore.setTheme()
}
// ^
// ^

// # 三、生命周期
onMounted(() => { init() })
async function init() {
  await getEnums()
  await setSetting()
  await nextTick(() => {
    isDataInitDone.value = true
  })
  // console.log('查zou2',)
  // isDataInitDone.value = true
}
// ^

</script>

<style lang="scss" scoped>
.layout-vue {
  width: 100%;
  height: 100%;
  background-color: var(--bg-layout);
  overflow: hidden;

  &:not(:has(> .top-header-vue)) {
    .main-container {
      height: 100%;
    }
  }

  .top-header-vue {
    height: var(--top-header-height);
  }

  .main-container {
    display: flex;
    height: calc(100% - var(--top-header-height));

    .left-nav-vue {
      width: var(--left-nav-width);
      flex-shrink: 0;
    }

    .main-right-container {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: calc(100% - var(--left-nav-width));
      height: 100%;
      overflow: hidden;

      .app-main-vue {
        width: 100%;
        flex: 1;
        flex-shrink: 0;
        overflow: auto auto;

        &>* {
          // border-top: 1px solid transparent;
          height: 100%;
          overflow: hidden;
        }

        // 滚动条大小
        &::-webkit-scrollbar {
          display: block !important;
          width: 5px !important;
          height: 5px !important;
        }

        // 滚动条轨道
        &::-webkit-scrollbar-track {
          border-radius: 10px;
          background-color: #efefef;
        }

        // 滚动条滑块
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: var(--tc);
        }

        // 滚动条右下角
        &::-webkit-scrollbar-corner {
          background: transparent;
        }
      }
    }
  }

  .layout-setting-icon {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999999;
  }
}
</style>
