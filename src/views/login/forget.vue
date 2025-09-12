<template>
  <div class="forget-container">
    <div class="forget-content">
      <div class="tab">
        <div :class="['tab-item', currentTab === 'phone' ? 'active' : '']" @click="handleTabChange('phone')">手机号验证</div>
        <div :class="['tab-item', currentTab === 'email' ? 'active' : '']" @click="handleTabChange('email')">邮箱验证</div>
      </div>
      <el-form :model="form" :rules="formRules" ref="formRef">
        <div class="phone-verify" v-if="currentTab === 'phone'">
          <el-form-item prop="phone" label="">
            <el-input v-model="form.phone" type="text" auto-complete="off" placeholder="请输入手机号">
              <c-icon slot="prefix" i="phone" class="input-icon phone-svg" />
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" label="">
            <el-input v-model="form.verifyCode" type="text" auto-complete="off" placeholder="请输入手机验证码" @keyup.enter.native="handleLogin">
              <c-icon slot="prefix" i="code" class="input-icon code-svg" />
            </el-input>
            <el-button class="verify-code-button" @click="handleSendPhoneCode" :disabled="typeof (phone.verifyCodeText) === 'number'">{{ phone.verifyCodeText }}</el-button>
          </el-form-item>
        </div>
        <div class="email-verify" v-if="currentTab === 'email'">
          <el-form-item prop="email" label="">
            <el-input v-model="form.email" type="text" auto-complete="off" placeholder="请输入邮箱">
              <c-icon slot="prefix" i="email" class="input-icon email-svg" />
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" label="">
            <el-input v-model="form.verifyCode" type="text" auto-complete="off" placeholder="请输入邮箱验证码" @keyup.enter.native="handleLogin">
              <c-icon slot="prefix" i="code" class="input-icon code-svg" />
            </el-input>
            <el-button class="verify-code-button" @click="handleSendEmailCode" :disabled="typeof (email.verifyCodeText) === 'number'">{{ email.verifyCodeText }}</el-button>
          </el-form-item>
        </div>
        <div class="link-part">
          <el-button class="next-button" @click="handleNextStep">下一步</el-button>
        </div>
        <div class="back-to-login" @click="handleBackToLogin">返回登录页</div>
      </el-form>
    </div>

  </div>
</template>

