<template>
  <div :class="['c-loading', { fullscreen }]">
    <template v-if="type === 'rocket' && showAnim">
      <c-icon i="c-show-loading-rocket" class="loading-icon"></c-icon>
      <div class="loading-text"> {{ text }} <span class="dot" v-for="n in 3" :key="n"></span> </div>
      <div v-if="onCancel && isTimeOut" class="loading-timeout">
        <span class="loading-timeout-tip"> 系统正在努力加载，操作可能不成功，是否取消等待？ </span>
        <button class="loading-cancel-button" @click.stop="cancelLoading"> 取消加载 </button>
      </div>
    </template>

    <template v-else>
      <div v-if="onCancel && isTimeOut" class="timeout">
        <el-popover placement="top" trigger="hover" :teleported="true" popper-class="c-popover">
          <template #default>
            <div class="loading-timeout">
              <span class="loading-timeout-tip"> 系统正在努力加载，操作可能不成功，是否取消等待？ </span>
              <button class="loading-cancel-button" @click.stop="cancelLoading"> 取消加载 </button>
            </div>
          </template>
          <template #reference>
            <c-icon i="c-show-attention" class="warning-icon" />
          </template>
        </el-popover>
      </div>
    </template>
  </div>
</template>

<script setup>
// # 一、综合
import { ElPopover } from 'element-plus'
const props = defineProps({
  // 目标元素
  target: { type: HTMLElement, required: true },
  // 是否全屏
  fullscreen: { type: Boolean, default: false },
  // 是否禁用事件
  disabled: { type: Boolean, default: true },
  // 是否显示动画
  showAnim: { type: Boolean, default: true },
  // 加载效果
  type: { type: String, default: 'rocket' },
  // 火箭加载文字
  text: { type: [String, Number], default: '加载中' },
  // 最大加载时间
  maxTime: { type: Number, default: 10000 },
  // 取消加载回调函数
  onCancel: { type: Function, default: null },
})
// ^

// # 二、模块功能
// # 1、增删类名
function addLoadingClass() {
  if (!props.target) return
  props.target.classList.add('c-loading-target')
  props.target.classList.add(`c-loading-${props.type}`)
}

function removeLoadingClass() {
  if (!props.target) return
  props.target.classList.remove('c-loading-target')
  props.target.classList.remove(`c-loading-${props.type}`)
}

// ^
// # 2、禁用事件
const EVENTS = [
  'click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'contextmenu',
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'keydown', 'keyup', 'keypress'
]
function handleEvent(e) {
  if (e.target.closest('.loading-cancel-button')) return
  if (e.target.closest('.warning-icon')) return
  e.stopImmediatePropagation()
  e.stopPropagation()
  e.preventDefault()
}
function addListeners() {
  if (!props.target) return
  EVENTS.forEach(evt => props.target.addEventListener(evt, handleEvent, true))
}
function removeListeners() {
  if (!props.target) return
  EVENTS.forEach(evt => props.target.removeEventListener(evt, handleEvent, true))
}
// ^
// # 3、取消加载
function cancelLoading() {
  if (props.onCancel) props.onCancel()
}
// ^
// ^

