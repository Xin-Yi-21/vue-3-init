<template>
  <div class="change-container">
    <div class="change-content">
      <div class="title">修改密码</div>
      <el-form :model="form" :rules="formRules" ref="formRef">
        <el-form-item prop="password" label="">
          <el-input v-model="form.password" type="password" show-password auto-complete="new-password" placeholder="密码" @keyup.enter.native="handleRegister">
            <svg-icon slot="prefix" icon-class="password" class="input-icon password-svg" />
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="">
          <el-input v-model="form.confirmPassword" type="password" show-password auto-complete="new-password" placeholder="确认密码" @keyup.enter.native="handleRegister">
            <svg-icon slot="prefix" icon-class="password" class="input-icon password-svg" />
          </el-input>
        </el-form-item>
        <el-button class="confirm-button" @click="handleConfirm">确认修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { passwordChange } from '@/api/framework/login'
import { regular } from '@/utils/regular'
const passwordVerify = (rule, value, callback) => {
  if (!value) {
    callback(new Error('密码不能为空'))
  } else if (!regular.password.test(value)) {
    callback(new Error('密码必须包含字母和数字，且在6-18位之间'))
  } else {
    callback()
  }
}
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (!regular.password.test(value)) {
        callback(new Error('密码必须包含字母和数字，且在6-18位之间'))
      } else if (this.form.password !== value) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {
      form: {},
      formRules: {
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }, { validator: passwordVerify, trigger: 'blur' }],
        confirmPassword: [{ required: true, trigger: "blur", message: "请再次输入您的密码" }, { validator: equalToPassword, trigger: 'blur' },],
      },
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.userId) {
      next()
    } else {
      next(vm => {
        vm.$router.push('/forget')
      })
    }
  },
  methods: {

    // 二、操作相关
    // 1、确认修改
    handleConfirm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          let params = {
            password: this.form.password,
            configPassword: this.form.confirmPassword,
            userId: this.$route.query.userId,
          }
          passwordChange(params).then(res => {
            // console.log('%c【API D⭐】描述：修改密码', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
            // console.log('%c【API I⭐】接口：/userController/resetPassword', 'color:#F0F;font-size:12px;font-weight:700;')
            // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
            // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
            if (res.code === 200) {
              this.$message.success('修改密码成功')
              this.$router.push('/login')
            } else if (res.code === 0) {
              this.$message.success('修改密码失败，' + res.data)
            }
          })
        }
      })


    },
  },
}
</script>

<style lang="scss" scoped>
.change-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("~@/assets/images/bg-login.png");
  background-size: cover;
  background-repeat: no-repeat;

  // background-color: #365470;
  .change-content {
    width: 460px;
    height: 280px;
    border-radius: 6px;
    padding: 20px 40px;
    background: #fff;
    box-shadow: 1px 1px 15px 3px rgba(0, 0, 0, 0.5);
    border-radius: 8px 8px 8px 8px;

    .title {
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: 700;
      background-color: #365470;
      border-radius: 4px;
      color: #fff;
    }

    ::v-deep .el-form {
      margin: 40px auto 0;
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

      .confirm-button {
        display: block;
        margin: 0 auto;
        background-color: #365470;
        border-radius: 4px;
        color: #fff;
      }
    }
  }
}
</style>