
import app from '@/app.js'
// 处理主题样式
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

// 处理主题样式
export function handleThemeStyle(themeStyle) {
  document.documentElement.setAttribute('theme-style', themeStyle)
  app.config.globalProperties.$color = 'red'
  if (themeStyle === 'light') {
    app.config.globalProperties.$echartTheme = { bg: '#fff', fcp: '#333', fcs: '#666', fct: '#999', bcp: '#ccc', bcs: '#ddd', bct: '#eee', }
  } else if (themeStyle === 'dark') {
    app.config.globalProperties.$echartTheme = { bg: '#333', fcp: '#fff', fcs: 'rgba(255, 255, 255, 0.8)', fct: 'rgba(255, 255, 255, 0.6)', bcp: '#efefef', bcs: '#5d5d5d', bct: '#666', }
  }

  // function getRootCssVariables() {
  //   const variables = {};

  //   // 遍历所有样式表
  //   for (const sheet of document.styleSheets) {
  //     try {
  //       // 遍历样式表中的所有规则
  //       for (const rule of sheet.cssRules) {
  //         // 如果是 :root 规则
  //         if (rule.selectorText === ':root') {
  //           // 遍历 :root 中的所有属性
  //           for (let i = 0; i < rule.style.length; i++) {
  //             const property = rule.style[i];
  //             // 只获取 CSS 变量（以 '--' 开头的属性）
  //             if (property.startsWith('--')) {
  //               variables[property] = rule.style.getPropertyValue(property).trim();
  //             }
  //           }
  //         }
  //       }
  //     } catch (e) {
  //       // 如果访问跨域的样式表，会抛出错误（忽略这些样式表）
  //       console.error(e);
  //     }
  //   }

  //   return variables;
  // }
  // console.log('11111', getRootCssVariables());

  // here
  // const theme = {}
  // const styles = document.documentElement.style
  // for (let i = 0; i < styles.length; i++) {
  //   const property = styles[i]
  //   if (property.startsWith('--')) {
  //     theme[property] = styles.getPropertyValue(property).trim()
  //   }
  // }
  // app.config.globalProperties.$theme = theme
  // here


  // window.dispatchEvent(new CustomEvent('theme-style-change'))
  // window.removeEventListener('theme-style-change')
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