// # 三、机制
const isTimeOut = ref(false)
let timer = null
onMounted(() => {
  addLoadingClass()
  if (props.onCancel) {
    timer = setTimeout(() => {
      isTimeOut.value = true
    }, props.maxTime)
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  removeLoadingClass()
  removeListeners()
})
watch(() => props.disabled, (nv, ov) => {
  if (!props.target) return
  if (nv) {
    addListeners()
  } else {
    removeListeners()
  }
}, { immediate: true })
// ^
</script>

<style lang="scss">
// 全局样式
.c-loading-target {
  .c-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: wait;
    pointer-events: auto;
    color: var(--tc);

    &.fullscreen {
      position: fixed;
      z-index: 9999;
    }
  }

  // 火箭效果
  &.c-loading-rocket {
    z-index: 1;

    >.c-loading {
      background: var(--bg-mask);

      .loading-icon {
        display: block;
        color: var(--tc);
        font-size: 30px;
        font-style: normal;
        margin-bottom: 10px;
        animation: shake 2s ease-in-out infinite;
      }

      .loading-text {
        display: block;
        color: var(--tc);
        font-size: 15px;
        font-weight: 700;

        .dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: var(--tc);
          animation: scale 2.1s infinite ease-in-out;
          display: inline-block;
          margin: 0 5px;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.7s;
        }

        .dot:nth-child(3) {
          animation-delay: 1.4s;
        }
      }

      .loading-timeout {
        margin-top: 10px;
        color: var(--tc-alpha-90);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 10px;

        .loading-cancel-button {
          border: 1px solid var(--tc);
          background: transparent;
          color: var(--tc);
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

  }

  // 内容流动效果
  &.c-loading-content-flow {
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg,
          transparent 0%,
          rgba(var(--tcrgb), 0.1) 40%,
          rgba(var(--tcrgb), 0.2) 50%,
          rgba(var(--tcrgb), 0.1) 60%,
          transparent 100%);
      background-size: 200% 100%;
      background-repeat: no-repeat;
      z-index: -1;
      animation: contentFlowAnim 2s linear infinite;
    }
  }

  // 边框流动效果
  &.c-loading-border-flow {
    position: relative;
    overflow: visible;

    --block-width: 20px;
    --block-height: 2px;

    &::after {
      content: '';
      position: absolute;
      pointer-events: none;
      z-index: 9999;

      /* 尺寸和初始位置 */
      width: var(--block-width);
      height: var(--block-height);
      top: 0;
      left: 0;

      /* 柔和青色渐变 */
      background: linear-gradient(90deg,
          #0ff,
          #3ef9f9,
          #0ff);

      /* 弱化发光，青色调 */
      box-shadow:
        0 0 4px rgba(0, 255, 255, 0.5),
        0 0 8px rgba(62, 249, 249, 0.4),
        0 0 12px rgba(0, 255, 255, 0.3);

      animation: borderFlowAnim 4s linear infinite;
    }
  }


  // 呼吸效果
  &.c-loading-breath {
    animation: breathAnim 1.6s ease-in-out infinite;
  }

  .warning-icon {
    position: absolute;
    top: -5px;
    right: -5px;
    color: red;
    font-size: 10px;
    z-index: 9999;
    cursor: pointer;
  }

  // 火箭抖动动画
  @keyframes shake {

    0%,
    100% {
      transform: translateY(0);
    }

    25% {
      transform: translateY(-5px);
    }

    50% {
      transform: translateY(5px);
    }

    75% {
      transform: translateY(-5px);
    }
  }

  // 圆圈缩放动画
  @keyframes scale {

    0%,
    100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.5);
    }
  }

  // 内容流动动画
  @keyframes contentFlowAnim {
    0% {
      background-position: 100% 0%;
    }

    100% {
      background-position: 0% 0%;
    }
  }

  // 边框流动动画
  @keyframes borderFlowAnim {
    0% {
      top: 0;
      left: 0;
      width: var(--block-width);
      height: var(--block-height);
    }

    25% {
      top: 0;
      left: calc(100% - var(--block-width));
      width: var(--block-width);
      height: var(--block-height);
    }

    26% {
      top: 0;
      left: calc(100% - var(--block-height));
      width: var(--block-height);
      height: var(--block-width);
    }

    50% {
      top: calc(100% - var(--block-width));
      left: calc(100% - var(--block-height));
      width: var(--block-height);
      height: var(--block-width);
    }

    51% {
      top: calc(100% - var(--block-height));
      left: calc(100% - var(--block-width));
      width: var(--block-width);
      height: var(--block-height);
    }

    75% {
      top: calc(100% - var(--block-height));
      left: 0;
      width: var(--block-width);
      height: var(--block-height);
    }

    76% {
      top: calc(100% - var(--block-width));
      left: 0;
      width: var(--block-height);
      height: var(--block-width);
    }

    99% {
      top: 0;
      left: 0;
      width: var(--block-height);
      height: var(--block-width);
    }

    100% {
      top: 0;
      left: 0;
      width: var(--block-width);
      height: var(--block-height);
    }
  }

  // 呼吸动画
  @keyframes breathAnim {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.1);
      opacity: 0.95;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
<style lang="scss">
// 全局样式
.c-popover {
  .loading-timeout {
    color: var(--tc-alpha-90);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 370px;

    .loading-cancel-button {
      border: 1px solid var(--tc);
      background: transparent;
      color: var(--tc);
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>