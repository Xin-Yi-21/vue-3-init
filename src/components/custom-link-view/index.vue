<template>
  <div class="iframe-container">
    <c-card-tip v-if="route.meta?.linkBlank">当前菜单已在新浏览器标签页打开，请前往查看！</c-card-tip>
    <iframe v-else :id="1" style="width: 100%; height: 100%" :src="handleIframeUrl()" frameborder="no"></iframe>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  meta: { type: String, default: "/" },
  iframeId: { type: String },
})
// 声明
const route = useRoute()
// ^

// # 二、模块功能
// # 1、处理iframe路径
function handleIframeUrl() {
  let url = route.meta.link
  let query = route.query
  if (Object.keys(query).length > 0) {
    let params = Object.keys(query).map((key) => key + "=" + query[key]).join("&")
    return url + "?" + params
  }
  return url
}
// ^

</script>
