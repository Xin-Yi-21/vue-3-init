<template>
  <iframe :id="iframeId" style="width: 100%; height: 100%" :src="src" frameborder="no"></iframe>
</template>

<script setup>
const props = defineProps({
  src: { type: String, default: "/" },
  iframeId: { type: String },
})
</script>
