import { createVNode, render, } from 'vue'
import Loading from '@/components/custom-loading'

export default {
  mounted(el, binding) {
    // el.classList.add('c-loading-parent')
    el.style.position = 'relative'
    const isLoading = typeof binding.value === 'boolean' ? binding.value : binding.value?.isLoading
    const { fullscreen, text, timeout, isShowCancel, onCancel } = typeof binding.value === 'object' ? binding.value : {}
    const loadingInstance = createVNode(Loading, { target: el, fullscreen, text, timeout, onCancel, })
    if (isLoading) {
      render(loadingInstance, el)
    } else {
      render(null, el)
    }
    el.__loadingInstance = loadingInstance
  },
  updated(el, binding) {
    // const loadingInstance = el.__loadingInstance
    const isLoading = typeof binding.value === 'boolean' ? binding.value : binding.value?.isLoading
    const { fullscreen, text, timeout, isShowCancel, onCancel } = typeof binding.value === 'object' ? binding.value : {}
    if (isLoading !== binding.oldValue) {
      if (isLoading) {
        el.classList.add('c-loading-parent')
        render(createVNode(Loading, { target: el, fullscreen, text, timeout, onCancel }), el)
      } else {
        el.classList.remove('c-loading-parent')
        render(null, el)
      }
    }
  },
  beforeUnmount(el) {
    el.classList.remove('c-loading-parent')
    render(null, el)
  }
}