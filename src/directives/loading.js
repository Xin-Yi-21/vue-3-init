import { createVNode, render } from 'vue'
import Loading from '@/components/custom-loading'

function getType(binding) {
  if (typeof binding.value === 'object') {
    return binding.value.type || 'rocket'
  }
  return 'rocket'
}

function getloading(binding) {
  if (typeof binding.value === 'boolean') return binding.value
  return binding.value?.loading
}

export default {
  mounted(el, binding) {
    const type = getType(binding)
    const loading = getloading(binding)

    if (!el.style.position || el.style.position === 'static') {
      el.style.position = 'relative'
    }

    const { fullscreen, text, maxTime, onCancel, showAnim } = binding.value || {}
    const vnode = createVNode(Loading, { target: el, fullscreen, text, maxTime, onCancel, type, showAnim })

    if (loading) {
      render(vnode, el)
    } else {
      render(null, el)
    }

    el.__loadingVNode = vnode
  },

  updated(el, binding) {
    const type = getType(binding)
    const loading = getloading(binding)
    const oldloading = getloading({ value: binding.oldValue })

    if (loading === oldloading) return

    if (loading) {
      const { fullscreen, text, maxTime, onCancel, showAnim } = binding.value || {}
      const vnode = createVNode(Loading, { target: el, fullscreen, text, maxTime, onCancel, type, showAnim })
      render(vnode, el)
      el.__loadingVNode = vnode
    } else {
      render(null, el)
    }
  },

  beforeUnmount(el) {
    render(null, el)
  },
}
