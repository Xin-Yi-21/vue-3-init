<template>
  <el-breadcrumb :separator="separator">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
// 一、综合
// props
const props = defineProps({
  separator: { type: String, default: '/' }
})
// 声明
const route = useRoute()
const router = useRouter()

// 二、模块功能
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
  if (route.path.startsWith('/redirect/')) { return }
  getBreadcrumb()
})
// 三、生命周期
getBreadcrumb()
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  display: inline-flex;
  align-items: center;
  height: 100%;
  margin-left: 10px;
  font-size: 14px;

  a {
    color: var(--fcs);
  }

  .no-redirect {
    color: var(--fcs);
    cursor: text;
  }
}
</style>