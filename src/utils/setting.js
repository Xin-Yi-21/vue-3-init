// 处理固定头部
export function handleFixHeader(setting) {
  if (setting.isFixHeader) {
    const height1 = document.getElementsByClassName('top-header-vue')[0].clientHeight
    const height2 = document.getElementsByClassName('top-container')[0].clientHeight
    const paddingTop = height1 + height2
    document.getElementsByClassName('layout-vue')[0].style.paddingTop = paddingTop ? paddingTop + 'px' : 0
  } else {
    document.getElementsByClassName('layout-vue')[0].style.paddingTop = 0
  }
}

// 处理全屏
export function handleFullScreen(setting) {
  const element = document.documentElement
  if (setting.isFullScreen) {
    if (element.requestFullscreen) {
      // 标准浏览器
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      // Chrome, Safari 和 Opera
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen()
    }
  } else {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }
}

// 处理全部
export function handleAllSetting(setting) {
  handleFixHeader(setting)
  // handleFullScreen(setting)
}