<script>
// import { phoneCodeForgetGet, emailCodeForgetGet, userForgetVerify, } from '@/api/common/login'
import { regular } from '@/utils/regular'
const emailVerify = (rule, value, callback) => {
  if (!value) {
    callback(new Error('邮箱不能为空'))
  } else if (!regular.email.test(value)) {
    callback(new Error('请输入正确格式的邮箱'))
  } else {
    callback()
  }
}
const mobileVerify = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'))
  } else if (!regular.mobile.test(value)) {
    callback(new Error('请输入正确格式的手机号'))
  } else {
    callback()
  }
}
export default {
  data() {
    return {
      currentTab: 'phone',
      form: {
        phone: '',
        email: '',
        verifyCode: ''
      },
      formRules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入您的手机号' }, { validator: mobileVerify, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', message: '请输入您的邮箱' }, { validator: emailVerify, trigger: 'blur' }],
        verifyCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
      },
      phone: {
        timer: null,
        verifyCodeText: '发送验证码',
      },
      email: {
        timer: null,
        verifyCodeText: '发送验证码',
      },
    }
  },
  beforeDestroy() {
    if (this.phone.timer) clearInterval(this.phone.timer)
    if (this.email.timer) clearInterval(this.email.timer)
  },
  methods: {
    // 二、操作相关
    // 1、选择验证方式
    handleTabChange(currentTab) {
      this.currentTab = currentTab
      this.$refs.formRef.resetFields()          // 重置表单
      this.$refs.formRef.clearValidate()        // 清除表单验证
    },
    // 2、发送手机验证码
    handleSendPhoneCode() {
      this.$refs.formRef.validateField('phone', (errMsg) => {
        if (errMsg) return false
        if (this.phone.timer) clearInterval(this.phone.timer)
        this.phone.verifyCodeText = 60
        this.phone.timer = setInterval(() => {
          if (this.phone.verifyCodeText > 1) {
            this.phone.verifyCodeText--
          } else {
            clearInterval(this.phone.timer)
            this.phone.verifyCodeText = '发送验证码'
          }
        }, 1000)
        let params = { phone: this.form.phone }
        phoneCodeForgetGet(params).then(res => {
          // console.log('%c【API D⭐】描述：忘记密码 发送手机验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/userController/phoneVerification', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          if (res.code === 200) {
            this.$message.success('手机验证码已发送，请前往手机短信查收！')
          } else if (res.code === 0) {
            this.$message.error(res.data)
          }
        })
      })

    },
    // 3、发送邮箱验证码
    handleSendEmailCode() {
      this.$refs.formRef.validateField('email', (errMsg) => {
        if (errMsg) return false
        if (this.email.timer) clearInterval(this.email.timer)
        this.email.verifyCodeText = 60
        this.email.timer = setInterval(() => {
          if (this.email.verifyCodeText > 1) {
            this.email.verifyCodeText--
          } else {
            clearInterval(this.email.timer)
            this.email.verifyCodeText = '发送验证码'
          }
        }, 1000)
        let params = { email: this.form.email }
        emailCodeForgetGet(params).then(res => {
          // console.log('%c【API D⭐】描述：忘记密码 发送邮箱验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/userController/emailVerification', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          if (res.code === 200) {
            this.$message.success('邮箱验证码已发送，请前往邮箱查收！')
          } else if (res.code === 0) {
            this.$message.error(res.data)
          }
        })
      })
    },
    // 4、下一步
    handleNextStep() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let params = {
            count: this.form[this.currentTab],
            code: this.form.verifyCode,
            phoneOrEmail: this.currentTab === 'phone' ? 0 : this.currentTab === 'email' ? 1 : ''
          }
          userForgetVerify(params).then(res => {
            // console.log('%c【API D⭐】描述：忘记密码-用户身份验证', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
            // console.log('%c【API I⭐】接口：/userController/verification', 'color:#F0F;font-size:12px;font-weight:700;')
            // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
            // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
            if (res.code === 200) {
              this.$message.success('身份验证成功')
              this.$router.push({ path: '/change', query: { userId: res.data } })
            } else if (res.code === 0) {
              this.$message.error(res.data)
            }
          })
        }
      })
    },
    // 5、返回到登录页
    handleBackToLogin() {
      this.$router.back('/login')
    },
  },
}
</script>

<style lang="scss" scoped>
.forget-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("~@/assets/images/bg-login.png");
  background-size: cover;
  background-repeat: no-repeat;

  // background-color: #365470;
  .forget-content {
    width: 460px;
    height: 300px;
    border-radius: 6px;
    padding: 20px 40px;
    background: #fff;
    box-shadow: 1px 1px 15px 3px rgba(0, 0, 0, 0.5);
    border-radius: 8px 8px 8px 8px;
  }

  .tab {
    display: flex;
    width: 380px;
    // margin: 10px auto;
    border-radius: 4px;
    overflow: hidden;
    background-color: #a9bdcf;

    .tab-item {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }

    .active {
      font-weight: 700;
      background-color: #7ea9cf;
      color: #fff;
    }
  }

  ::v-deep .el-form {
    margin: 40px auto 20px;
    width: 380px;

    .el-form-item {
      display: flex;

      .el-form-item__label {
        width: 0;

        &:before {
          display: none;
        }
      }

      .el-form-item__content {
        display: flex;
        flex: 1;
        width: 0;

        .el-input {
          width: 0;
          flex: 1;
          height: 38px;

          input {
            height: 38px;
          }

          .el-input__prefix {
            display: flex;
            align-items: center;
          }

          .input-icon {
            width: 20px;
            font-size: 20px;
          }

          .code-svg {
            font-size: 14px;
          }

          .phone-svg,
          .email-svg {
            font-size: 16px;
          }
        }

        .image-code {
          width: 100px;
          height: 38px;
          float: right;
          margin-left: 10px;

          img {
            height: 100%;
            vertical-align: middle;
            cursor: pointer;
          }
        }

        .verify-code-button {
          width: 120px;
          height: 38px;
          margin-left: 10px;
          padding: 0;
          line-height: 38px;
          text-align: center;
        }
      }
    }

    .next-button {
      display: block;
      margin: 0 auto;
      background-color: #365470;
      color: #fff;
    }

    .back-to-login {
      color: #aaa;
      font-size: 12px;
      cursor: pointer;
      text-align: center;
      margin-top: 10px;

      &:hover {
        color: #365470;
      }
    }
  }
}
</style>