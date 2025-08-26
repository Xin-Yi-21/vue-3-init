import { onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'

// 设置rem
export function setRem(designWidth = 1920, isMax = false) {
  function setHtmlFontSize() {
    let width = isMax ? Math.min(document.body.clientWidth, designWidth) : document.body.clientWidth
    let fontSize = (width / designWidth) * 1
    document.documentElement.style.fontSize = fontSize + 'px'
  }
  setHtmlFontSize()
  const resizeDelay = debounce(setHtmlFontSize, 100)
  window.addEventListener('resize', resizeDelay)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDelay)
  })
}