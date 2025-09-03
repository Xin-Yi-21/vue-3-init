<template>
  <section class="app-main-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <div class="iframe-container" v-show="currentRoute.meta?.link"> <c-iframe-toggle /></div>
  </section>
</template>

<script setup>
// # 一、综合
// 组件
import CIframeToggle from "@/components/custom-iframe-toggle/index"
// store
import useStore from '@/store'
// 声明
const { tagStore } = useStore()
const currentRoute = useRoute()
// ^
</script>
<style lang="scss" scoped></style>
