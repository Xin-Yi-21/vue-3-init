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
  document.documentElement.style.setProperty('--tcrgb', hexToRgb(themeColor))
  document.documentElement.style.setProperty('--bg-hover', `${getAlphaColor(themeColor, 0.05)}`)
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tca${'0' + i}`, `${getAlphaColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tcl${'0' + i}`, `${getLightColor(themeColor, i / 10)}`)
    document.documentElement.style.setProperty(`--tcd${'0' + i}`, `${getDarkColor(themeColor, i / 10)}`)
  }
  document.documentElement.style.setProperty(`--tca${'003'}`, `${getAlphaColor(themeColor, 0.03)}`)
  document.documentElement.style.setProperty(`--tca${'005'}`, `${getAlphaColor(themeColor, 0.05)}`)
  document.documentElement.style.setProperty(`--tca${'015'}`, `${getAlphaColor(themeColor, 0.15)}`)
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


/**
 * 调整颜色的亮度和饱和度，并返回 HEX 格式的新颜色
 * @param {string} color - 原始颜色，支持 Hex、rgb(a)、hsl(a)、CSS 变量等任意合法格式
 * @param {number} [deltaL=0] - 亮度调整值，范围 -100 到 100
 * @param {number} [deltaS=0] - 饱和度调整值，范围 -100 到 100
 * @returns {string} 调整后的颜色，格式为 "#RRGGBB"
 */
export function getLSColor(color, deltaL = 0, deltaS = 0) {
  // —— 辅助：将任意 CSS 颜色标准化为 "rgb(R, G, B)"
  const normalizeToRgb = input => {
    const div = document.createElement('div');
    div.style.color = input;
    document.body.appendChild(div);
    const rgbString = getComputedStyle(div).color; // "rgb(r, g, b)"
    document.body.removeChild(div);
    return rgbString;
  };

  // —— 辅助：解析 "rgb(R, G, B)" → [r, g, b]
  const parseRgb = rgbString =>
    rgbString.match(/\d+/g).slice(0, 3).map(Number);

  // —— 辅助：RGB 数组 → HSL 对象
  const rgbToHsl = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // —— 辅助：HSL 对象 → RGB 数组
  const hslToRgb = ({ h, s, l }) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // —— 辅助：RGB 数组 → HEX 字符串
  const rgbToHex = ([r, g, b]) =>
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();

  // 1. 解析输入颜色到 RGB → HSL
  const rgbArr = parseRgb(normalizeToRgb(color));
  const hsl = rgbToHsl(rgbArr);

  // 2. 调整亮度/饱和度，并 clamp 到 [0,100]
  hsl.l = Math.min(100, Math.max(0, hsl.l + deltaL));
  hsl.s = Math.min(100, Math.max(0, hsl.s + deltaS));

  // 3. 转回 RGB → HEX 并返回
  return rgbToHex(hslToRgb(hsl));
}

