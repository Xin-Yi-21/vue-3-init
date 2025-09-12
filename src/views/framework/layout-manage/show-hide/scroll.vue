<template>
  <el-dialog v-model="visible" class="c-dialog" width="600" align-center draggable :close-on-click-modal="false">
    <template #header="{ close }">
      <div class="c-d-header">
        <div class="h-t"> 滚动展示 </div>
        <c-icon icon-class="c-close" class-name="n-o-i" @click="close"></c-icon>
      </div>
    </template>
    <div class="c-d-c">
      <div class="c-scroll-container-1">
        <Vue3SeamlessScroll ref="scrollRef1" :list="scrollData1" v-model="isScroll1" :hover="true" :wheel="true" direction="up" :step="0.5" singleLine :singleWaitTime="0" :delay="2000" @count="handleCount1">
          <template #default="{ data, index }">
            <div :class="['text', getClass1(data, index)]">{{ data.text }}</div>
          </template>
        </Vue3SeamlessScroll>
      </div>

      <c-scroll class="c-scroll-container-2" :scroll="isScroll2" scrollType="smooth" :stepTime="1000" :stayTime="0" @count="handleCount">
        <div :class="['text']" v-for="(item, index) in scrollData2">{{ item.text }}</div>
      </c-scroll>

      <c-scroll class="c-scroll-container-3" direction="x" scrollType="smooth" :stepLength="60" :stepTime="1000" :stayTime="0" @count="handleCount">
        <span :class="['text']" v-for="(item, index) in scrollData3">{{ item.text }}</span>
      </c-scroll>
    </div>
  </el-dialog>
</template>

<script setup>
// # 一、综合初始化
import { Vue3SeamlessScroll, VerticalScroll, HorizontalScroll } from 'vue3-seamless-scroll'
// ^

// # 二、模块功能
// # 0、初始化
const visible = ref(true)
// ^
// # 1、c-scroll-container-1相关
// # (1) 设置滚动数据
const isScroll1 = ref(true)
const scrollRef1 = ref(null)
const scrollData1 = ref([
  { id: 1, text: '《 水调歌头 》', },
  { id: 2, text: '· 苏轼', },
  { id: 3, text: '明月几时有？把酒问青天。', },
  { id: 4, text: '不知天上宫阙，今夕是何年。', },
  { id: 5, text: '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。', },
  { id: 6, text: '起舞弄清影，何似在人间。', },
  { id: 7, text: '转朱阁，低绮户，照无眠。', },
  { id: 8, text: '不应有恨，何事长向别时圆？', },
  { id: 9, text: '人有悲欢离合，月有阴晴圆缺，此事古难全。', },
  { id: 10, text: '但愿人长久，千里共婵娟。', },
])
// ^
// # (2) 设置特殊类名
function getClass1(data, index) {
  let className = []
  if (index === 0) {
    className.push('row-first')
  }
  if (index === scrollData1.value.length - 1) {
    className.push('row-last')
  }
  if (index === 1) {
    className.push('row-2')
  }
  return className.join(',')
}
// ^
// # (3) 设置周期后续
function handleCount1(count) {
  isScroll1.value = false
  setTimeout(() => {
    console.log('查scrollRef1.value', scrollRef1.value)
    isScroll1.value = true
  }, 2000)
}
// ^
// ^

// # 2、c-scroll-container-2相关
const isScroll2 = ref(true)
const scrollData2 = ref([
  { id: 1, text: '《 水调歌头 》', },
  { id: 2, text: '· 苏轼', },
  { id: 3, text: '明月几时有？把酒问青天。', },
  { id: 4, text: '不知天上宫阙，今夕是何年。', },
  { id: 5, text: '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。', },
  { id: 6, text: '起舞弄清影，何似在人间。', },
  { id: 7, text: '转朱阁，低绮户，照无眠。', },
  { id: 8, text: '不应有恨，何事长向别时圆？', },
  { id: 9, text: '人有悲欢离合，月有阴晴圆缺，此事古难全。', },
  { id: 10, text: '但愿人长久，千里共婵娟。', },
])
// 设置周期后续
function handleCount(count) {
  console.log('查count', count)
  setTimeout(() => {

  }, 2000)
}
// ^

// # 3、c-scroll-container-3相关
const scrollData3 = ref([
  { id: 1, text: '《 水调歌头 》 · 苏轼 明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。', },
])
// ^

// ^


</script>

<style lang="scss" scoped>
.c-dialog {
  .c-d-c {
    padding: 20px 20px 10px 10px;

    .c-scroll-container-1 {
      width: 100%;
      height: 210px;
      margin-bottom: 20px;
      background-color: #5589ff;
      overflow: hidden;

      .text {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 10px;
        text-align: center;
        box-sizing: border-box;
        color: #000;

        &.row-first {
          font-size: 16px;
          font-weight: 700;
        }

        &.row-2 {
          font-size: 12px;
          padding-left: 100px;
        }

        &.row-last {
          border-bottom: 1px solid #fff;
        }
      }
    }


    .c-scroll-container-2 {
      height: 210px;
      background-color: #5589ff;
      margin-bottom: 20px;

      .text {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 10px;
        text-align: center;
        box-sizing: border-box;
        color: #000;
      }
    }

    .c-scroll-container-3 {
      width: 100%;
      height: 30px;
      margin-bottom: 20px;
      background-color: #5589ff;
      white-space: nowrap;

      .text {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 10px;
        text-align: center;
        box-sizing: border-box;
        color: #000;
      }
    }
  }
}
</style>
