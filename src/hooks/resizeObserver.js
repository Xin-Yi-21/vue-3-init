// Vue3封装一个useResizeObserver(target, callback) hook函数，使用js
// 参数1：target，目标元素，既可以是dom，也可以是ref
// 参数2：callback，目标元素大小发生变化后执行相应逻辑

// 需求1：当目标元素大小发生变化时，执行callback回调逻辑
// 需求2：onMounted自动注册，onUnmounted自动解绑。但也可支持手动绑定和解绑。
// 需求3：当target传入为'window',执行window的resize相关系列

import { ref, onUnmounted, unref, watch, onMounted } from 'vue'

export function useResizeObserver(target, callback, autoBind = true) {
  const observer = ref(null)
  let isObserving = false
  const cleanup = () => {
    const el = unref(target)
    if (target === 'window' || el === window) {
      window.removeEventListener('resize', callback)
    } else if (observer.value && isObserving) {
      observer.value.disconnect()
      isObserving = false
    }
  }

  const bind = () => {
    cleanup()
    const el = unref(target)
    if (target === 'window' || el === window) {
      window.addEventListener('resize', callback)
    } else if (el) {
      observer.value = new ResizeObserver(() => callback())
      observer.value.observe(el)
      isObserving = true
    }
  }

  const unbind = cleanup
  bind()

  // // 如果 autoBind 为 true，则在 onMounted 时自动绑定
  // if (autoBind) {
  //   onMounted(() => {
  //     bind()
  //   })
  // }

  // 始终注册解除绑定，以防组件卸载时需要清理
  onUnmounted(() => {

    cleanup()
  })

  // // 如果 target 是 ref，则监听变化，自动重新绑定
  // if (target !== null && typeof target === 'object' && 'value' in target) {
  //   watch(target, () => {
  //     console.log('查xxxxxxxxxxx',)
  //     bind()
  //   }, { immediate: false })
  // }

  return {
    bind,
    unbind,
  }
}

