<template>
  <div :class="['c-loading', { 'fullscreen': fullscreen }]">
    <!-- <svg-icon icon-class="c-loading-circle" class-name="c-loading-icon c-loading-circle"></svg-icon> -->
    <svg-icon icon-class="c-loading-rocket" class-name="c-loading-icon c-loading-rocket"></svg-icon>
    <div class="c-loading-text">{{ text }}<span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <div class="c-loading-timeout" v-if="onCancel && isTimeOut">
      <span class="c-loading-timeout-tip"> 系统正在努力加载，操作可能不成功，是否取消等待？</span>
      <button class="c-loading-cancel-button" @click="cancelLoading" type="primary">取消加载</button>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/system/svg-icon'

// 接收绑定的目标元素作为 prop
const props = defineProps({
  target: {
    type: HTMLElement,
    required: true
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  text: {
    type: [String, Number],
    default: '加载中'
  },
  timeout: {
    type: Number,
    default: 10000
  },
  onCancel: { type: Function, default: null }
})


const timer = ref(null)

const isTimeOut = ref(false)
// 设置超时计时器
onMounted(() => {
  if (props.onCancel) {
    timer.value = setTimeout(() => {
      isTimeOut.value = true
    }, props.timeout)
  }
})
// 清理计时器
onBeforeUnmount(() => {
  if (props.onCancel) {
    clearTimeout(timer.value)
  }
})
// 取消加载操作
const cancelLoading = () => {
  if (props.onCancel) {
    props.onCancel()
  }
};
</script>

<style scoped lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

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

@keyframes scale {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }
}

.c-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-mask);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-mask);
    z-index: 9999;
  }

  .c-loading-icon {
    display: block;
    color: var(--tc);
    font-size: 30px;
    font-style: normal;
    margin-bottom: 10px;

    &.c-loading-circle {
      animation: rotate 3s linear infinite;
    }

    &.c-loading-rocket {
      animation: shake 2s ease-in-out infinite;
    }
  }

  .c-loading-text {
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

  .c-loading-timeout {
    margin-top: 10px;

    .c-loading-timeout-tip {
      font-size: 12px;
      color: var(--tca9);
    }

    .c-loading-cancel-button {
      height: 24px;
      margin-left: 10px;
      border: 1px solid var(--tc);
      border-radius: 4px;
      background-color: transparent;
      color: var(--tc);
      font-size: 12px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
