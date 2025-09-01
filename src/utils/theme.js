// 处理主题风格
export function handleThemeStyle(themeStyle) {
  document.documentElement.setAttribute('theme-style', themeStyle)
}
// 处理主题颜色
export function handleThemeColor(themeColor) {
  document.documentElement.style.setProperty('--tc', themeColor)
  document.documentElement.style.setProperty('--el-color-primary', themeColor)
  document.documentElement.style.setProperty('--tc-rgb', colorTranslate(themeColor, 'nrgb'))
  document.documentElement.style.setProperty('--bg-hover', `${getAlphaColor(themeColor, 0.05)}`)
  // 主题色浅色暗色系
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(themeColor, i / 10, 'srgb')}`)
    document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(themeColor, i / 10, 'srgb')}`)
    document.documentElement.style.setProperty(`--tc-light-${i}`, `${getLightColor(themeColor, i / 10, 'srgb')}`)
    document.documentElement.style.setProperty(`--tc-dark-${i}`, `${getDarkColor(themeColor, i / 10, 'srgb')}`)
  }
  // 主题色透明度
  for (let i = 0; i <= 100; i++) {
    document.documentElement.style.setProperty(`--tc-alpha-${i}`, `${getAlphaColor(themeColor, i / 100, 'srgba')}`)
  }
}

// 处理主题大小
export function handleThemeSize(themeSize) {
  document.documentElement.setAttribute('theme-size', themeSize)
}

// 颜色格式转换，支持 hex, hexa, srgb, nrgb, srgba, nrgba, hsl, hsla
export function colorTranslate(color, type = 'srgb') {
  if (!color || typeof color !== 'string') return null;
  color = color.trim().toLowerCase();

  let rgba = []; // [r, g, b, a] a 0-255

  // =====================
  // 1、hex / hexa
  // =====================
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3 || hex.length === 4) hex = hex.split('').map(ch => ch + ch).join('');
    if (hex.length !== 6 && hex.length !== 8) return null;
    rgba = hex.match(/.{2}/g).map(v => parseInt(v, 16));
    if (rgba.length === 3) rgba.push(255);
  }
  // =====================
  // 2、srgb / srgba
  // =====================
  else if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g);
    if (!nums || nums.length < 3) return null;
    rgba = nums.slice(0, 4).map(Number);
    if (rgba.length === 3) rgba.push(1);
    rgba[3] = rgba[3] <= 1 ? Math.round(rgba[3] * 255) : rgba[3];
  }
  // =====================
  // 3、nrgb / nrgba
  // =====================
  else if (/^\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?(,\d+(\.\d+)?)?$/.test(color)) {
    rgba = color.split(',').map(Number);
    if (rgba.length === 3) rgba.push(255);
    if (rgba[3] <= 1) rgba[3] = Math.round(rgba[3] * 255);
  }
  // =====================
  // 4、hsl / hsla
  // =====================
  else if (color.startsWith('hsl')) {
    const nums = color.match(/[\d.]+/g);
    if (!nums || nums.length < 3) return null;
    let [h, s, l, a = 1] = nums.map(Number);
    rgba = hslToRgb({ h, s, l }); // 转 RGB
    rgba.push(a <= 1 ? Math.round(a * 255) : a);
  }
  // =====================
  // 5、非法输入
  // =====================
  else {
    return null;
  }

  let [r, g, b, a] = rgba.map(v => Math.round(v));

  // =====================
  // 6、输出指定格式
  // =====================
  switch (type) {
    case 'hex':
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    case 'hexa':
      return '#' + [r, g, b, a].map(v => v.toString(16).padStart(2, '0')).join('');
    case 'srgb':
      return `rgb(${r},${g},${b})`;
    case 'nrgb':
      return `${r},${g},${b}`;
    case 'srgba':
      return `rgba(${r},${g},${b},${(a / 255).toFixed(2).replace(/\.?0+$/, '')})`;
    case 'nrgba':
      return `${r},${g},${b},${(a / 255).toFixed(2).replace(/\.?0+$/, '')}`;
    case 'hsl':
    case 'hsla': {
      const { h, s, l } = rgbToHsl([r, g, b]);
      const alpha = (a / 255).toFixed(2).replace(/\.?0+$/, '');
      return type === 'hsl'
        ? `hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%)`
        : `hsla(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%,${alpha})`;
    }
    default:
      return null;
  }

  // =====================
  // 内部工具函数：HSL ↔ RGB
  // =====================
  function hslToRgb({ h, s, l }) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) r = g = b = l;
    else {
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
  }

  function rgbToHsl([r, g, b]) {
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
  }
}

