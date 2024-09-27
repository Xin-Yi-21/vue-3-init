<template>
  <div class="layout-container" v-if="isDataInitDone">
    <Header></Header>
    <Warn></Warn>
    <AppMain />
  </div>
</template>
<script setup>
import Header from './components/header/index.vue'
import Warn from './components/warn/index.vue'
import AppMain from './components/app-main/index.vue'
import useEnumsStore from '@/store/project/enums'

const isDataInitDone = ref(false)
useEnumsStore().getEnums().then(res => {
  isDataInitDone.value = true
  // console.log('全部枚举', useEnumsStore().allEnums)
})
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
}
</style>
