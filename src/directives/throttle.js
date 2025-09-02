// 首次绑定事件（mounted）

// 元素更新时解绑旧事件，重新绑定新事件（updated）

// 元素卸载时清理事件监听（unmounted）

// 节流状态（lastThrottleTime）挂载在元素上，防止重置

// 节流函数在每次绑定时新建，避免多次绑定混乱

// 节流
export default {
  mounted(el, binding) {
    initThrottle(el, binding)
  },
  updated(el, binding) {
    // 先解绑旧监听
    if (el.__throttle_cleanup) {
      el.__throttle_cleanup()
    }
    // 重新绑定
    initThrottle(el, binding)
  },
  unmounted(el) {
    if (el.__throttle_cleanup) {
      el.__throttle_cleanup()
    }
  }
};

function initThrottle(el, binding) {
  const delay = binding.value?.delay || 500
  const fn = binding.value?.fn
  const event = binding.value?.event || 'click'

  if (typeof fn !== 'function') {
    console.warn(`[v-throttle] 请传入 ${event} 的 fn 回调函数`)
    return
  }

  // 节流状态挂载在元素上，避免丢失
  if (el.__lastThrottleTime === undefined) {
    el.__lastThrottleTime = 0
  }

  const throttleFn = function (...args) {
    const now = Date.now()
    if (now - el.__lastThrottleTime >= delay) {
      el.__lastThrottleTime = now
      fn.apply(this, args)
    }
  };

  el.addEventListener(event, throttleFn)

  el.__throttle_cleanup = () => {
    el.removeEventListener(event, throttleFn)
    delete el.__throttle_cleanup
  }
}