// 生成 Light 颜色
export function getLightColor(color, level = 1, type = 'srgb') {
  // 基于 colorTranslate 转成 [r,g,b]
  const base = colorTranslate(color, 'nrgb').split(',').map(Number)
  if (!base || base.length < 3) return null
  const [r, g, b] = base

  // 计算新的 rgb
  const nr = Math.round(r + (255 - r) * level)
  const ng = Math.round(g + (255 - g) * level)
  const nb = Math.round(b + (255 - b) * level)

  // 拼回逗号字符串后交给 colorTranslate 转目标类型
  return colorTranslate(`${nr},${ng},${nb}`, type)
}

// 生成 Dark 颜色
export function getDarkColor(color, level = 1, type = 'srgb') {
  // 基于 colorTranslate 转成 [r,g,b]
  const base = colorTranslate(color, 'nrgb').split(',').map(Number)
  if (!base || base.length < 3) return null
  const [r, g, b] = base

  // 计算新的 rgb
  const nr = Math.round(r * (1 - level))
  const ng = Math.round(g * (1 - level))
  const nb = Math.round(b * (1 - level))

  // 拼回逗号字符串后交给 colorTranslate 转目标类型
  return colorTranslate(`${nr},${ng},${nb}`, type)
}

// 生成 Alpha 颜色
export function getAlphaColor(color, level, type = 'srgba') {
  // 1、转成 nrgba，保证有 alpha
  let rgba = colorTranslate(color, 'nrgba') // "r,g,b,a"
  if (!rgba) return null

  // 2、拆成 [r, g, b, a]
  let parts = rgba.split(',').map(Number)
  if (parts.length < 4) parts.push(1) // 没有 alpha 就补 1
  let [r, g, b, a] = parts

  // 3、如果传了 level，用 level；否则保持原始 a
  if (typeof level === 'number') {
    a = Math.max(0, Math.min(1, level))
  } else {
    a = a > 1 ? a / 255 : a // 如果是 0-255 转 0-1
  }

  // 4、返回新颜色
  return colorTranslate(`${r},${g},${b},${a}`, type)
}

// 生成 饱和度 颜色
export function getSaturationColor(color, deltaS = 0, type = 'srgb') {
  if (!color) return null;

  // 转 HSL，保留 alpha
  const hslaStr = colorTranslate(color, 'hsla');
  if (!hslaStr) return null;

  const nums = hslaStr.match(/[\d.]+/g).map(Number);
  let [h, s, l, a = 1] = nums;

  s = Math.min(100, Math.max(0, s + deltaS));

  // 输出
  return colorTranslate(`hsla(${h},${s}%,${l}%,${a})`, type);
}

// 生成 亮度 颜色
export function getLightnessColor(color, deltaL = 0, type = 'srgb') {
  if (!color) return null;

  // 转 HSL，保留 alpha
  const hslaStr = colorTranslate(color, 'hsla'); // "hsla(h,s%,l%,a)"
  if (!hslaStr) return null;

  const nums = hslaStr.match(/[\d.]+/g).map(Number);
  let [h, s, l, a = 1] = nums;

  l = Math.min(100, Math.max(0, l + deltaL));

  // 输出
  return colorTranslate(`hsla(${h},${s}%,${l}%,${a})`, type);
}






