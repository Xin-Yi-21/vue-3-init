<template>
  <div class="layout-container">
    <template v-if="isLayoutShow">
      <top-header @setLayout="setLayout" v-if="settingStore.topHeader.isShow"></top-header>
      <div class="main-container">
        <left-side v-if="settingStore.leftSide.isShow"></left-side>
        <div class="main-right-container">
          <!-- <top-tag v-if="settingStore.topTag.isShow"></top-tag> -->
          <app-main />
        </div>
        <setting ref="settingRef"></setting>
      </div>
    </template>
  </div>
</template>

<script setup>
// # 一、综合
// 组件
import TopHeader from '@/layout/components/top/top-header/index.vue'
import LeftSide from '@/layout/components/left/left-side/index.vue'
import TopTag from '@/layout/components/top/top-tag/index.vue'
import AppMain from '@/layout/components/app-main/index.vue'
import Setting from '@/layout/components/setting/index.vue'
// pinia
import useStore from '@/store'
// 声明
const { settingStore, enumsStore } = useStore()
// ^

// # 二、模块功能
// # 1、初始化
const isLayoutShow = ref(false)
async function init() {
  await getEnums()
  nextTick(() => {
    isLayoutShow.value = true
  })
}
// # (1) 获取枚举
const isDataInitDone = ref(false)
async function getEnums() {
  try { await enumsStore.getEnums() } catch { }
}
// ^
// ^
// # 2、布局抽屉
// # (1) 打开
const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
// ^
// # (2) ctrl+shift+l 按下，打开布局
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'L') {
    event.preventDefault()
    setLayout()
  }
}
// ^
// ^

// # 三、机制
watch(() => settingStore.topHeader.isShow, (nv) => {
  if (!nv) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
}, { immediate: true })
onMounted(() => { init() })
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// ^

</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  background-color: var(--bg-layout);
  overflow: hidden;

  .top-header-container {
    height: 70px;
  }

  .main-container {
    display: flex;
    height: calc(100% - 70px);

    .left-side-container {
      width: var(--left-side-width);
      flex-shrink: 0;
    }

    .main-right-container {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: calc(100% - var(--left-side-width));
      height: 100%;
      overflow: hidden;

      // margin-top: 5px;
      .top-container {
        margin-top: 10px;
      }

      .app-main-vue {
        width: 100%;
        flex: 1;
        flex-shrink: 0;
        overflow: auto auto;
        margin-top: 10px;
        // margin-top: 5px;

        &>* {
          // border-top: 1px solid transparent;
          width: calc(100% - 20px);
          height: calc(100% - 10px);
          margin: 0 10px;
          border-radius: 0 0 4px 4px;
          background-color: var(--bg-card);
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
}
</style>
