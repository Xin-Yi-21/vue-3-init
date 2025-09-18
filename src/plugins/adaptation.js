import { ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'

let designWidth = 1920
let designHeight = 1080

// 设置rem
export function setRem(isMax = false) {
  function setHtmlFontSize() {
    let width = isMax ? Math.min(document.body.clientWidth, designWidth) : document.body.clientWidth
    let fontSize = width / designWidth
    document.documentElement.style.fontSize = fontSize + 'px'
  }
  setHtmlFontSize()
  const resizeDelay = debounce(setHtmlFontSize, 100)
  window.addEventListener('resize', resizeDelay)
  // onBeforeUnmount(() => { window.removeEventListener('resize', resizeDelay) })
}
// 像素转rem
export function $pr(px) {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (px / rootFontSize) + 'rem';
}
// 像素转vw
export function $pvw(px) {
  return (px / designWidth * 100) + 'vw'
}
// 像素转vh
export function $pvh(px) {
  return (px / designHeight * 100) + 'vw'
}

// 转像素
export function $px(value, from = 'rem', withUnit = true) {
  function calculatePx(value, from, withUnit) {
    if (value === null || value === undefined || value === '') return withUnit ? '0px' : 0
    const num = parseFloat(value)
    if (isNaN(num)) return withUnit ? '0px' : 0

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const width = document.body.clientWidth
    const height = document.body.clientHeight
    const rootValue = 1

    let px
    switch (from) {
      case 'rem':
        px = num * rootFontSize * rootValue
        break
      case 'vw':
        px = (num / 100) * width
        break
      case 'vh':
        px = (num / 100) * height
        break
      case 'px':
      default:
        px = num
        break
    }

    return withUnit ? `${px}px` : px
  }

  const px = ref(calculatePx(value, from, withUnit))

  const update = debounce(() => {
    px.value = calculatePx(value, from, withUnit)
  }, 100)

  onMounted(() => window.addEventListener('resize', update))
  onBeforeUnmount(() => window.removeEventListener('resize', update))

  return px
}


// 综合
export function $setCssSize(value, to = 'rem') {
  if (typeof value === 'string' && /(px|rem|vw|vh)$/i.test(value)) { return value }
  const num = parseFloat(value); if (isNaN(num)) { return '0' }
  switch (to) {
    case 'rem': {
      const rootValue = 1
      return (num / rootValue) + 'rem'
    }
    case 'vw':
      return (num / designWidth * 100) + 'vw'
    case 'vh':
      return (num / designHeight * 100) + 'vh'
    default:
      return num + 'px'
  }
}


