<template>
  <div class="top-header-vue">
    <div class="project">
      <c-icon i="c-logo" cursor="auto" size="24"></c-icon>
      <div class="title">项目初始化系统</div>
      <Breadcrumb v-if="settingStore.topHeader.isBreadcrumbShow" separator=">" class="breadcrumb-container" />
    </div>

    <div class="menu"> </div>

    <div class="time" v-html="time"></div>
    <!-- <div class="user-name"><c-icon i="c-account"></c-icon> <span>admin</span></div> -->
    <el-dropdown @command="handleCommand" class="setting" trigger="click" append-to-body="true">
      <div class="avatar">
        <img :src="userStore.avatar" />
        <span class="name">admin</span>
        <el-icon><caret-bottom /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <c-icon i="c-account"></c-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item command="userManage">
            <c-icon i="c-user-manage"></c-icon>
            <span>用户管理</span>
          </el-dropdown-item>
          <el-dropdown-item command="layoutSet">
            <c-icon i="c-layout"></c-icon>
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <c-icon i="c-logout"></c-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
// 一、综合初始化
import useUserStore from '@/store/system/user'
import useSettingStore from '@/store/system/setting'
import Breadcrumb from '@/components/system/breadcrumb'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const settingStore = useSettingStore()
const router = useRouter()
function init() {
  initTime()
}
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
// 二、模块功能
// 1、运行时间
const weekdayLRV = { Monday: '星期一', Tuesday: '星期二', Wednesday: '星期三', Thursday: '星期四', Friday: '星期五', Staturday: '星期六', Sunday: '星期日' }
const time = ref('')
const timer = ref(null)
function initTime() {
  time.value = proxy.$dayjs().format('YYYY-MM-DD') + ' ' + weekdayLRV[proxy.$dayjs().format('dddd')] + ' ' + proxy.$dayjs().format('HH:mm:ss')
}
timer.vlaue = setInterval(() => { initTime() }, 1000)

// 2、处理dropdown
// (0) 综合
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
</script>
<style lang="scss" scoped>
.top-header-vue {
  display: flex;
  align-items: center;
  // background-image: url(@/assets/images/bg-header.png);
  // background-repeat: no-repeat;
  // background-size: cover;
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

    :deep(.svg-icon) {
      margin: 0 10px;
      color: var(--fcpl);
      font-size: 24px !important;
    }

    .title {
      display: flex;
      align-items: center;
      color: var(--fcpl);
      font-weight: 700;
      font-size: 30px;
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
  }


  .time {
    margin-right: 50px;
    color: var(--fcs);
    font-family: PingFang SC, PingFang SC;
    font-weight: 800;
    font-size: 20px;
    line-height: 28px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.33);
  }

  .user-name {
    display: flex;
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
