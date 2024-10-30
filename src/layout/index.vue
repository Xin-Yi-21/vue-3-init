<template>
  <div class="layout-vue" v-if="isDataInitDone">
    <top-header @setLayout="setLayout"></top-header>
    <div class="main-container">
      <left-nav v-if="setting.isLeftNav"></left-nav>
      <div class="main-right-container">
        <top-nav v-if="setting.isTopNav"></top-nav>
        <top-bar v-if="setting.isTopBar"></top-bar>
        <top-tag v-if="setting.isTopTag"></top-tag>
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

import useSettingStore from '@/store/system/setting'
const setting = useSettingStore()
const isDataInitDone = ref(true)
// useEnumsStore().getEnums().then(res => {
//   isDataInitDone.value = true
//   // console.log('全部枚举', useEnumsStore().allEnums)
// })

// 打开布局抽屉
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
</style>
