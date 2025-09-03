<template>
  <c-inner-link v-for="(item, index) in tagStore.iframeViews" :key="item.path" :iframeId="'iframe' + index" v-show="route.path === item.path" :src="handleIframeUrl(item.meta.link, item.query)">
  </c-inner-link>
</template>

<script setup>
// # 一、综合
// 组件
import CInnerLink from "@/components/custom-inner-link/index"
// store
import useStore from '@/store'
// 声明
const { tagStore } = useStore()
const route = useRoute()
// ^

// # 二、模块功能
// # 1、处理iframe url
function handleIframeUrl(url, query) {
  if (Object.keys(query).length > 0) {
    let params = Object.keys(query).map((key) => key + "=" + query[key]).join("&")
    return url + "?" + params
  }
  return url
}
// ^
// ^
</script>
