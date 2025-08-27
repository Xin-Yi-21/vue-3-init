<template>
  <div class="top-header-container">
    <div class="project">
      <c-icon i="c-show-logo" cursor="auto" size="24"></c-icon>
      <div class="title">项目初始化系统</div>
      <!-- <Breadcrumb v-if="settingStore.topHeader.isBreadcrumbShow" separator=">" class="breadcrumb-container" /> -->
    </div>

    <div class="menu">
      <top-nav v-if="settingStore.topNav.isShow"></top-nav>
    </div>

    <div class="time" v-html="time"></div>

    <el-dropdown @command="handleCommand" class="setting" trigger="click" append-to-body="true">
      <div class="avatar">
        <img :src="userStore.avatar" />
        <span class="name">admin</span>
        <el-icon><caret-bottom /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <c-icon i="c-show-account"></c-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item command="userManage">
            <c-icon i="c-menu-user"></c-icon>
            <span>用户管理</span>
          </el-dropdown-item>
          <el-dropdown-item command="layoutSet">
            <c-icon i="c-show-layout"></c-icon>
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <c-icon i="c-operate-logout"></c-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
// 一、综合
// 插件
import 'dayjs/locale/zh-cn'
// 组件
// import Breadcrumb from '@/components/f-breadcrumb'
import TopNav from '@/layout/components/top/top-nav'
// pinia
import useStore from '@/store'
// 声明
const { userStore, settingStore } = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

// # 二、模块功能
// # 1、初始化
function init() {
  initTime()
}
// ^
// # 2、运行时间
// const weekdayLRV1 = { Monday: '周一', Tuesday: '周二', Wednesday: '周三', Thursday: '星期四', Friday: '星期五', Saturday: '星期六', Sunday: '星期日' }
const weekdayLRV = { '星期一': '周一', '星期二': '周二', '星期三': '周三', '星期四': '周四', '星期五': '周五', '星期六': '周六', '星期日': '周日' }
const time = ref('')
const timer = ref(null)
function initTime() {
  time.value = proxy.$dayjs().format('YYYY-MM-DD') + ' ' + (weekdayLRV[proxy.$dayjs().format('dddd')] || '') + ' ' + proxy.$dayjs().format('HH:mm:ss')
}
timer.vlaue = setInterval(() => { initTime() }, 1000)
// ^
// # 3、处理dropdown
const handleCommand = command => {
  switch (command) {
    case "profile":
      goProfile()
      break
    case "layoutSet":
      setLayout()
      break
    case "logout":
      logout()
      break
  }
}
// (1) 个人中心
function goProfile() {
  router.push('/user/profile')
}
// (2) 布局设置
const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout')
}
// (3) 登出
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index'
    })
  }).catch(() => { })
}
// ^
// ^

// # 三、机制
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
// ^
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'TitleFont';
  src: url('@/assets/fonts/title.ttf');
  font-weight: normal;
  font-style: normal;
}

.top-header-container {
  display: flex;
  align-items: center;
  background-color: var(--bg-topHeader);
  font-size: 14px;

  &.is-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  .project {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 0 10px;

    :deep(.svg-icon) {
      color: var(--fcpl);
      font-size: 24px !important;
    }

    .title {
      display: flex;
      align-items: center;
      color: var(--fcpl);
      font-size: 30px;
      font-weight: 700;
      font-family: 'TitleFont';
      letter-spacing: 2px;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.33);
    }

    .breadcrumb-container {
      margin-left: 10px;
      font-size: 14px;

      &::before {
        // content: '>';
        margin-right: 10px;
        color: var(--fcs);
        font-size: 14px;
      }

      .el-breadcrumb__inner {
        a {
          color: var(--fcs);
        }

        .no-redirect {
          color: var(--fcs);
        }
      }

      .el-breadcrumb__separator {
        color: var(--fcs);
      }
    }
  }

  .menu {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }


  .time {
    flex-shrink: 0;
    margin-right: 30px;
    color: var(--tc);
    font-weight: 800;
    font-size: 20px;
    line-height: 28px;

  }

  .user-name {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-right: 50px;
  }

  .setting {
    margin-right: 10px;
    cursor: pointer;

    &:hover {
      img {
        scale: 1.1;
      }
    }

    .avatar {
      display: flex;
      align-items: center;
      height: 40px;

      img {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        padding: 2px;
        border: 2px solid var(--fcpl);
        border-radius: 50%;
        background-color: #fff;
      }

      >span {
        margin-right: 10px;
        color: var(--fcpl);
      }

      .el-icon {
        display: none;
      }
    }
  }
}

:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;

    &>span {
      margin-right: 5px;
    }
  }

  .line {
    width: 100%;
    height: 1px;
    margin: 5px 0;
    background-color: var(--bcp);
  }
}
</style>
