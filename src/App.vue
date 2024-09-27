<template>
  <router-view />
</template>

<script setup>
  const fitScale = (() => {
    // 任务栏的大小
    let taskbarX = window.screen.width - window.screen.availWidth
    let taskbarY = window.screen.height - window.screen.availHeight

    let scaleRatio = window.devicePixelRatio  // 总缩放率
    let browserRatio = 1                      // 浏览器设置缩放率
    let systemRatio = 1                       // 系统设置缩放率
    browserRatio = parseFloat((window.outerWidth / window.innerWidth).toFixed(2))
    function getBrowserRatio(browserRatioParams) {
      let browserNormalRatio = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]
      let closestRatio = browserNormalRatio[0]
      let minDiff = Math.abs(browserRatioParams - closestRatio)
      browserNormalRatio.forEach((ratio) => {
        let diff = Math.abs(browserRatio - ratio);
        if (diff < minDiff) {
          minDiff = diff;
          closestRatio = ratio
        }
      })
      return closestRatio
    }
    browserRatio = getBrowserRatio(browserRatio)
    systemRatio = scaleRatio / browserRatio

    let toolbarX = window.outerWidth - window.innerWidth * browserRatio
    let toolbarY = window.outerHeight - window.innerHeight * browserRatio

    let scaleRatioScrollX = 1.14        // 横向滚动条出现的缩放比例临界（1920*1080的分辨率）
    let scaleRatioScrollY = 1           // 竖向滚动条出现的缩放比例临界
    let scaleRatioBlankX = 1            // 横向空白页出现的缩放比例临界
    let scaleRatioBlankY = 1            // 竖向空白页出现的缩放比例临界

    let designWidth = 1920
    let designHeight = 1080

    document.body.style.minWidth = Math.round(designWidth / scaleRatioScrollX) - taskbarX - toolbarX + 'px'
    document.body.style.minHeight = (Math.round(designHeight / scaleRatioScrollY) - taskbarY - toolbarY) + 'px'
    document.body.style.maxWidth = Math.round(designWidth / scaleRatioBlankX) + 'px'
    document.body.style.maxHeight = Math.round(designHeight / scaleRatioBlankY) + 'px'
    document.body.style.margin = 'auto'
    // if (window.devicePixelRatio !== 1) { this.$message.warning('监测到当前浏览器屏幕缩放比例不为100%，为保证正常的显示效果请设置为100% !') }
    // console.log('🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩',)
    // console.log('任务栏x大小:', taskbarX, '      ', '任务栏y大小:', taskbarY)
    // console.log('总缩放率:', scaleRatio, '      ', '浏览器设置缩放率:', browserRatio, '      ', '系统设置缩放率:', systemRatio)
    // console.log('工具栏x大小:', toolbarX, '      ', '工具栏y大小：', toolbarY)
    // console.log('minWidth:', document.body.style.minWidth, '      ', 'minHeight:', document.body.style.minHeight, '      ', 'maxWidth:', document.body.style.maxWidth, '      ', 'maxHeight:', document.body.style.maxHeight)
    // console.log('⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐',)
    // console.log('window.screen.width:', window.screen.width, '      ', 'window.screen.height:', window.screen.height)
    // console.log('window.screen.availWidth:', window.screen.availWidth, '      ', 'window.screen.availHeight:', window.screen.availHeight)
    // console.log('window.outerWidth:', window.outerWidth, '      ', 'window.outerHeight:', window.outerHeight)
    // console.log('window.innerWidth:', window.innerWidth, '      ', 'window.innerHeight:', window.innerHeight)
  })

  onMounted(() => {
    nextTick(() => {
    })
    fitScale()
  })
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  font-family: PingFangSC, PingFang SC;
  background-color: #eef1f6;
}
</style>