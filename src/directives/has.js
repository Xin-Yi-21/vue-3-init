export default {
  mounted(el, binding) {
    const { childClass = '', addClass = 'has', deep = true } = binding.value || {}

    if (!childClass) return

    const checkAndToggle = () => {
      let hasChild
      if (deep) {
        // 检测所有后代
        hasChild = el.querySelector(`.${childClass}`) !== null
      } else {
        // 只检测一级子元素
        hasChild = Array.from(el.children).some(child => child.classList.contains(childClass))
      }

      if (hasChild) {
        el.classList.add(addClass)
      } else {
        el.classList.remove(addClass)
      }
    };

    // 初次检查
    checkAndToggle()

    // 监听 DOM 变化，实时更新
    const observer = new MutationObserver(checkAndToggle)
    observer.observe(el, { childList: true, subtree: deep })
    el._hasClassObserver = observer
  },

  unmounted(el) {
    if (el._hasClassObserver) {
      el._hasClassObserver.disconnect()
      delete el._hasClassObserver
    }
  }
}
