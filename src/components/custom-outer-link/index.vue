<template>
  <div class="iframe-container" v-show="route.meta?.componentType === 'OuterLink'">
    <c-card-tip v-if="route.meta?.linkOpenType === 'blank'">当前菜单已在新浏览器标签页打开，请前往查看！</c-card-tip>
    <iframe v-for="(item, index) in tagStore.iframeViews" v-show="route.path === item.path && route.meta?.linkOpenType !== 'blank'" :key="item.path" :id="`iframe${index}`" :src="handleIframeUrl(item.meta.link, item.query)" style="width: 100%; height: 100%" frameborder="no"></iframe>
  </div>
</template>

<script setup>
// # 一、综合
// store
import useStore from '@/store'
// props
const props = defineProps({
  src: { type: String, default: "/" },
  iframeId: { type: String },
})
// 声明
const { tagStore } = useStore()
const route = useRoute()
// ^

// # 二、模块功能
// # 1、处理iframe路径
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
