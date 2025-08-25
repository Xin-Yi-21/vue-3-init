<template>
  <div ref="cScrollRef" :class="['c-scroll', { 'hide-scrollbar': !scrollBar }, direction === 'x' ? 'x-direction' : 'y-direction']" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
    <slot></slot>
  </div>
</template>

<script setup>
// # 一、综合
// props
const props = defineProps({
  // 滚动类型：jump和smooth
  scrollType: { type: String, default: 'jump' },
  // 滚动方向
  direction: { type: String, default: 'y', validator: (value) => ['x', 'y'].includes(value) },
  // 是否开启滚动
  scroll: { type: Boolean, default: true },
  // 是否显示滚动条
  scrollBar: { type: Boolean, default: true },
  // 是否开启悬浮暂停
  hover: { type: Boolean, default: true },
  // 是否开启滑轮控制
  wheel: { type: Boolean, default: true },
  // 单位滚动步长
  stepLength: { type: [Number, String], default: 30 },
  // 单位滚动步时
  stepTime: { type: [Number, String], default: 1000 },
  // 单位停留时间
  stayTime: { type: [Number, String], default: 2000 },
  // 初次滚动延迟
  firstDelay: { type: [Number, String], default: 1000 },
  // 循环滚动延迟
  cycleDelay: { type: [Number, String], default: 2000 }
})
// emit
const emit = defineEmits(['count'])
// ^

// # 二、模块功能
// # 1、初始化
const cScrollRef = ref(null)
let scrollTimer = null
let scrollCount = 0
let isHovering = false
function init() {
  cScrollRef.value.addEventListener('wheel', handleWheel, { passive: false })
  if (props.scroll) {
    setTimeout(startScrolling, props.firstDelay)
  }
}
// ^
// # 2、开启滚动
function startScrolling() {
  if (props.scrollType === 'smooth') {
    smoothScroll()
  } else {
    jumpScroll()
  }
}
// ^
// # 3、停止滚动
function stopScrolling() {
  clearInterval(scrollTimer)
  scrollTimer = null
}
// ^
// # 4、跳跃滚动：每1stepTime滚动1次，滚动距离为1stepLength，停留1stayTime。
function jumpScroll() {
  stopScrolling()
  scrollTimer = setInterval(() => {
    if (isHovering) return
    const scrollDistance = props.direction === 'y' ? cScrollRef.value?.scrollTop : cScrollRef.value?.scrollLeft
    const maxScroll = props.direction === 'y' ? cScrollRef.value?.scrollHeight - cScrollRef.value?.clientHeight : cScrollRef.value?.scrollWidth - cScrollRef.value?.clientWidth

    if (scrollDistance >= maxScroll) {
      stopScrolling()
      if (cScrollRef.value) {
        cScrollRef.value[props.direction === 'y' ? 'scrollTop' : 'scrollLeft'] = 0
        scrollCount++
        emit('count', scrollCount)
        setTimeout(startScrolling, props.cycleDelay)
      }
    } else {
      if (cScrollRef.value) {
        cScrollRef.value[props.direction === 'y' ? 'scrollTop' : 'scrollLeft'] += props.stepLength
      }
    }
  }, props.stepTime + props.stayTime)
}
// ^
// # 5、平滑滚动：每1stepTime滚动n次，总滚动距离为1stepLength，停留1stayTime。
function smoothScroll() {
  stopScrolling()
  const stepInterval = Math.max(props.stepTime / props.stepLength, 1) // 每滚动1px所需时间
  let scrolled = 0
  scrollTimer = setInterval(() => {
    if (isHovering) return
    const scrollDistance = props.direction === 'y' ? cScrollRef.value?.scrollTop : cScrollRef.value?.scrollLeft
    const maxScroll = props.direction === 'y' ? cScrollRef.value?.scrollHeight - cScrollRef.value?.clientHeight : cScrollRef.value?.scrollWidth - cScrollRef.value?.clientWidth

    if (scrollDistance >= maxScroll) {
      stopScrolling()
      setTimeout(() => {
        if (cScrollRef.value) {
          cScrollRef.value[props.direction === 'y' ? 'scrollTop' : 'scrollLeft'] = 0
          scrollCount++
          emit('count', scrollCount)
          setTimeout(startScrolling, props.cycleDelay)
        }
      }, props.stayTime)
    } else {
      if (cScrollRef.value) {
        cScrollRef.value[props.direction === 'y' ? 'scrollTop' : 'scrollLeft'] += 1
      }
      scrolled++
      if (scrolled >= props.stepLength) {
        clearInterval(scrollTimer)
        setTimeout(startScrolling, props.stayTime)
      }
    }
  }, stepInterval)
}
// function smoothScroll2() {
//   stopScrolling()
//   const directionProp = props.direction === 'y' ? 'scrollTop' : 'scrollLeft'
//   const maxScroll = props.direction === 'y' ? cScrollRef.value.scrollHeight - cScrollRef.value.clientHeight : cScrollRef.value.scrollWidth - cScrollRef.value.clientWidth

//   // 使用时间戳动画驱动
//   const startValue = cScrollRef.value[directionProp]
//   const targetValue = Math.min(startValue + props.stepLength, maxScroll)
//   const startTime = performance.now()

//   const animate = () => {
//     if (isHovering) return
//     const elapsed = performance.now() - startTime
//     const progress = Math.min(elapsed / props.stepTime, 1)
//     // 使用缓动函数提升平滑度
//     const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress))
//     const currentValue = startValue + (targetValue - startValue) * easedProgress
//     // 批量更新滚动位置
//     cScrollRef.value[directionProp] = currentValue
//     if (progress < 1) {
//       requestAnimationFrame(animate)
//     } else {
//       // 边界检测
//       const finalPosition = cScrollRef.value[directionProp]
//       if (finalPosition >= maxScroll - 1) {
//         // 使用原生平滑滚动回到顶部
//         cScrollRef.value.scrollTo({ [props.direction === 'y' ? 'top' : 'left']: 0, behavior: 'smooth' })
//         scrollCount++
//         emit('count', scrollCount)
//         stopScrolling()
//         setTimeout(startScrolling, props.cycleDelay)
//       } else {
//         setTimeout(startScrolling, props.stayTime)
//       }
//     }
//   }
//   requestAnimationFrame(animate)
// }
// ^
// # 6、鼠标悬浮处理
function handleHover(isEntering) {
  if (props.hover) {
    isHovering = isEntering
    if (isEntering) {
      stopScrolling()
    } else if (props.scroll) {
      startScrolling()
    }
  }
}
// ^
// # 7、滑轮滚动处理
function handleWheel(event) {
  if (!props.wheel) {
    event.preventDefault()
  } else {
    stopScrolling()
    if (props.direction === 'x') {
      cScrollRef.value.scrollLeft += event.deltaY
    } else {
      cScrollRef.value.scrollTop += event.deltaY
    }
  }
}
// ^
// ^

// # 三、生命周期
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  cScrollRef.value?.removeEventListener('wheel', handleWheel)
  stopScrolling()
})
// ^

</script>

<style lang="scss" scoped>
.c-scroll {
  width: 100%;
  height: 100%;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: content;

  &.x-direction {
    overflow-x: auto;
    overflow-y: hidden;
  }

  &.y-direction {
    overflow-x: hidden;
    overflow-y: auto;
  }

  &.hide-scrollbar {
    &::-webkit-scrollbar {
      display: none !important;
    }
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--tc);
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
</style>
