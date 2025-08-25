<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" :validate-on-rule-change="false" class="login-form">
      <div class="login-title">应龙卫星功率预测系统</div>
      <template v-if="loginForm.loginType === 'account'">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入手机号账号">
            <svg-icon slot="prefix" icon-class="account" class="input-icon account-svg" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password autocomplete="new-password" placeholder="请输入密码" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="input-icon password-svg" />
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-if="captchaOnOff">
          <el-input v-model="loginForm.code" type="text" auto-complete="off" placeholder="请输入图片验证码" style="width: 63%" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="code" class="input-icon code-svg" />
          </el-input>
          <div class="image-code">
            <img :src="codeUrl" @click="getImageCode" />
          </div>
        </el-form-item>
      </template>

      <template v-if="loginForm.loginType === 'phone'">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="请输入手机号账号">
            <svg-icon slot="prefix" icon-class="phone" class="input-icon phone-svg" />
          </el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-input v-model="loginForm.verifyCode" type="text" auto-complete="off" placeholder="请输入手机验证码" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="code" class="input-icon code-svg" />
          </el-input>
          <el-button class="verify-code-button" @click="handleSendPhoneCode" :disabled="typeof (phone.verifyCodeText) === 'number'">{{ phone.verifyCodeText }}</el-button>
        </el-form-item>
      </template>

      <template v-if="loginForm.loginType === 'email'">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" type="text" auto-complete="off" placeholder="请输入邮箱">
            <svg-icon slot="prefix" icon-class="email" class="input-icon email-svg" />
          </el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-input v-model="loginForm.verifyCode" type="text" auto-complete="off" placeholder="请输入邮箱验证码" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="code" class="input-icon code-svg" />
          </el-input>
          <el-button class="verify-code-button" @click="handleSendEmailCode" :disabled="typeof (email.verifyCodeText) === 'number'">{{ email.verifyCodeText }}</el-button>
        </el-form-item>
      </template>

      <div class="link-part">
        <router-link class="register-link" :to="'/register'" v-if="register">注册</router-link>
        <!-- <el-checkbox class="remember-button" v-model="loginForm.rememberMe">记住密码</el-checkbox> -->
        <router-link class="forget-link" :to="'/forget'" v-if="forget">忘记密码?</router-link>
      </div>

      <div class="login-part">
        <el-button size="medium" type="primary" :loading="loading" class="login-button" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </div>

      <div class="type-part">
        <div class="type-item" v-if="loginForm.loginType !== 'account'">
          <svg-icon icon-class="account" class-name="account-svg"></svg-icon>
          <span @click="handleChangeLoginType('account')">账号密码登录</span>
        </div>
        <div class="type-item" v-if="loginForm.loginType !== 'phone'">
          <svg-icon icon-class="phone" class-name="phone-svg"></svg-icon>
          <span @click="handleChangeLoginType('phone')">手机验证登录</span>
        </div>
        <div class="type-item" v-if="loginForm.loginType !== 'email'">
          <svg-icon icon-class="email" class-name="email-svg"></svg-icon>
          <span @click="handleChangeLoginType('email')">邮箱验证登录</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { accountVerify, mobileVerify, emailVerify, passwordVerify, } from '@/utils/verify.js'
