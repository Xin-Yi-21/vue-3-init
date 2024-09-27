<template>
  <div class="warn-vue">
    <div class="warn-left">
      <div class="warn-title">
        <svg-icon icon-class="warn" class-name=""></svg-icon>告警栏
      </div>
      <div class="warn-type">
        <span>缺失（{{ warnStat.miss }}）</span>
        <span>延迟（{{ warnStat.delay }}）</span>
      </div>
    </div>
    <div class="warn-info scroll-container">
      <div class="scroll-content" :style="{ transform: `translateY(-${scrollY}px)` }">
        <div class="warn-info-item" v-for="(item, index) in warnList" :key="index">
          <span class="info-time">{{ item.dataTime }}</span>
          <span class="info-text">{{ item.fileName }}</span>
          <span class="info-type">{{ item.timelinessName }} ！</span>
        </div>
      </div>
    </div>
    <div class="warn-right"> <svg-icon icon-class="setting" class-name="" @click="handleWarningSet"></svg-icon></div>
  </div>
</template>

<script setup>
import { warnStatGet, warnScrollListGet } from '@/api/common/warn'
import { get } from '@vueuse/core'
const { proxy } = getCurrentInstance()
const router = useRouter()
// 一、初始化相关
// 0、初始化总调用
function init() {
  getWarnStat()
  getWarnList()
}
init()
// 1、获取 告警统计
const warnStat = ref({ miss: 0, delay: 0 })
async function getWarnStat() {
  let params = {
    startTime: proxy.$dayjs().format('YYYY-MM-DD 00:00:00'),
    endTime: proxy.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
  const res = await warnStatGet(params)
  warnStat.value.miss = res.data.missNum || 0
  warnStat.value.delay = res.data.delayNum || 0
}
// 2、获取 告警列表
const warnList = ref([])
async function getWarnList() {
  let params = {
    startTime: proxy.$dayjs().format('YYYY-MM-DD 00:00:00'),
    endTime: proxy.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
  const res = await warnScrollListGet(params)
  warnList.value = res.data || []
  // console.log('告警列表', res.data)
}
// 3、滚动相关
const scrollY = ref(0)
const itemHeight = 40 // 每个项的高度
const interval = 2000 // 滚动间隔时间
const startScrolling = () => {
  setInterval(() => {
    scrollY.value += itemHeight
    if (scrollY.value >= warnList.value.length * itemHeight) {
      scrollY.value = 0 // 重置
    }
  }, interval)
}
onMounted(startScrolling)
// 二、操作相关
// 1、跳转告警设置
function handleWarningSet() {
  router.push('/warning')
}

</script>

<style scoped lang="scss">
.scroll-container {
  height: 40px;
  overflow: hidden;
  position: relative;

  .scroll-content {
    transition: transform 0.5s ease;
  }

  .warn-info-item {
    height: 40px;
  }
}

.warn-vue {
  position: relative;
  height: 40px;
  background: #FDF0F0;
  display: flex;
  align-items: center;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);

  .warn-left {
    display: flex;
    flex-shrink: 0;

    .warn-title {
      margin-right: 20px;
      color: #FF4D4F;

      .svg-icon {
        margin: 0 10px;
      }
    }

    .warn-type {
      font-weight: 700;

      span {
        padding: 0 5px;
      }
    }

  }

  .warn-info {
    flex: 1;
    text-align: center;
    font-weight: 700;
    height: 100%;
    margin-right: 60px;

    .warn-info-item {
      width: 100%;
      height: 100%;
      line-height: 40px;
      font-weight: 400;
    }

    .info-time,
    .info-text {
      margin-right: 20px;
    }

    .info-type {
      color: #ff4d4f;
    }
  }

  .warn-right {
    width: 50px;
    flex-shrink: 0;
    text-align: right;
    position: absolute;
    right: 20px;
    top: 12px;

    .svg-icon {
      cursor: pointer;
      font-size: 16px;
      width: 30px;
    }

  }
}
</style>
