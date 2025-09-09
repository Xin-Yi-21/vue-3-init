<template>
  <div class="c-card-title">
    <span v-if="icon === 'circle'" class="c-card-circle-icon out-circle" :style="`width:${outerSize}px;height:${outerSize}px;backgroundColor:${outerColor};`">
      <span class="inner-circle" :style="`width:${innerSize}px;height:${innerSize}px;backgroundColor:${innerColor};`"></span>
    </span>
    <span v-else-if="icon === 'rectangle'" class="c-card-rectangle-icon" :style="`width:${width}px;height:${height}px;backgroundColor:${bg};`"></span>
    <c-icon v-else-if="icon" :i="icon" class="c-card-title-icon"></c-icon>
    <span class="c-card-title-text">{{ title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  // icon图标
  icon: { type: String, default: '', },
  // 标题
  title: { type: String, default: '', },

  // 外圆颜色
  outerColor: { type: String, default: '', },
  // 内圆颜色
  innerColor: { type: String, default: '', },
  // 外圆大小
  outerSize: { type: [String, Number], default: 12, },
  // 内圆大小
  innerSize: { type: [String, Number], default: 6, },

  // 矩形背景色
  bg: { type: String, default: '', },
  // 矩形宽度
  width: { type: [String, Number], default: 5, },
  // 矩形高度
  height: { type: [String, Number], default: 20, }
})
</script>

<style lang="scss" scoped>
.c-card-title {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  height: 100%;

  .c-card-circle-icon {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    border-radius: 50%;
    background-color: var(--tc-alpha-20);

    .inner-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--tc);
    }
  }

  .c-card-rectangle-icon {
    position: relative;
    display: inline-block;
    width: 5px;
    height: 20px;
    margin-right: 5px;
    background-color: var(--tc);
  }

  .c-card-title-icon {
    flex-shrink: 0;
    font-size: calc(var(--cfs) + 4px);
    margin-left: 0;
    margin-right: 5px;
  }

  .c-card-title-text {
    color: var(--fcs);
    font-weight: 700;
    font-size: calc(var(--cfs) + 2px);
    white-space: nowrap;
  }
}
</style>