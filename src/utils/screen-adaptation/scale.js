import { onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'
import { ElMessage } from 'element-plus'

// 浏览器缩放适配：设置临界
// 实现1：对于1920*1080 及以上分辨率屏幕，body设置最小宽高来保持页面比例。
// 实现2：对于小于1920 * 1080 分辨率，基于屏幕剩余可用宽高，缩放来保持页面比例。
export function scaleFit() {
  function resize() {
    // 1、缩放率
    // (1) 总缩放率
    let scaleRatio = window.devicePixelRatio
    // (2) 浏览器缩放率
    let browserRatio = parseFloat((window.outerWidth / window.innerWidth).toFixed(2))
    function getBrowserRatio(browserRatioParams) {
      const browserNormalRatio = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
      return browserNormalRatio.reduce((closest, current) => {
        return Math.abs(current - browserRatioParams) < Math.abs(closest - browserRatioParams) ? current : closest;
      })
    }
    browserRatio = getBrowserRatio(browserRatio)
    // (3) 系统缩放率
    let systemRatio = 1
    systemRatio = scaleRatio / browserRatio
    // (4) 缩放比例临界
    let scaleRatioScrollX = 1           // 横向滚动条出现的缩放比例临界（1920*1080的分辨率）
    let scaleRatioScrollY = 1           // 竖向滚动条出现的缩放比例临界
    let scaleRatioBlankX = 1            // 横向空白页出现的缩放比例临界
    let scaleRatioBlankY = 1            // 竖向空白页出现的缩放比例临界


    // 2、像素大小
    // (1) 任务栏的大小
    let taskbarX = Math.max(window.screen.width - window.screen.availWidth, 0)
    let taskbarY = Math.max(window.screen.height - window.screen.availHeight, 0)
    // (2) 工具栏大小
    let toolbarX = Math.max(window.outerWidth - window.innerWidth * browserRatio, 0)
    let toolbarY = Math.max(window.outerHeight - window.innerHeight * browserRatio, 0)

    // (3) 设计稿分辨率
    let designWidth = 1920
    let designHeight = 1080
    // (4) 屏幕分辨率
    let screenWidth = window.screen.width
    let screenHeight = window.screen.height


    // 3、设置适配
    if (window.screen.width > 1920 || window.screen.width == 1920) {
      document.body.style.minWidth = Math.round(designWidth / scaleRatioScrollX) - taskbarX - toolbarX + 'px'
      document.body.style.minHeight = Math.round(designHeight / scaleRatioScrollY) - taskbarY - toolbarY + 'px'
      document.body.style.maxWidth = Math.round(screenWidth / scaleRatioBlankX) + 'px'
      document.body.style.maxHeight = Math.round(screenHeight / scaleRatioBlankY) + 'px'
    } else if (window.screen.width < 1920) {
      // document.body.style.minWidth = Math.round(designWidth / scaleRatioScrollX) - taskbarX - toolbarX + 'px'
      // document.body.style.minHeight = Math.round(designHeight / scaleRatioScrollY) - taskbarY - toolbarY + 'px'
      // document.body.style.maxWidth = designWidth + 'px'
      // document.body.style.maxHeight = designHeight + 'px'

      // 最大内容展示分辨率
      let viewWidth = window.screen.width - taskbarX - toolbarX
      let viewHeight = window.screen.height - taskbarY - toolbarY
      // 缩放比例
      let scale = 1
      const scaleW = viewWidth / designWidth
      const scaleH = viewHeight / designHeight
      scale = Math.min(scaleW, scaleH)

      let targetDom = document.getElementById('app')
      targetDom.style.width = designWidth + 'px'
      targetDom.style.height = designHeight + 'px'
      targetDom.style.transform = `scale(${scale})`
      targetDom.style.transformOrigin = `0 0`

      let offsetX = (viewWidth - designWidth * scale) / 2
      let offsetY = (viewHeight - designHeight * scale) / 2
      document.body.style.padding = `${offsetY}px ${offsetX}px`
    }


    // if (window.devicePixelRatio !== 1) { ElMessage.warning('监测到当前浏览器屏幕缩放比例不为100%，为保证正常的显示效果请设置为100% !') }
    // console.log('🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩',)
    // console.log('任务栏x大小:', taskbarX, '      ', '任务栏y大小:', taskbarY)
    // console.log('工具栏x大小:', toolbarX, '      ', '工具栏y大小：', toolbarY)
    // console.log('总缩放率:', scaleRatio, '      ', '浏览器设置缩放率:', browserRatio, '      ', '系统设置缩放率:', systemRatio)
    // console.log('minWidth:', document.body.style.minWidth, '      ', 'minHeight:', document.body.style.minHeight, '      ', 'maxWidth:', document.body.style.maxWidth, '      ', 'maxHeight:', document.body.style.maxHeight)
    // console.log('⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',)
    // console.log('window.screen.width:', window.screen.width, '      ', 'window.screen.height:', window.screen.height)
    // console.log('window.screen.availWidth:', window.screen.availWidth, '      ', 'window.screen.availHeight:', window.screen.availHeight)
    // console.log('window.outerWidth:', window.outerWidth, '      ', 'window.outerHeight:', window.outerHeight)
    // console.log('window.innerWidth:', window.innerWidth, '      ', 'window.innerHeight:', window.innerHeight)
  }
  const resizeDelay = debounce(resize, 100)
  resize()
  window.addEventListener('resize', resizeDelay)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDelay)
  })
}

// 大屏缩放适配
export const scaleAdapt = (targetDom) => {
  // 设计稿宽高
  const designWidth = 1920
  const designHeight = 1080

  // 缩放比例
  let scale = 1

  function resize() {
    // 浏览器可用区域宽高
    const clientWidth = document.body.clientWidth
    const clientHeight = document.body.clientHeight

    // 宽高缩放比例
    const scaleW = clientWidth / designWidth
    const scaleH = clientHeight / designHeight

    // 选择较小缩放比，防止溢出
    scale = Math.min(scaleW, scaleH)

    targetDom.style.width = designWidth + 'px'
    targetDom.style.height = designHeight + 'px'

    targetDom.parentElement.style.position = 'relative'
    targetDom.style.position = 'absolute'
    targetDom.style.top = '50%'
    targetDom.style.left = '50%'
    targetDom.style.transform = `scale(${scale}) translate(${-50 / scale}%, ${-50 / scale}%)`;
    // targetDom.style.transformOrigin = 'top left'
  }
  const resizeDelay = debounce(resize, 100)

  if (targetDom) {
    resize()
    window.addEventListener('resize', resizeDelay)
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDelay)
  })
}

