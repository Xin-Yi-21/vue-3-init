<template>
  <inner-link
    v-for="(item, index) in tagsViewStore.iframeViews"
    :key="item.path"
    :iframeId="'iframe' + index"
    v-show="route.path === item.path"
    :src="iframeUrl(item.meta.link, item.query)"></inner-link>
</template>

<script setup>
import InnerLink from "../inner-link/index";
import useTagStore from "@/store/system/tag";

const route = useRoute();
const tagsViewStore = useTagStore();

function iframeUrl(url, query) {
  if (Object.keys(query).length > 0) {
    let params = Object.keys(query).map((key) => key + "=" + query[key]).join("&");
    return url + "?" + params;
  }
  return url;
}
</script>
