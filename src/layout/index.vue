<template>
  <div class="layout-vue" v-if="isDataInitDone">

    <top-header></top-header>
    <div class="main-container">
      <left-nav></left-nav>
      <div class="main-right-container">
        <top-nav></top-nav>
        <tags-view></tags-view>
        <app-main />
      </div>
    </div>
  </div>
</template>
<script setup>
  import TopHeader from '@/layout/components/top-header/index.vue'
  import TopNav from '@/layout/components/top-nav/index.vue'
  import LeftNav from '@/layout/components/left-nav/index.vue'
  import TagsView from '@/layout/components/tags-view/index.vue'
  import AppMain from '@/layout/components/app-main/index.vue'
  import useEnumsStore from '@/store/project/enums'

  const isDataInitDone = ref(true)
  // useEnumsStore().getEnums().then(res => {
  //   isDataInitDone.value = true
  //   // console.log('全部枚举', useEnumsStore().allEnums)
  // })
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
