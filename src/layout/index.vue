<template>
  <div :class="['layout-vue', setting.isFixHeader ? 'is-fixed' : '']" v-if="isDataInitDone">
    <top-header @setLayout="setLayout"></top-header>
    <div class="main-container">
      <left-nav v-if="setting.isLeftNav"></left-nav>
      <div class="main-right-container">
        <div class="top-container">
          <top-nav v-if="setting.isTopNav"></top-nav>
          <top-bar v-if="setting.isTopBar"></top-bar>
          <top-tag v-if="setting.isTopTag"></top-tag>
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
import useEnumsStore from '@/store/project/enums'
import { handleAllSetting } from '@/utils/setting'
import { handleColor } from '@/utils/theme'
import useSettingStore from '@/store/system/setting'

const setting = useSettingStore()
const isDataInitDone = ref(true)
// useEnumsStore().getEnums().then(res => {
//   isDataInitDone.value = true
//   // console.log('全部枚举', useEnumsStore().allEnums)
// })

handleColor(setting.themeColor)
// 打开布局抽屉
const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
onMounted(() => {
  nextTick(() => { handleAllSetting(setting) })
})
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
