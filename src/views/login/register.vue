<template>
  <div class="register-container">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="off">
      <div class="register-title">应龙卫星功率预测系统</div>
      <el-form-item prop="username" label="">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="请输入用户名">
          <c-icon slot="prefix" i="account" class="input-icon account-svg" />
        </el-input>
      </el-form-item>
      <el-form-item prop="phone" label="">
        <el-input v-model="registerForm.phone" type="text" auto-complete="off" placeholder="请输入手机号">
          <c-icon slot="prefix" i="phone" class="input-icon phone-svg" />
        </el-input>
      </el-form-item>
      <el-form-item prop="verifCode" label="">
        <el-input v-model="registerForm.verifCode" type="text" auto-complete="off" placeholder="请输入手机验证码" @keyup.enter.native="handleLogin">
          <c-icon slot="prefix" i="code" class="input-icon code-svg" />
        </el-input>
        <el-button class="verify-code-button" @click="handleSendPhoneCode" :disabled="typeof (phone.verifyCodeText) === 'number'">{{ phone.verifyCodeText }}</el-button>
      </el-form-item>
      <el-form-item prop="email" label="">
        <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="请输入邮箱">
          <c-icon slot="prefix" i="email" class="input-icon email-svg" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="">
        <el-input v-model="registerForm.password" type="password" show-password autocomplete="new-password" placeholder="密码" @keyup.enter.native="handleRegister">
          <c-icon slot="prefix" i="password" class="input-icon password-svg" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="">
        <el-input v-model="registerForm.confirmPassword" type="password" show-password autocomplete="new-password" placeholder="确认密码" @keyup.enter.native="handleRegister">
          <c-icon slot="prefix" i="password" class="input-icon password-svg" />
        </el-input>
      </el-form-item>
      <div class="register-part">
        <el-button :loading="loading" size="medium" type="primary" class="register-button" @click.native.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </div>
      <div class="link-part">
        <router-link class="login-link" :to="'/login'">使用已有账户登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { accountVerify, mobileVerify, emailVerify, passwordVerify, equalToPassword, } from '@/utils/verify.js'
import { register, phoneCodeGet } from '@/api/common/login'

export default {
  name: 'Register',
  data() {
    return {
      loading: false,
      enums: {},
      phone: {
        timer: null,
        verifyCodeText: '发送验证码',
      },
      registerForm: {
        username: '',
        // code: '',
        phone: '',
        verifyCode: '',
        email: '',
        password: '',
        confirmPassword: '',
        // uuid: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号', }, { validator: accountVerify, trigger: 'blur' }],
        // code: [{ required: true, trigger: 'blur', message: '请输入图片验证码' },],
        phone: [{ required: true, trigger: 'blur', message: '请输入您的手机号' }, { validator: mobileVerify, trigger: 'blur' }],
        verifyCode: [{ required: true, trigger: 'blur', message: '请输入您的手机验证码' },],
        email: [{ required: true, trigger: 'blur', message: '请输入您的邮箱' }, { validator: emailVerify, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }, { validator: passwordVerify, trigger: 'blur' }],
        confirmPassword: [{ required: true, trigger: "blur", message: "请再次输入您的密码" }, { validator: (a, b, c) => equalToPassword(a, b, c, this.registerForm.password), trigger: 'blur', },],
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 一、初始化相关
    // 0、初始化总调用
    init() { },
    // 二、操作相关
    // 1、发送手机验证码
    handleSendPhoneCode() {
      this.$refs.registerFormRef.validateField('phone', (errMsg) => {
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
        let params = { phoneNumber: this.registerForm.phone, type: '注册' }
        phoneCodeGet(params).then(res => {
          // console.log('%c【API D⭐】描述：发送手机验证码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/phoneCaptchaImage', 'color:#F0F;font-size:12px;font-weight:700;')
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
    // 3、注册
    handleRegister() {
      this.$refs.registerFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {
            userName: this.registerForm.username,
            phonenumber: this.registerForm.phone,
            code: this.registerForm.verifCode,
            email: this.registerForm.email,
            password: this.registerForm.password,
            enPassword: this.registerForm.confirmPassword,
          }
          register(params).then(res => {
            // console.log('%c【API D⭐】描述：注册', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
            // console.log('%c【API I⭐】接口：/userController/userAdd', 'color:#F0F;font-size:12px;font-weight:700;')
            // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
            // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
            if (res.code === 200) {
              this.$alert("<font color='green'>恭喜你，您的账号" + "注册成功！</font>", '系统提示', {
                dangerouslyUseHTMLString: true,
                type: 'success'
              }).then(() => {
                this.$router.push('/login')
              }).catch(() => { })
            } else if (res.code === 0) {
              this.$message.error(res.message)
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("~@/assets/images/bg-login.png");
  background-size: cover;
  background-repeat: no-repeat;

  ::v-deep .register-form {
    width: 460px;
    border-radius: 6px;
    padding: 20px 40px 20px;
    background: #fff;
    box-shadow: 1px 1px 15px 3px rgba(0, 0, 0, 0.5);
    border-radius: 8px 8px 8px 8px;

    .register-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 auto 25px auto;
      text-align: center;
      color: #707070;
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

          .group-svg {
            font-size: 20px;
          }

          .company-svg {
            font-size: 16px;
          }
        }

        .el-select {
          width: 100%;

          .el-input {
            width: 100%;
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

    .register-part {
      .register-button {
        width: 100%;
        margin-bottom: 10px;
        background: #365470;
        border: 1px solid #365470;
        border-radius: 4px;
      }
    }

    .link-part {
      height: 15px;
      margin-bottom: 10px;

      .login-link {
        float: right;
        line-height: 15px;
        font-size: 14px;
        color: #365470;
        cursor: pointer;
      }
    }
  }
}
</style>
