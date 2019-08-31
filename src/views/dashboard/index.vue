<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您: {{ name }}</div>
    <div class="app-container">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.loginID" />
        </el-form-item>
        <el-form-item label="原密码">
          <el-input v-model="oPwdReal" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="nPwdReal" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { calcPwd } from '@/utils/crypt'

export default {
  name: 'Dashboard',
  data() {
    return {
      oPwdReal: '',
      nPwdReal: '',
      form: {
        loginID: '',
        oPassword: '',
        nPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    oPwdReal() {
      this.form.oPassword = calcPwd(this.oPwdReal)
    },
    nPwdReal() {
      this.form.nPassword = calcPwd(this.nPwdReal)
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
