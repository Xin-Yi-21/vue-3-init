<template>
  <el-dialog :visible="true" class="c-dialog" title="" :modal="true" :close-on-click-modal="false" :before-close="handleClose">
    <div slot="title" class="s-d-title">
      <div class="h-t"><c-icon :i="dialog.icon" class="mr-5" size="18"></c-icon> {{ dialog.title }}</div>
      <svg-icon icon-class="c-close" class-name="n-o-i" @click="handleClose"></svg-icon>
    </div>
    <div class="c-d-c">
      <el-form :model="form" :rules="formRules" ref="formRef" class="c-form">
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option v-for="(item, index) in enums.gender" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="role">
          <el-input v-model="form.role" placeholder="请输入身份"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="s-d-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="isConfirmLoading">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { numberVerify } from '@/utils/verify'
// import { dispatchManageAdd, dispatchManageUpdate } from '@/api/project/system-manage.js'
// :before-close 属性，element自带关闭图标触发函数。
// :modal : 是否需要遮罩层，默认true
// :modal-append-to-body : modal是否插入至body元素，默认true
// :append-to-body : dialog是否插入至body元素，默认false
// :close-on-click-modal : 是否可通过点击modal关闭dialog，默认true。。
// :close-on-press-escape : 是否可通过esc关闭dialog，默认true
export default {
  data() {
    return {
      form: {},
      formRules: {
        personName: [{ required: true, message: '姓名不能为空', trigger: 'blur' },],
        gender: [{ required: true, message: '性别不能为空', trigger: 'change' },],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }, { validator: numberVerify, trigger: 'blur' },],
        role: [{ required: true, message: '身份不能为空', trigger: 'blur' },],
      },
      dialog: {},
      enums: {},
      isConfirmLoading: false,
    }
  },
  props: {
    operate: { type: String, default: 'add' },
    info: { type: Object, default: () => { } },
  },
  created() {
    this.init()
  },
  methods: {
    // 一、初始化相关
    // 0、初始化总调用
    init() {
      this.initForm()
      this.getEnums()
    },
    // 1、初始化表单
    initForm() {
      let form = {
        personId: this.info.personId,
        personName: this.info.personName,
        gender: this.info.gender,
        age: this.info.age,
        role: this.info.role,
      }
      switch (this.operate) {
        case 'add':
          this.$set(this, 'form', {})
          this.$set(this, 'dialog', { operate: 'add', title: '人物管理 - 新增', icon: 'c-d-add' })
          break
        case 'view':
          this.$set(this, 'form', form)
          this.$set(this, 'dialog', { operate: 'view', title: '人物管理 - 查看', icon: 'c-d-view' })
          break
        case 'update':
          this.$set(this, 'form', form)
          this.$set(this, 'dialog', { operate: 'update', title: '人物管理 - 更新', icon: 'c-d-update' })
          break
      }
    },
    // 2、获取枚举
    getEnums() {
      let allEnums = JSON.parse(JSON.stringify(this.$store.state.enums.allEnums))
      let enums = {
        gender: allEnums.gender,
      }
      this.$set(this, 'enums', Object.assign({}, this.enums, enums))
    },
    // 二、操作相关
    // 1、确认
    handleConfirm() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return false
        let params = {
          personName: this.form.personName,
          gender: this.form.gender,
          age: this.form.age,
          role: this.form.role,
        }
        switch (this.operate) {
          case 'add':
            dispatchManageAdd(params).then(res => {
              this.$message.success('新增人物成功！')
              this.$emit('refresh')
              this.$emit('close')
            })
            break
          case 'update':
            params.personId = this.form.personId
            dispatchManageUpdate(params).then(res => {
              this.$message.success('更新人物成功！')
              this.$emit('refresh')
              this.$emit('close')
            })
            break
        }
      })
    },
    // 2、关闭
    handleClose(done) {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep.c-dialog {
  .el-dialog {
    width: 600px;

    .c-d-c {
      padding: 20px 20px 10px 10px;
    }
  }
}
</style>
