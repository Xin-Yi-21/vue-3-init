<template>
  <i ref="cIconRef" :class="['c-icon', i, button ? 'is-button' : '', disabled ? 'is-disabled' : '', loading ? 'is-loading' : '',]"
    :style="`--color:${color};--font-size:${$setCssSize(size, 'rem')};--cursor:${cursor};--hoverColor:${hoverColor || color};`">
    <!-- 一、显示类型：自定义提示 -->
    <template v-if="showType == 'c'">
      <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="`#icon-${i}`" :fill="color" />
      </svg>
      <span class="icon-tip" :style="`transform:translate(-50%,-${offset}px)`" v-if="tip">{{ tip }}</span>
    </template>

    <!-- 二、显示类型：el-tooltip提示 -->
    <el-tooltip v-if="tip && showType == 'el'" :popper-class="['c-icon-tooltip', tipClass]" v-bind="$attrs" :placement="placement" :offset="offset" :hide-after="1">
      <template #default>
        <svg class="svg-icon" aria-hidden="true">
          <use :xlink:href="`#icon-${i}`" :fill="color" />
        </svg>
      </template>
      <template #content>
        <span :style="`color:${hoverColor || color};`">{{ tip }}</span>
      </template>
    </el-tooltip>

    <!-- 三、显示类型：el-popover提示 -->
    <el-popover v-if="showType == 'ep'" :popper-class="['c-icon-popover', tipClass]" v-bind="$attrs" :placement="placement" trigger="click">
      <template #default>
        <slot name="tip"></slot>
      </template>
      <template #reference>
        <svg class="svg-icon" aria-hidden="true">
          <use :xlink:href="`#icon-${i}`" :fill="color" />
        </svg>
      </template>
    </el-popover>
  </i>
</template>

<script setup>
// # 一、综合
// 组件
import { ElTooltip, ElPopover } from 'element-plus'
// props
const props = defineProps({
  // 引用svg文件名称
  i: { type: String, default: '', },
  // 图标颜色
  color: { type: String, default: 'inherit', },
  // 图标悬浮色
  hoverColor: { type: String, default: '', },
  // 图标大小
  size: { type: [Number, String], default: '14', },
  // 图标提示
  tip: { type: String, default: '', },
  // 按钮
  button: { type: Boolean, default: false, },
  // 禁用
  disabled: { type: Boolean, default: false, },
  // 加载
  loading: { type: Boolean, default: false, },
  // 鼠标效果
  cursor: { type: String, default: 'inherit', },
  // 显示类型
  showType: { type: String, default: 'c', },
  // 显示类名
  tipClass: { type: String, default: '' },
  // 显示位置
  placement: { type: String, default: 'top' },
  // 显示距离
  offset: { type: [String, Number], default: 5 }
})

// ^


// # 二、模块功能
// # 1、遮罩的创建和移除
const EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'keydown', 'keyup', 'keypress']
const cIconRef = ref(null)
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

// # 三、机制
onMounted(() => {
  nextTick(() => {
    if (props.disabled && cIconRef.value) {
      createMask(cIconRef.value, 'c-icon-disabled-mask')
    }
    if (props.loading && cIconRef.value) {
      createMask(cIconRef.value, 'c-icon-loading-mask')
    }
  })
})
watch(() => props.disabled, (disabled) => {
  if (!cIconRef.value) return
  disabled ? createMask(cIconRef.value, 'c-icon-disabled-mask') : removeMask(cIconRef.value, 'c-icon-disabled-mask')
})

watch(() => props.loading, (loading) => {
  if (!cIconRef.value) return
  loading ? createMask(cIconRef.value, 'c-icon-loading-mask') : removeMask(cIconRef.value, 'c-icon-loading-mask')
})
// ^
</script>

<style lang="scss" scoped>
.c-icon {
  position: relative;
  display: inline-flex;
  margin-right: 5px;
  color: var(--color);
  font-size: var(--font-size);
  font-style: normal;
  font-weight: 400;
  cursor: var(--cursor);

  .svg-icon {
    font-size: inherit;
    outline: none;
    width: 1em;
    height: 1em;
    fill: currentColor;
    // vertical-align: -2px;
  }

  .svg-icon:hover~.icon-tip {
    display: block;
  }

  .icon-tip {
    position: absolute;
    display: none;
    top: -12px;
    left: 50%;
    white-space: nowrap;
    font-size: 12px;
    line-height: 1 !important;
    z-index: 9999;
  }

  &:not(.is-disabled):not(.is-loading):hover {
    * {
      color: var(--hoverColor);
    }
  }

  &.is-button {
    &:not(.is-disabled):not(.is-loading) {
      cursor: pointer !important;

      &:hover {
        transform: scale(1.05); // 轻微放大
      }
    }
  }

  &.is-disabled {
    opacity: 0.6;

    :deep(.c-icon-disabled-mask) {
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
    animation: breathAnim 1.6s ease-in-out infinite;

    :deep(.c-icon-loading-mask) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      cursor: wait;
      z-index: 9999;
    }

    // 呼吸动画
    @keyframes breathAnim {
      0% {
        transform: scale(1);
        opacity: 0.6;
      }

      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }

      100% {
        transform: scale(1);
        opacity: 0.6;
      }
    }
  }
}
</style>

<style lang="scss">
// 全局样式
.c-icon-tooltip {
  padding: 0;
  border: 0 !important;
  background-color: transparent !important;
  line-height: 1 !important;
  color: var(--fcp);

  .el-popper__arrow {
    display: none;
  }
}

.c-icon-popover {
  padding: 9px !important;
  line-height: 20px !important;
  border: 1px solid var(--tc) !important;
  color: var(--fcs);

  .el-popper__arrow {
    &::before {
      border: 1px solid var(--tc) !important;
    }
  }

  &.c-icon-info {
    .info {
      font-size: 14px;
      color: #FF6100;

      .info-item {
        display: flex;
        align-items: center;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
