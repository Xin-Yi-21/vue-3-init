<template>
  <div class="header-vue">
    <div class="part-1">
      <svg-icon icon-class="logo" class-name="logo"></svg-icon>
      <div class="title">项目初始化系统</div>
    </div>
    <div class="part-2 header-tab">
      <div :class="['header-tab-item', currentTab === 'production-monitor' ? 'active' : '']" @click="handleTabChange('production-monitor')">生产监管</div>
      <div :class="['header-tab-item', currentTab === 'forecast-result' ? 'active' : '']" @click="handleTabChange('forecast-result')">预报结果</div>
      <div :class="['header-tab-item', currentTab === 'forecast-test' ? 'active' : '']" @click="handleTabChange('forecast-test')">预报检验</div>
    </div>
    <div class="part-3">
      <!-- {{ time }} -->
      <div class="header-time" v-html="time"></div>
    </div>
    <div class="part-4">
      <span class="account">
        <svg-icon icon-class="account" class-name=""></svg-icon>
        <span>admin</span>
      </span>
      <span class="post">xx岗位</span>
    </div>
    <div class="part-5 logout">退出</div>
  </div>
</template>
<script setup>
  const { proxy } = getCurrentInstance()
  const router = useRouter()
  const route = useRoute()
  // 一、初始化相关
  // 1、运行时间
  const weekdayLRV = { Monday: '星期一', Tuesday: '星期二', Wednesday: '星期三', Thursday: '星期四', Friday: '星期五', Staturday: '星期六', Sunday: '星期日' }
  const time = ref('')
  const timer = ref(null)
  // const currentTab = ref('production-monitor')
  const currentTab = ref(route.meta.firstMenu?.slice(1))
  const timeStart = () => {
    time.value = proxy.$dayjs().format('YYYY-MM-DD') + ' ' + weekdayLRV[proxy.$dayjs().format('dddd')] + ' ' + proxy.$dayjs().format('HH:mm:ss')
  }
  timeStart()
  timer.vlaue = setInterval(() => {
    timeStart()
  }, 1000)
  // 二、操作相关
  // 1、点击tab
  const handleTabChange = tab => {
    currentTab.value = tab
    router.push('/' + tab)
  }
  onBeforeUnmount(() => {
    clearInterval(timer)
  })
</script>
<style lang="scss" scoped>
.header-vue {
  height: 70px;
  display: flex;
  align-items: center;
  background-image: url(@/assets/images/bg-header.png);
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 14px;

  .part-1 {
    display: flex;
    align-items: center;

    .logo {
      font-size: 40px;
      margin: 0 10px;
    }

    .title {
      display: flex;
      align-items: center;
      font-family: PingFang SC, PingFang SC;
      font-weight: 800;
      font-size: 30px;
      color: #ffffff;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.33);
      transform: translateY(-3px);

      i {
        font-size: 20px;
        font-style: normal;
        padding: 0 5px;
      }

      span {
        color: #ffdd00;
        padding-right: 20px;
      }
    }
  }

  .part-2,
  .head-tab {
    display: flex;
    flex: 1;
    justify-content: center;

    .header-tab-item {
      padding: 5px 15px;
      font-size: 18px;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
      margin: 0 10px;

      &.active {
        background-color: #ffa033;
        font-weight: 500;
        border-radius: 4px;
      }
    }
  }

  .part-3 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 800;
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.33);
    margin-right: 50px;
  }

  .part-4 {
    display: flex;
    align-items: center;
    margin-right: 50px;
    vertical-align: middle;

    .account,
    .post {
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      color: #fff;
      padding: 0 15px;

      .svg-icon {
        margin: 0 5px;
      }
    }

    .account {
      border-right: 1px solid #fff;
    }
  }

  .part-5 {
    margin-right: 40px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    transform: translateY(-3px);
  }
}
</style>
