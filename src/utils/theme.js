// import app from '@/app.js'
// 处理主题风格
export function handleThemeStyle(themeStyle) {
  document.documentElement.setAttribute('theme-style', themeStyle)
  // if (themeStyle === 'light') {
  //   app.config.globalProperties.$echartTheme = { bg: '#fff', fcp: '#333', fcs: '#666', fct: '#999', bcp: '#ccc', bcs: '#ddd', bct: '#eee', }
  // } else if (themeStyle === 'dark') {
  //   app.config.globalProperties.$echartTheme = { bg: '#333', fcp: '#fff', fcs: 'rgba(255, 255, 255, 0.8)', fct: 'rgba(255, 255, 255, 0.6)', bcp: '#efefef', bcs: '#5d5d5d', bct: '#666', }
  // }
  // window.dispatchEvent(new CustomEvent('theme-style-change'))
  // window.removeEventListener('theme-style-change')
}
// 处理主题颜色
export function handleThemeColor(themeColor) {
  document.documentElement.style.setProperty('--el-color-primary', themeColor)
  document.documentElement.style.setProperty('--tc', themeColor)
  document.documentElement.style.setProperty('--bg-hover', `${getLightColor(themeColor, 6 / 10)}`)
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tca${i}`, `${getAlphaColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tcl${i}`, `${getLightColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tcd${i}`, `${getDarkColor(themeColor, i / 10)}`)
  }
}

// 处理主题大小
export function handleThemeSize(themeSize) {
  document.documentElement.setAttribute('theme-size', themeSize)
  // let tsLRV = {
  //   'large': { themeSizeComponentHeight: '36px', fontSize: '14px', },
  //   'normal': { themeSizeComponentHeight: '30px', fontSize: '13px' },
  //   'small': { themeSizeComponentHeight: '24px', fontSize: '12px' },
  // }
  // document.documentElement.style.setProperty(`--ch`, tsLRV[themeSize]?.themeSizeComponentHeight)
  // document.documentElement.style.setProperty(`--cfs`, tsLRV[themeSize]?.fontSize)
  // document.documentElement.style.setProperty(`--fsnu`, 14)
}
// hex颜色转rgb颜色
export function hexToRgb(str) {
  str = str.replace('#', '')
  let hexs = str.match(/../g)
  for (let i = 0; i < 3; i++) {
    hexs[i] = parseInt(hexs[i], 16)
  }
  return hexs
}

// rgb颜色转Hex颜色
export function rgbToHex(r, g, b) {
  let hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length == 1) {
      hexs[i] = `0${hexs[i]}`
    }
  }
  return `#${hexs.join('')}`
}

// 变透明颜色值
export function getAlphaColor(color, level,) {
  let rgb = hexToRgb(color)
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${level})`;
}

// 变浅颜色值
export function getLightColor(color, level) {
  let rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

// 变深颜色值
export function getDarkColor(color, level) {
  let rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor(rgb[i] * (1 - level))
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}