// import { imageCodeGet, phoneCodeGet, emailCodeGet } from '@/api/common/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { regular } from '@/utils/regular'
export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        phone: '',
        verifyCode: '',
        email: '',
        // rememberMe: false,
        loginType: 'account'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号', }, { validator: accountVerify, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }, { validator: passwordVerify, trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur', message: '请输入您的手机号' }, { validator: mobileVerify, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', message: '请输入您的邮箱' }, { validator: emailVerify, trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', message: '请输入图片验证码' },],
        verifCode: [{ required: true, trigger: 'blur', message: '请输入手机验证码' },],
      },
      loading: false,
      captchaOnOff: true,         // 验证码开关
      register: true,             // 注册开关
      forget: true,               // 忘记密码开关
      redirect: undefined,
      phone: {
        timer: null,
        verifyCodeText: '发送验证码',
      },
      email: {
        timer: null,
        verifyCodeText: '发送验证码',
      }

    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    if (this.phone.timer) clearInterval(this.phone.timer)
    if (this.email.timer) clearInterval(this.email.timer)
  },
  methods: {
    // 一、初始化相关
    // 0、初始化总调用
    init() {
      this.getImageCode()
      // this.getCookie()
    },
    // 1、获取图片验证码
    getImageCode() {
      imageCodeGet().then(res => {
        // console.log('%c【API D⭐】描述：获取图片验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
        // console.log('%c【API I⭐】接口：/captchaImage', 'color:#F0F;font-size:12px;font-weight:700;')
        // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;',)
        // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
        // this.captchaOnOff = res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.data.img
          this.loginForm.uuid = res.data.uuid
        }
      })
    },
    // // 2、获取cookie
    // getCookie() {
    //   const username = Cookies.get("username")
    //   const password = Cookies.get("password")
    //   const rememberMe = Cookies.get('rememberMe')
    //   this.loginForm = {
    //     username: username === undefined ? this.loginForm.username : username,
    //     password: password === undefined ? this.loginForm.password : decrypt(password),
    //     rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    //   }
    // },
    // 二、操作相关
    // 1、登录
    handleLogin() {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          // if (this.loginForm.rememberMe) {
          //   Cookies.set('username', this.loginForm.username, { expires: 30 })
          //   Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
          //   Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          // } else {
          //   Cookies.remove('username')
          //   Cookies.remove('password')
          //   Cookies.remove('rememberMe')
          // }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(() => { })
          }).catch(() => {
            this.loading = false
            if (this.captchaOnOff) {
              this.getImageCode()
            }
          })
        }
      })
    },
    // 2、改变登录方式
    handleChangeLoginType(value) {
      this.loginForm.loginType = value
      this.$refs.loginFormRef.resetFields()     // 重置表单
      this.$refs.loginFormRef.clearValidate()    // 清除表单验证
    },
    // 3、发送手机验证码
    handleSendPhoneCode() {
      this.$refs.loginFormRef.validateField('phone', (errMsg) => {
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
        let params = { phoneNumber: this.loginForm.phone, type: '登录' }
        phoneCodeGet(params).then(res => {
          // console.log('%c【API D⭐】描述：发送手机验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/phoneCaptchaImage', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', '')
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          if (res.code === 200) {
            this.$message.success('手机验证码已发送，请前往手机短信查收！')
          } else if (res.code === 0) {
            this.$message.error(res.data)
          }
        })
      })
    },
    // 4、发送邮箱验证码
    handleSendEmailCode() {
      this.$refs.loginFormRef.validateField('email', (errMsg) => {
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
        let params = { email: this.loginForm.email }
        emailCodeGet(params).then(res => {
          // console.log('%c【API D⭐】描述：发送邮箱验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/emailCaptchaCode', 'color:#F0F;font-size:12px;font-weight:700;')
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
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("~@/assets/images/bg-login.png");
  background-size: cover;
  background-repeat: no-repeat;

  // background-color: #365470;
  ::v-deep .login-form {
    width: 460px;
    border-radius: 6px;
    padding: 10px 40px 20px;
    background: #fff;
    box-shadow: 1px 1px 15px 3px rgba(0, 0, 0, 0.5);
    border-radius: 8px 8px 8px 8px;

    .login-title {
      font-size: 20px;
      font-weight: 700;
      margin: 10px auto 25px auto;
      text-align: center;
      color: #365470;
    }

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

    .link-part {
      height: 15px;
      margin-bottom: 10px;

      .register-link {
        float: left;
        font-size: 12px;
        color: #365470;
        line-height: 15px;
      }

      .forget-link {
        float: right;
        font-size: 14px;
        color: #999;
        line-height: 15px;
      }
    }

    .login-part {
      .login-button {
        width: 100%;
        margin-bottom: 10px;
        background: #365470;
        border: 1px solid #365470;
        border-radius: 4px;
      }
    }

    .type-part {
      display: flex;
      font-size: 14px;
      color: #365470;

      .type-item {
        flex: 1;
        text-align: center;

        .account-svg {
          font-size: 18px;
          margin-right: 2px;
          transform: translateY(1px);
        }

        .phone-svg {
          font-size: 16px;
          margin-right: 2px;
          transform: translateY(1px);
        }

        .email-svg {
          font-size: 16px;
          margin-right: 3px;
          transform: translateY(1px);
        }

        span {
          text-align: center;
          cursor: pointer;
          // border-bottom: 1px solid #365470;
        }
      }
    }
  }
}
</style>
