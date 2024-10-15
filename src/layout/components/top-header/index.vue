<template>
  <div class="top-header-vue">
    <div class="project">
      <c-icon i="c-logo" color="#0ff" cursor="auto"></c-icon>
      <div class="title">项目初始化系统</div>
    </div>

    <div class="menu"> </div>

    <div class="time" v-html="time"></div>
    <!-- <div class="user-name"><c-icon i="c-account"></c-icon> <span>admin</span></div> -->
    <el-dropdown @command="handleCommand" class="setting" trigger="click">
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
  import useUserStore from '@/store/system/user'
  const { proxy } = getCurrentInstance()
  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  // 一、初始化相关
  // 1、运行时间
  const weekdayLRV = { Monday: '星期一', Tuesday: '星期二', Wednesday: '星期三', Thursday: '星期四', Friday: '星期五', Staturday: '星期六', Sunday: '星期日' }
  const time = ref('')
  const timer = ref(null)
  const timeStart = () => {
    time.value = proxy.$dayjs().format('YYYY-MM-DD') + ' ' + weekdayLRV[proxy.$dayjs().format('dddd')] + ' ' + proxy.$dayjs().format('HH:mm:ss')
  }
  timeStart()
  timer.vlaue = setInterval(() => {
    timeStart()
  }, 1000)
  onBeforeUnmount(() => {
    clearInterval(timer)
  })
  // 二、操作相关

  // 1、点击tab
  const handleTabChange = tab => {
    currentTab.value = tab
    router.push('/' + tab)
  }
  // 2、点击设置
  const handleCommand = command => {
    switch (command) {
      case "profile":
        goProfile()
        break;
      case "setLayout":
        setLayout()
        break;
      case "logout":
        logout()
        break;
      default: break;
    }
  }
  // 3、个人中心
  function goProfile() {
    router.push('/user/profile')
  }
  // 4、布局设置
  function setLayout() {
    // emits('setLayout')
  }
  // 5、登出
  function logout() {
    ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logOut().then(() => {
        location.href = '/index';
      })
    }).catch(() => { });
  }



</script>
<style lang="scss" scoped>
.top-header-vue {
  height: 60px;
  display: flex;
  align-items: center;
  // background-image: url(@/assets/images/bg-header.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: skyblue;
  font-size: 14px;

  .project {
    display: flex;
    align-items: center;

    :deep(.svg-icon) {
      font-size: 24px !important;
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
    }
  }

  .menu {
    flex: 1;
  }


  .time {
    font-family: PingFang SC, PingFang SC;
    font-weight: 800;
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.33);
    margin-right: 50px;
  }

  .user-name {
    display: flex;
    align-items: center;
    margin-right: 50px;
    // vertical-align: middle;
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
      height: 40px;
      display: flex;
      align-items: center;

      img {
        width: 36px;
        height: 36px;
        padding: 2px;
        border-radius: 50%;
        /* 确保头像是圆形 */
        border-radius: 50%;
        border: 2px solid #333;
        margin-right: 10px;
      }

      >span {
        margin-right: 10px;
      }
    }
  }
}
</style>
