<template>
  <el-breadcrumb class="c-breadcrumb" :separator="separator">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span>{{ item.meta.title }}</span>
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
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
// 三、生命周期
getBreadcrumb()
</script>

<style lang='scss' scoped>
.c-breadcrumb {
  display: inline-flex;
  align-items: center;
  height: 100%;
  font-size: 14px;

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      >span {
        color: var(--fct);
        font-size: 12px;
        cursor: text;
      }
    }

    .el-breadcrumb__separator {
      color: var(--fct);
      font-weight: 400;
      margin: 0 5px;
    }
  }


}
</style>