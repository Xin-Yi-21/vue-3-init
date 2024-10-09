<template>
  <div class="layout-vue" v-if="isDataInitDone">
    <!-- <Header></Header>
    <Warn></Warn>
    <AppMain /> -->
    <top-nav></top-nav>
    <div class="main-container">
      <left-nav></left-nav>
      <div class="main-right-container">
        <tags-view></tags-view>
        <app-main />
      </div>
    </div>
  </div>
</template>
<script setup>
  // import Header from './components/header/index.vue'
  // import Warn from './components/warn/index.vue'
  import TopNav from '@/layout/components/top-nav/index.vue'
  import LeftNav from '@/layout/components/left-nav/index.vue'
  import TagsView from '@/layout/components/tags-view/index.vue'
  import AppMain from '@/layout/components/app-main/index.vue'
  import useEnumsStore from '@/store/project/enums'

  const isDataInitDone = ref(true)
  useEnumsStore().getEnums().then(res => {
    isDataInitDone.value = true
    // console.log('全部枚举', useEnumsStore().allEnums)
  })
</script>

<style lang="scss" scoped>
.layout-vue {
  width: 100%;
  height: 100%;

  .top-nav-vue {
    height: 50px;
    background-color: skyblue;
  }

  .main-container {
    display: flex;
    height: calc(100% - 50px);


    .main-right-container {
      flex: 1;
      flex-shrink: 0;
      height: 100%;

      .tags-view-vue {
        height: 50px;
        width: 100%;
        background-color: yellowgreen;
      }


      .app-main-vue {
        height: calc(100% - 50px);
        // background-color: red;
      }
    }
  }
}
</style>
