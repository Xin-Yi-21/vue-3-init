<template>
  <section class="app-main-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagStore.cachedViews">
          <component v-if="route.meta?.componentType !== 'OuterLink'" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <outer-link />
  </section>
</template>

<script setup>
// # 一、综合
// 组件
import OuterLink from "@/components/custom-outer-link/index"
// store
import useStore from '@/store'
import { useRoute } from "vue-router"
// 声明
const { tagStore } = useStore()
const route = useRoute()
// ^
</script>
<style lang="scss" scoped></style>
