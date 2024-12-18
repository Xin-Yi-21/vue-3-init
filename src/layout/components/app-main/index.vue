<template>
  <section class="app-main-vue">
    <!-- <router-view v-slot="{ Component, route }"> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="tagStore.cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <!-- </router-view> -->
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "@/components/system/iframe-toggle/index"
import useTagStore from '@/store/system/tag'
const tagStore = useTagStore()

</script>
