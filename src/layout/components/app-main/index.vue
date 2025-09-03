<template>
  <section class="app-main-vue">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
  <!-- <router-view :key="key" /> -->
</template>

<script setup>
import CIframeToggle from "@/components/custom-iframe-toggle/index"
import useTagStore from '@/store/tag'
const tagStore = useTagStore()

</script>
