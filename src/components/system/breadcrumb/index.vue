<template>
  <el-breadcrumb :separator="separator">
    <!-- <transition-group name="breadcrumb"> -->
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
      <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
      <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
    </el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>

<script setup>
const props = defineProps({
  separator: { type: String, default: '/' }
})
const route = useRoute()
const router = useRouter()
const levelList = ref([])

function getBreadcrumb() {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  // 判断是否为首页
  if (!isHome(matched[0])) {
    matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
  }
  // 设置面包屑
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

function isHome(route) {
  const name = route && route.name
  return !name ? false : name.trim() === 'Index'
}

function handleLink(item) {
  const { redirect, path } = item
  redirect ? router.push(redirect) : router.push(path)
}

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) { return }
  getBreadcrumb()
})

getBreadcrumb()
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  height: 100%;
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
  font-size: 14px;

  .no-redirect {
    color: #666;
    cursor: text;
  }
}
</style>