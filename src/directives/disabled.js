const EVENTS = [
  'click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'contextmenu',
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'keydown', 'keyup', 'keypress'
]

export default {
  mounted(el, binding) {
    applyDisabled(el, binding.value)
  },
  updated(el, binding) {
    applyDisabled(el, binding.value)
  },
  unmounted(el) {
    cleanup(el)
  },
}

function applyDisabled(el, value) {
  const config = normalizeConfig(value)

  if (config.disabled) {
    if (!el._originalOpacity) el._originalOpacity = el.style.opacity || ''
    if (!el._originalCursor) el._originalCursor = el.style.cursor || ''

    el.classList.add('is-disabled')
    el.style.opacity = config.opacity
    el.style.cursor = config.cursor

    if (!el._disabledMask) {
      const mask = document.createElement('div')
      mask.className = 'v-disabled-mask'
      Object.assign(mask.style, {
        position: 'absolute',
        inset: '0',
        background: 'transparent',
        pointerEvents: 'auto',
        cursor: config.cursor,
        zIndex: '9999',
      })

      const style = getComputedStyle(el)
      if (style.position === 'static' || !style.position) {
        el.style.position = 'relative'
      }

      el.appendChild(mask)
      el._disabledMask = mask
    }

    if (!el._disabledListeners) {
      el._disabledListeners = EVENTS.map(event => {
        const handler = e => {
          e.stopImmediatePropagation()
          e.stopPropagation()
          e.preventDefault()
        }
        el.addEventListener(event, handler, true)
        return { event, handler }
      })
    }
  } else {
    cleanup(el)
  }
}

function cleanup(el) {
  el.classList.remove('is-disabled')

  if (el._disabledMask) {
    el.removeChild(el._disabledMask)
    el._disabledMask = null
  }

  if (el._disabledListeners) {
    el._disabledListeners.forEach(({ event, handler }) => {
      el.removeEventListener(event, handler, true)
    })
    el._disabledListeners = null
  }

  if (el._originalOpacity !== undefined) {
    el.style.opacity = el._originalOpacity
    delete el._originalOpacity
  }

  if (el._originalCursor !== undefined) {
    el.style.cursor = el._originalCursor
    delete el._originalCursor
  }
}

function normalizeConfig(value) {
  if (typeof value === 'boolean') {
    return { disabled: value, cursor: 'not-allowed', opacity: '0.6' }
  }
  if (value && typeof value === 'object') {
    return {
      disabled: Boolean(value.disabled),
      cursor: value.cursor || 'not-allowed',
      opacity: value.opacity != null ? String(value.opacity) : '0.6',
    }
  }
  return { disabled: false, cursor: 'not-allowed', opacity: '0.6' }
}
