<template>
  <section class="app-main-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagStore.cachedViews">
          <component v-if="!route.meta?.linkVirtual" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
      <c-iframe-toggle></c-iframe-toggle>
    </router-view>
  </section>
</template>

<script setup>
// # 一、综合
// 组件
import cIframeToggle from "@/components/custom-iframe-toggle/index"
// store
import useStore from '@/store'
import { useRoute } from "vue-router"
// 声明
const { tagStore } = useStore()
const route = useRoute()
// ^
</script>
<style lang="scss" scoped></style>
