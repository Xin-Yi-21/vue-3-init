<template>
  <div>{{ $dayjs().format('YYYY-MM-DD HH:mm:ss') }}</div>
</template>

<script setup>


const router = useRouter()               // 使用全局路由需配置
const route = useRoute()                 // 使用当前路由需配置

// const emit = defineEmits(['getData',])   // 使用emit需配置
// const props = defineProps({              // 使用props需配置
//   info: { type: Object, default: () => { } }
// })
// defineExpose({ x, y })  // 指定可供父组件访问的属性和方法。省略则访问全部。



// // 方式1：proxy 代理对象
// const { proxy } = getCurrentInstance()
// let time1 = proxy.$dayjs().format('YYYY-MM-DD HH:mm:ss')
// console.log('查time1', time1)
// // 方式2：appContext 全局对象
// const instance = getCurrentInstance()
// let time2 = instance.appContext.config.globalProperties.$dayjs().format('YYYY-MM-DD HH:mm:ss')
// console.log('查time2', time2)
</script>

<style scoped lang="scss"></style>
