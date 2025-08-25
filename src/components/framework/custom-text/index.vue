<template>
  <el-text ref="cTextRef" :class="['c-text', button ? 'is-button' : '', disabled ? 'is-disabled' : '', loading ? 'is-loading' : '',]" v-bind="$attrs" size="default"
    :style="`${width ? 'width:' + width + 'px;' : 'width:auto;'}
    ${height ? 'height:' + height + 'px;' : ''}
    font-size:${size}px;
    --cursor:${cursor};
    --color:${color};
    --hoverColor:${hoverColor || color};
  `">
    <slot></slot>
  </el-text>

</template>

<script setup>
const props = defineProps({
  // 文字宽度
  width: { type: [Number, String], default: '' },
  // 文字高度
  height: { type: [Number, String], default: '' },
  // 文字大小
  size: { type: [Number, String], default: 14 },
  // 图标颜色
  color: { type: String, default: 'inherit', },
  // 图标悬浮色
  hoverColor: { type: String, default: '', },
  // 鼠标效果
  cursor: { type: String, default: 'auto', },
  // 按钮化
  button: { type: Boolean, default: false },
  // 禁用
  disabled: { type: Boolean, default: false },
  // 加载
  loading: { type: Boolean, default: false },
})

// # 二、模块功能
const EVENTS = [
  'click', 'dblclick',
  'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove',
  'contextmenu',
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'keydown', 'keyup', 'keypress'
]
const cTextRef = ref(null)
// # 1、遮罩的创建和移除
function createMask(el, className) {
  let maskEl = el.querySelector(`.${className}`)
  if (!maskEl) {
    maskEl = document.createElement('div')
    maskEl.className = className
    if (!el.style.position || el.style.position === 'static') {
      el.style.position = 'relative'
    }
    EVENTS.forEach(eventName => {
      maskEl.addEventListener(eventName, e => {
        e.preventDefault()
        e.stopPropagation()
      }, { passive: false })
    })
    el.appendChild(maskEl)
  }
}
function removeMask(el, className) {
  const maskEl = el.querySelector(`.${className}`)
  if (maskEl) {
    maskEl.remove()
  }
}
// ^
// ^

// # 三、机制
onMounted(() => {
  nextTick(() => {
    if (props.disabled && cTextRef.value.$el) {
      createMask(cTextRef.value.$el, 'c-text-disabled-mask')
    }
    if (props.loading && cTextRef.value.$el) {
      createMask(cTextRef.value.$el, 'c-text-loading-mask')
    }
  })
})
watch(() => props.disabled, (disabled) => {
  if (!cTextRef.value.$el) return
  disabled ? createMask(cTextRef.value.$el, 'c-text-disabled-mask') : removeMask(cTextRef.value.$el, 'c-text-disabled-mask')
})

watch(() => props.loading, (loading) => {
  if (!cTextRef.value.$el) return
  loading ? createMask(cTextRef.value.$el, 'c-text-loading-mask') : removeMask(cTextRef.value.$el, 'c-text-loading-mask')
})
// ^
</script>

<style lang="scss" scoped>
.c-text {
  color: var(--color);
  cursor: var(--cursor);

  &:not(.is-disabled):not(.is-loading):hover {
    color: var(--hoverColor);
  }

  &.is-button {
    &:not(.is-disabled):not(.is-loading) {
      position: relative;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.2s ease;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 2px;
        background: currentColor;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.2s ease;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }

  }

  &.is-disabled {
    opacity: 0.6;

    :deep(.c-text-disabled-mask) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      cursor: not-allowed;
      z-index: 9999;
    }
  }

  &.is-loading {
    animation: text-pulse 1.5s ease-in-out infinite;

    :deep(.c-text-loading-mask) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      cursor: wait;
      z-index: 9999;
    }

    @keyframes text-pulse {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }
  }
}
</style>