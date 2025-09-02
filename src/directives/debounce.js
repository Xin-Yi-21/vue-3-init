// 防抖
export default {
  mounted(el, binding) {
    initDebounce(el, binding)
  },
  updated(el, binding) {
    // 不重新绑定事件，避免重复绑定和状态丢失
    if (typeof binding.value?.fn === 'function') {
      el.__debounce_fn = binding.value.fn
      el.__debounce_delay = binding.value.delay ?? 500
      el.__debounce_immediate = binding.value.immediate ?? false
    }
  },
  unmounted(el) {
    if (el.__debounce_cleanup) {
      el.__debounce_cleanup()
    }
  }
}

function initDebounce(el, binding) {
  const { delay = 500, fn, event = 'click', immediate = false } = binding.value || {}

  if (typeof fn !== 'function') {
    console.warn(`[v-debounce] 请传入 ${event} 的 fn 回调函数`)
    return
  }

  el.__debounce_fn = fn
  el.__debounce_delay = delay
  el.__debounce_immediate = immediate

  el.__debounce_timer = null
  el.__leadingExecuted = false
  el.__trailingScheduled = false
  el.__lastArgs = null
  el.__lastThis = null

  const debounceFn = function (...args) {
    el.__lastArgs = args
    el.__lastThis = this

    if (el.__debounce_immediate) {
      if (!el.__leadingExecuted) {
        // 首次立即执行
        el.__debounce_fn.apply(el.__lastThis, el.__lastArgs)
        el.__leadingExecuted = true

        el.__debounce_timer = setTimeout(() => {
          el.__leadingExecuted = false
          el.__debounce_timer = null
        }, el.__debounce_delay)

      } else {
        // 安排尾部调用，但尾部只安排一次
        if (!el.__trailingScheduled) {
          el.__trailingScheduled = true
          clearTimeout(el.__debounce_timer)
          el.__debounce_timer = setTimeout(() => {
            el.__debounce_fn.apply(el.__lastThis, el.__lastArgs)
            el.__leadingExecuted = false
            el.__trailingScheduled = false
            el.__debounce_timer = null
          }, el.__debounce_delay)
        }
      }
    } else {
      // immediate = false，普通尾部防抖
      if (el.__debounce_timer) clearTimeout(el.__debounce_timer)
      el.__debounce_timer = setTimeout(() => {
        el.__debounce_fn.apply(el.__lastThis, el.__lastArgs)
        el.__debounce_timer = null
      }, el.__debounce_delay)
    }
  }

  el.addEventListener(event, debounceFn)

  el.__debounce_cleanup = () => {
    el.removeEventListener(event, debounceFn)
    if (el.__debounce_timer) {
      clearTimeout(el.__debounce_timer)
      el.__debounce_timer = null
    }
    el.__leadingExecuted = false
    el.__trailingScheduled = false
    el.__lastArgs = null
    el.__lastThis = null
    delete el.__debounce_cleanup
  };
}
